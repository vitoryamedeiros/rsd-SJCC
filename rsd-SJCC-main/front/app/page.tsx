import { Suspense } from "react"
import { Article } from "@/components/article"
import { CommentSection } from "@/components/comment-section"
import { CommentForm } from "@/components/comment-form"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Article />
      <Separator className="my-8" />

      <h2 className="text-2xl font-bold mb-6">Comentários</h2>

      {/* Display API configuration information */}
      {(!process.env.API_TOKEN || !process.env.API_URL) && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuração da API</AlertTitle>
          <AlertDescription>
            {!process.env.API_TOKEN && !process.env.API_URL ? (
              <p>As variáveis de ambiente API_TOKEN e API_URL não estão configuradas. Usando dados simulados.</p>
            ) : !process.env.API_TOKEN ? (
              <p>A variável de ambiente API_TOKEN não está configurada. Usando dados simulados.</p>
            ) : (
              <p>A variável de ambiente API_URL não está configurada. Usando dados simulados.</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      <CommentForm />

      <div className="mt-8">
        <Suspense fallback={<CommentsLoading />}>
          <CommentSection />
        </Suspense>
      </div>
    </main>
  )
}

function CommentsLoading() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
    </div>
  )
}
