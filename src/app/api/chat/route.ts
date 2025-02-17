import { DataAPIClient } from '@datastax/astra-db-ts'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { getTemplate } from '../templates/template'

export const maxDuration = 30 // Allow streaming responses up to 30 seconds

const template = getTemplate()
const RULE = process.env.RULE;

const getContent = (context: string, question: string) => `
  '

${RULE}

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
