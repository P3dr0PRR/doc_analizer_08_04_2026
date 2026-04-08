interface ApiKeyInputProps {
  apiKey: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ apiKey, onChange }: ApiKeyInputProps) {
  return (
    <div className="w-full max-w-lg flex flex-col gap-2 mb-6">
      <label className="text-sm text-gray-400 font-medium">
        Anthropic API Key
      </label>
      <input
        type="password"
        placeholder="sk-ant-..."
        value={apiKey}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
      />
      <p className="text-xs text-gray-500">
        Sua chave fica apenas aqui no navegador, nunca é enviada para servidores
        externos.
      </p>
    </div>
  );
}
