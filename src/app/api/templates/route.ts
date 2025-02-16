import { getTemplate } from './template'

export async function GET(req: Request) {
  try {
    const templates = await getTemplate()
    return Response.json(templates)
  } catch (err) {
    throw err
  }
}
