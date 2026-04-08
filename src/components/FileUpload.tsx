interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function FileUpload({ file, onChange }: FileUploadProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    onChange(selected);
  }

  return (
    <div className="w-full max-w-lg flex flex-col gap-2 mb-6">
      <label className="text-sm text-gray-400 font-medium">Documento PDF</label>
      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-800/50">
        <span className="text-gray-400 text-sm">
          {file ? file.name : "Clique para selecionar um PDF"}
        </span>
        {file && (
          <span className="text-xs text-gray-500 mt-1">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        )}
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
