import { useState, type ChangeEvent } from "react";
import "./App.css";

type FileContent = string | null;

type ProductRequestBody = {
  id: number;
  nome_produto: string;
  valor_unit: number;
};

type ItemRequestBody = {
  id: number;
  nome_produto: string;
  id_cliente: number;
  nome_cliente: string;
  qtd_vendida: number;
  valor_unit: number;
  data_venda: string;
};

export default function App() {
  const [fileContent, setFileContent] = useState<FileContent>("");
  const [fileName, setFileName] = useState<string>("");

  const [requestBody, setRequestBody] = useState<ItemRequestBody[]>([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);

        // Exemplo: Se fosse um JSON, você faria:
        // const jsonObject = JSON.parse(content);
        // console.log(jsonObject);
      };

      reader.readAsText(file);
    }
  };

  const processData = () => {
    if (fileContent) {
      let arr = fileContent.split("\n");
      arr = arr.map((e) => {
        const item: ItemRequestBody = {
          id: parseInt(e.slice(0, 4).trim()),
          nome_produto: e.slice(4, 58).trim(),
          id_cliente: parseInt(e.slice(58, 62).trim()),
          nome_cliente: e.slice(62, 112).trim(),
          qtd_vendida: parseInt(e.slice(112, 116).trim()),
          valor_unit: parseFloat(e.slice(116, 125).trim()),
          data_venda: e.slice(125, 136).trim(),
        };

        requestBody.push(item);
      });

      requestBody.forEach((e) => console.log(e));
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        accept=".dat"
        onChange={handleFileChange}
      />

      {fileName && (
        <p>
          Arquivo selecionado: <strong>{fileName}</strong>
        </p>
      )}

      {fileContent && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <pre>{fileContent}</pre>
        </div>
      )}

      {!fileContent && <p>Selecione um arquivo para ver seu conteúdo.</p>}

      <button onClick={processData}>process data</button>
    </div>
  );
}
