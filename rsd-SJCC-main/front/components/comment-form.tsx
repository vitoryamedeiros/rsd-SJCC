"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createComment } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  autor: z.string().optional(),
  comentario: z.string().min(3, {
    message: "O comentário deve ter pelo menos 3 caracteres.",
  }),
})

export function CommentForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    status: "success" | "error"
    message: string
  } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      autor: "",
      comentario: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const result = await createComment(values)

      if (result.success) {
        setSubmitResult({
          status: "success",
          message: "Comentário enviado com sucesso!",
        })
        form.reset()

        toast({
          title: "Comentário enviado",
          description: "Seu comentário foi publicado com sucesso.",
        })
      } else {
        setSubmitResult({
          status: "error",
          message: result.error || "Erro ao enviar comentário. Tente novamente.",
        })

        toast({
          variant: "destructive",
          title: "Erro ao enviar comentário",
          description: result.error || "Ocorreu um erro ao enviar seu comentário.",
        })
      }
    } catch (error) {
      setSubmitResult({
        status: "error",
        message: "Erro ao enviar comentário. Tente novamente.",
      })

      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao enviar seu comentário.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="autor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comentario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentário</FormLabel>
                <FormControl>
                  <Textarea placeholder="Escreva seu comentário aqui..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar comentário"}
          </Button>
        </form>
      </Form>

      {submitResult && (
        <Alert variant={submitResult.status === "success" ? "default" : "destructive"}>
          {submitResult.status === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{submitResult.status === "success" ? "Sucesso" : "Erro"}</AlertTitle>
          <AlertDescription>{submitResult.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
