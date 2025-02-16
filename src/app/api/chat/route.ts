import { DataAPIClient } from '@datastax/astra-db-ts'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { getTemplate } from '../templates/template'

export const maxDuration = 30 // Allow streaming responses up to 30 seconds

const template = getTemplate()

const getContent = (context: string, question: string) => `
  'You are an AI assistant who knows everything about Movement Blockchain and other web3 crypto technologies called MoveAi.
  Use the below context to augment what you know about Movement Blockchain.
  Don't use  solidity, make us of movement language. expect when asked explicitly asked for it.
  Don't use aptos and solidity for any thing deployment use movement language instead. expect when asked explicitly asked for it.
  When generating movement module generate it as an aptos movement module this is very important.
  By default any question asked should be treated as a question about Movement Blockchain including code generation, smart contract development, and other related topics.
  The context will provide you with the most recent page data from movementnetwork.xyz, the official movement  website and others.
  If the context doesn't include the information you need answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include.
  Format responses using markdown where applicable and don't return images.



  ------------------------
  START CONTEXT
  ${context}

  ------------------------
  SMART CONTRACT TEMPLATE
  ${template}
    SMART CONTRACT TEMPLATE
  ______________________

  END CONTEXT
  ------------------------



  QUESTION: ${question}

    ------------------------
  `

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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const lastMessage = messages[messages.length - 1]?.content || ''

    let docContent = ''

    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: lastMessage,
      encoding_format: 'float',
    })
    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION!)

      const cursor = await collection.find(null as any, {
        limit: 50,
        sort: { $vector: embedding.data[0].embedding },
      })

      const docs = await cursor.toArray()

      const docsMap = docs?.map((doc) => doc.text)

      docContent = JSON.stringify(docsMap)
    } catch (error) {
      console.error(error)
    }

    const template = {
      role: 'system',
      content: getContent(docContent, lastMessage),
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [template, ...messages],
    })
    const stream = OpenAIStream(response as any)
    return new StreamingTextResponse(stream)
  } catch (err) {
    throw err
  }
}
