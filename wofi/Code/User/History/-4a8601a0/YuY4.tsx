import { useState, type ChangeEvent } from "react";

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

export default function Reader() {
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
      const arr = fileContent.split("\n");

      arr.map((e) => {
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

      requestBody.forEach((e) => console.log(e));
    }
  };

  const send = async () => {
    console.log("enviando...")
    const URL_API = "http://localhost:8080/venda"; // exempplo
    try {
      const res = await fetch(URL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        console.log("HTTP STATUS 202");
      } else {
        const errorText = await res.text();
        throw new Error(`Erro HTTP: ${res.status} - ${errorText}`);
      }
    } catch (e) {
      console.error("Erro ao enviar o array:", e);
      throw e;
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

      {!fileContent && <p>Selecione um arquivo para ver seu conteúdo.</p>}

      <button onClick={processData}>process data (ver console)</button>
      <button onClick={send}>Enviar</button>
    </div>
  );
}
