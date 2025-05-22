import { type NextRequest, NextResponse } from "next/server"

// Constantes
const API_URL = process.env.API_URL || "http://localhost:3000"
const API_TOKEN = process.env.API_TOKEN || ""

// Função para obter o token de autenticação
function getAuthHeaders() {
  return {
    Authorization: API_TOKEN,
    "Content-Type": "application/json",
  }
}

// Rota GET para buscar comentários
export async function GET() {
  // If no API token is provided, return mock data
  if (!API_TOKEN) {
    console.log("No API token provided, returning mock data")
    return NextResponse.json([
      {
        id: 1,
        comentario: "Excelente artigo! Muito informativo sobre IA.",
        autor: "Maria Silva",
        status: "aceito",
        data_criacao: new Date().toISOString(),
      },
      {
        id: 2,
        comentario: "Gostaria de ver mais conteúdo sobre aplicações práticas de IA na saúde.",
        autor: "João Santos",
        status: "aceito",
        data_criacao: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
    ])
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_URL}/comentarios`, {
      headers: getAuthHeaders(),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId))

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar comentários:", error)

    // If the error is due to the API being unavailable, return mock data
    if (
      error instanceof Error &&
      (error.message.includes("Failed to fetch") || error.message.includes("abort") || error.name === "AbortError")
    ) {
      console.log("API unavailable, returning mock data")
      return NextResponse.json([
        {
          id: 1,
          comentario: "Excelente artigo! Muito informativo sobre IA.",
          autor: "Maria Silva",
          status: "aceito",
          data_criacao: new Date().toISOString(),
        },
        {
          id: 2,
          comentario: "Gostaria de ver mais conteúdo sobre aplicações práticas de IA na saúde.",
          autor: "João Santos",
          status: "aceito",
          data_criacao: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
      ])
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido ao conectar com o servidor" },
      { status: 500 },
    )
  }
}

// Rota POST para criar um novo comentário
export async function POST(request: NextRequest) {
  // If no API token is provided, simulate a successful response
  if (!API_TOKEN) {
    console.log("No API token provided, simulating successful comment creation")
    return NextResponse.json({ mensagem: "Comentário criado com sucesso (simulado)" })
  }

  try {
    const body = await request.json()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_URL}/comentarios`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId))

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Erro ao criar comentário:", error)

    // If the error is due to the API being unavailable, simulate a response
    if (
      error instanceof Error &&
      (error.message.includes("Failed to fetch") || error.message.includes("abort") || error.name === "AbortError")
    ) {
      console.log("API unavailable, simulating comment creation response")
      return NextResponse.json({ mensagem: "Comentário criado com sucesso (simulado)" })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao conectar com o servidor" },
      { status: 500 },
    )
  }
}
