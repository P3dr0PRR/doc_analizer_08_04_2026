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

  async function handleAnalyze() {
    if (!file || !apiKey) return
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const data = await analyzeDocument(file, apiKey)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Analisador de Documentos</h1>
      <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />
      <FileUpload file={file} onChange={setFile} />

      <button
        onClick={handleAnalyze}
        disabled={!file || !apiKey || loading}
        className="w-full max-w-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors mb-6"
      >
        {loading ? 'Analisando...' : 'Analisar Documento'}
      </button>

      {error && (
        <div className="w-full max-w-lg bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-200">Resultado</h2>
          <div className="flex flex-col gap-3">
            {([['Nome', result.nome], ['Validade', result.validade], ['Categoria', result.categoria]] as const).map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

export default App