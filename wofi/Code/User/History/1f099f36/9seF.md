# Notion Backlog Importer

Este projeto automatiza a criação de páginas em uma database do Notion a partir de um arquivo CSV (backlog). Ele lê cada linha do CSV, monta uma estrutura de "história técnica" (template + propriedades) e cria a página correspondente na database do Notion, incluindo blocos com a história do usuário, critérios de aceitação e tarefas técnicas.

Principais arquivos
- [src/main.ts](src/main.ts) — ponto de entrada. Carrega variáveis de ambiente e chama a rotina de processamento.
- [src/repositories/CsvRepository.ts](src/repositories/CsvRepository.ts) — contém a função [`processCsvAndCreatePages`](src/repositories/CsvRepository.ts) que parseia o CSV e aciona a criação de páginas.
- [src/repositories/PageRepository.ts](src/repositories/PageRepository.ts) — classe [`PageRepository`](src/repositories/PageRepository.ts) que monta as propriedades e blocos e cria as páginas no Notion.
- [src/lib/notion.ts](src/lib/notion.ts) — função [`createNotionClient`](src/lib/notion.ts) que instancia o cliente oficial da Notion.
- backlog.csv — arquivo CSV de exemplo com os itens a serem importados.
- .env — arquivo para armazenar as credenciais (sempre ignorado pelo VCS via .gitignore).

Como funciona (resumo)
1. [src/main.ts](src/main.ts) carrega as variáveis de ambiente e cria o cliente Notion via [`createNotionClient`](src/lib/notion.ts).
2. Chama [`processCsvAndCreatePages`](src/repositories/CsvRepository.ts) passando o caminho do CSV e o ID da database.
3. Para cada linha do CSV, o repositório monta um objeto `ITemplate` e um objeto `Properties` e chama `PageRepository.createPage` (implementado em [src/repositories/PageRepository.ts](src/repositories/PageRepository.ts)).
4. `PageRepository` cria a página na database e anexa blocos (História, Critérios de Aceitação, Tarefas Técnicas).

Requisitos e configuração
- Node.js (versão compatível com as dependências).
- Copie as credenciais do Notion para o arquivo `.env` (ex.: `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NOTION_PAGE_ID`).
- O arquivo `.env` já está listado em [.gitignore](.gitignore) — não commitá-lo.

Exemplo de variáveis de ambiente (.env)
NOTION_TOKEN=<sua_chave>
NOTION_DATABASE_ID=<id_da_database>
NOTION_PAGE_ID=<id_da_página>  # opcional conforme uso

Formato do CSV
O CSV deve seguir o cabeçalho exato (uma linha):
title,status,tipo,prioridade,especialidade,epicoId,responsavelId,who,what,for,acceptanceCriteria,technicalTasks

Regras importantes:
- `acceptanceCriteria` e `technicalTasks` são listas separadas por pipe (`|`). Campos que contenham vírgulas, pipes ou caracteres especiais devem estar entre aspas duplas.
- Campos `who`, `what`, `for` só são preenchidos quando `tipo` = `User Story`. Para outros tipos, esses campos ficam vazios.
- Consulte [backlog.csv](backlog.csv) como exemplo.

Scripts úteis
- Instalar dependências:
  ```sh
  npm install
  ```
- Executar (produção/execução direta dos .ts conforme package.json):
  ```sh
  npm run start
  ```
- Modo de desenvolvimento (watch + transform TypeScript conforme script do package.json):
  ```sh
  npm run dev
  ```

Observações e limitações
- O projeto usa o SDK oficial da Notion; a criação de páginas falhará se o token ou o ID da database estiverem ausentes ou incorretos (a função [`createNotionClient`](src/lib/notion.ts) lança erro se não houver token).
- O CSV deve estar na raiz do projeto por padrão (backlog.csv) ou passar outro caminho ao chamar `processCsvAndCreatePages`.
- Verifique os valores de seleção (Status, Tipo, Prioridade, Especialidade) conforme a configuração da sua database no Notion.

Arquivos relacionados
- [package.json](package.json)
- [tsconfig.json](tsconfig.json)
- [.env](.env)
- [.gitignore](.gitignore)

Uso típico
1. Preencha `backlog.csv` seguindo o cabeçalho e regras.
2. Configure `.env` com suas credenciais.
3. Rode `npm run start` (ou `npm run dev`) e acompanhe a saída no console enquanto as páginas são criadas.

Licença
Projeto simples de automação — adapte conforme necessário