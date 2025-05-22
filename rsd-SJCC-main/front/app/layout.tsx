import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Comentários com Validação",
  description: "Uma aplicação para demonstrar validação de comentários ofensivos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">Blog Tecnológico</h1>
              <nav>
                <ul className="flex gap-4">
                  <li>
                    <a href="#" className="hover:underline">
                      Início
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Artigos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Sobre
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {children}

          <footer className="border-t mt-12 py-6 bg-muted">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>© 2024 Blog Tecnológico. Todos os direitos reservados.</p>
            </div>
          </footer>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
