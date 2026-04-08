import { useState } from "react"
import { ApiKeyInput } from "./components/ApiKeyInput"
import { FileUpload } from "./components/FileUpload"
import { analyzeDocument, type DocumentResult } from './services/analyzeDocument'

function App() {
  const [apiKey, setApiKey] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<DocumentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Analisador de Documentos</h1>
      <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />
      <FileUpload file={file} onChange={setFile} />
    </main>
  )
}

export default App