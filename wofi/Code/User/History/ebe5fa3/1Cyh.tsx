import { useState, type ChangeEvent } from "react";
import "./App.css";

type FileContent = string | null;

type ProductRequestBody = {
  id: number;
  nome_produto: string;
  valor_unit: number;
};

type ClientRequestBody = {
  id_cliente: number;
  nome_cliente: string;
};

type ItemRequestBody = {
  data_venda: string;
  qtd_vendida: number;
  produto: ProductRequestBody;
  cliente: ClientRequestBody;
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
          data_venda: e.slice(125, 136).trim(),
          qtd_vendida: parseInt(e.slice(112, 116).trim()),
          produto: {
            id: parseInt(e.slice(0, 4).trim()),
            nome_produto: e.slice(4, 58).trim(),
            valor_unit: parseFloat(e.slice(116, 125).trim()),
          },
          cliente: {
            id_cliente: parseInt(e.slice(58, 62).trim()),
            nome_cliente: e.slice(62, 112).trim(),
          },
        };

        setRequestBody((rb) => [...rb, item]);
      });
    }
  };

  const send = async () => {
    const URL_API = "http://localhost:8080/send_vendas" // exempplo
    await fetch(URL_API, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })
  }

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

      {!fileContent && <p>Selecione um arquivo para ver seu conteúdo.</p>}

      <button onClick={processData}>process data</button>
    </div>
  );
}
