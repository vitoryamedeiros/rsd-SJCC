import { getComments } from "@/lib/api"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export async function CommentSection() {
  const { comments, error } = await getComments()

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar comentários</AlertTitle>
        <AlertDescription className="mt-2">
          <p>{error}</p>
          <p className="mt-2">
            Verifique se o servidor da API está em execução e se as variáveis de ambiente estão configuradas
            corretamente.
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  if (!comments || comments.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Seja o primeiro a comentar neste artigo!</div>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>{comment.autor ? comment.autor.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{comment.autor || "Usuário anônimo"}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.data_criacao).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>{comment.comentario}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
