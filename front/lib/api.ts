// Tipos
export interface Comment {
  id: number
  comentario: string
  autor?: string
  status: "aceito" | "recusado"
  data_criacao: string
}

// Constantes
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
const API_TOKEN = process.env.API_TOKEN || ""

// Função para obter o token de autenticação
function getAuthHeaders() {
  return {
    Authorization: API_TOKEN,
    "Content-Type": "application/json",
  }
}

// Função para buscar comentários
export async function getComments() {
  try {
    // Check if we're in a development/preview environment and provide fallback data
    if (!API_TOKEN || process.env.NODE_ENV === "development") {
      console.log("Using mock data for comments (no API token or in development mode)")
      return {
        comments: [
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
        ],
        error: null,
      }
    }

    // Use the API route instead of direct API call to avoid CORS issues
    const response = await fetch("/api/comentarios", {
      headers: getAuthHeaders(),
      next: { revalidate: 60 }, // Revalidar a cada 60 segundos
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar comentários: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Check if the response contains an error
    if (data.error) {
      throw new Error(data.error)
    }

    // Filtra apenas comentários aceitos
    const acceptedComments = Array.isArray(data) ? data.filter((comment: any) => comment.status === "aceito") : []

    return { comments: acceptedComments as Comment[], error: null }
  } catch (error) {
    console.error("Erro ao buscar comentários:", error)
    return {
      comments: [],
      error: error instanceof Error ? error.message : "Erro desconhecido ao conectar com o servidor",
    }
  }
}

// Função para criar um novo comentário
export async function createComment(data: { autor?: string; comentario: string }) {
  try {
    // Use the API route instead of direct API call
    const response = await fetch("/api/comentarios", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.mensagem || "Erro ao criar comentário",
      }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Erro ao criar comentário:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar com o servidor",
    }
  }
}
