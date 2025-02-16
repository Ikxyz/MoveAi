import { DataAPIClient } from '@datastax/astra-db-ts'
import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer'
import fs from 'fs'
import fsAsync from 'fs/promises'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import OpenAI from 'openai'
import { URLS } from './output'

type SimilarityMetric = 'dot_product' | 'cosine' | 'euclidean'

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_KEYSPACE,
  ASTRA_DB_COLLECTION,
  OPENAI_API_KEY,
} = process.env

if (
  !ASTRA_DB_API_ENDPOINT ||
  !ASTRA_DB_APPLICATION_TOKEN ||
  !ASTRA_DB_KEYSPACE ||
  !ASTRA_DB_COLLECTION ||
  !OPENAI_API_KEY
) {
  throw new Error('Missing environment variables')
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)

const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_KEYSPACE })

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
})

const createCollection = async (
  similarityMetric: SimilarityMetric = 'dot_product',
) => {
  await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: { dimension: 1536, metric: similarityMetric },
  })
  console.log(`Created collection ${ASTRA_DB_COLLECTION}`)
}

const saveLastIndex = async (index: number) => {
  await fsAsync.writeFile(
    process.cwd() + '/src/script/lastIndex.txt',
    index.toString(),
  )
}

const getLastIndex = (): number => {
  try {
    const num = fs
      .readFileSync(process.cwd() + '/src/script/lastIndex.txt')
      .toString()
    if (!num) return 0
    return Number(num)
  } catch (error) {
    return 0
  }
}

const readData = async (filePath: string) => {
  try {
    const data = await fsAsync.readFile(filePath, 'utf-8')
    return data
  } catch (error) {
    throw Error('Error reading file: ' + error)
  }
}

const loadSampleData = async () => {
  try {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    console.log(`Loading sample data into collection ${ASTRA_DB_COLLECTION}`)
    let lastIndex = getLastIndex()
    for (let i = lastIndex; i <= URLS.length; i++) {
      await saveLastIndex(i)
      const url = URLS[i]
      console.log(`Loading content from URL: ${url}`)
      const content = await scrapePage(url)
      if (!content) {
        console.log('No content found for URL: ${url}')
        continue
      }
      console.log(`Splitting content into chunks...`)
      const chucks = await splitter.splitText(content)
      for await (const chunk of chucks) {
        console.log(`Generating embedding for chunk...`)
        const embedding = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk,
          encoding_format: 'float',
        })

        console.log(`Inserting chunk into collection...`)
        const vector = embedding.data[0].embedding
        const res = await collection.insertOne({ $vector: vector, text: chunk })
        console.log(res)
      }
    }
  } catch (error) {
    console.log('error occurred, Restarting')
    setTimeout(loadSampleData, 10 * 1000)
  }
  console.log('Finished loading sample data')
}

const scrapePage = async (url: string) => {
  try {
    console.log(`Starting to scrape page: ${url}`)
    const loaded = new PuppeteerWebBaseLoader(url, {
      launchOptions: {},
      gotoOptions: {
        waitUntil: 'domcontentloaded',
      },
      evaluate: async (page, browser) => {
        console.log(`Evaluating page for URL: ${url}`)
        const result = await page.evaluate(async () => document.body.innerHTML)
        console.log(`Page evaluated for URL: ${url}`)
        await browser.close()
        console.log(`Browser closed for URL: ${url}`)
        return result
      },
    })
    const scrapedContent = await loaded.scrape()
    console.log(`Scraping completed for URL: ${url}`)
    return scrapedContent?.replace(/<[^>]+>/gm, '')
  } catch (error) {
    console.log(error)
  }
}

// await createCollection().catch(console.error)
await loadSampleData()

// const unDone = URLS.filter((e) => !DONE_URLS.includes(e))
// console.log(process.cwd() + '/undone.ts')
// fs.writeFile(
//   process.cwd() + '/undone.ts',
//   `export const URLS = [${JSON.stringify(unDone.sort())}]`,
//   console.error,
// )
