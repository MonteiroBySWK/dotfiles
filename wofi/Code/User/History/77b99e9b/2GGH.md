# Backlog (CSV -> Notion)

Esta documentação descreve como preparar e usar o arquivo CSV (`backlog.csv`) para importar itens de backlog para uma database do Notion usando este projeto.

## Objetivo

O objetivo desta documentação é explicar o formato do CSV, as regras de preenchimento, o mapeamento dos campos para propriedades e blocos no Notion e exemplos de uso. Use este arquivo para preparar o seu backlog antes de rodar o importador.

## Local e nome do arquivo

Por convenção o importador espera o arquivo `backlog.csv` na raiz do projeto. Você pode apontar outro caminho quando chamar a função de processamento no código, mas o comportamento padrão usa `backlog.csv`.

## Cabeçalho obrigatório

O CSV deve começar com a seguinte linha de cabeçalho (exatamente essas colunas):

```
title,status,tipo,prioridade,especialidade,epicoId,responsavelId,who,what,for,acceptanceCriteria,technicalTasks
```

- A ordem das colunas deve ser mantida.
- Colunas extras serão ignoradas pelo importador.

## Descrição dos campos

- title: (string) Título do item. Usado como título da página criada no Notion.
- status: (string) Valor de seleção para a propriedade "Status" na database do Notion (ex.: "To Do", "In Progress", "Done"). Deve existir como uma opção na database.
- tipo: (string) Tipo do item (ex.: "User Story", "Bug", "Task"). Define se os campos `who/what/for` serão usados.
- prioridade: (string) Valor de seleção para a propriedade "Prioridade" (ex.: "Alta", "Média", "Baixa"). Deve existir como opção na database.
- especialidade: (string) Valor de seleção para a propriedade "Especialidade" (ex.: "Frontend", "Backend", "Infra"). Deve existir como opção na database.
- epicoId: (string) ID do épico (se aplicável). Mapeado para a propriedade de texto ou relacionamento conforme a implementação da database.
- responsavelId: (string) ID do responsável (se aplicável). Pode ser usado para relacionar ou apenas como texto.
- who: (string) Parte da fórmula de user story: quem (ex.: "Como usuário"). Preenchido apenas para `tipo = User Story`.
- what: (string) Parte da fórmula de user story: o quê (ex.: "Quero salvar minhas notas"). Preenchido apenas para `tipo = User Story`.
- for: (string) Parte da fórmula de user story: para quê (ex.: "Para acessar em qualquer dispositivo"). Preenchido apenas para `tipo = User Story`.
- acceptanceCriteria: (string) Lista de critérios de aceitação separados por pipe (`|`). Ex.: "Critério 1|Critério 2|Critério 3". Serão adicionados como blocos do tipo `to_do` ou `bulleted_list` (conforme implementação).
- technicalTasks: (string) Lista de tarefas técnicas separadas por pipe (`|`). Ex.: "Criar endpoint|Adicionar testes|Atualizar docs". Serão transformadas em blocos de subtarefas ou `to_do`.

## Regras de formatação

- Campos que contenham vírgulas, pipes (`|`) ou quebras de linha devem estar entre aspas duplas.
- Para listas (`acceptanceCriteria`, `technicalTasks`) use o pipe (`|`) como separador interno entre itens.
- Se um campo não se aplica, deixe em branco (duas vírgulas consecutivas no CSV).
- `who/what/for` só devem ser preenchidos quando `tipo` for exatamente `User Story`.

## Exemplos

Linha simples (User Story):

```
Implementar login,To Do,User Story,Alta,Backend,EP-123,USER-1,Como usuário,Quero fazer login,Para acessar minhas informações,"Usuário insere email|Usuário insere senha","Criar endpoint de auth|Persistir sessão"
```

Linha genérica (Task):

```
Atualizar dependências,To Do,Task,Média,DevOps,,, , , ,"","Rodar npm audit|Atualizar lockfile"
```

Nota: observe as aspas em campos que contêm pipes ou vírgulas.

## Mapeamento para Notion

Ao processar cada linha, o importador faz o seguinte mapeamento (resumo):

- `title` -> título da página no Notion
- `status` -> propriedade de seleção "Status"
- `tipo` -> propriedade de seleção "Tipo"
- `prioridade` -> propriedade de seleção "Prioridade"
- `especialidade` -> propriedade de seleção "Especialidade"
- `epicoId` -> propriedade de texto (ou relacionamento se configurado)
- `responsavelId` -> propriedade de usuário/relacionamento ou texto
- `who/what/for` -> se `tipo = User Story`, são concatenados em um bloco de texto que representa a história do usuário (por exemplo: "Como X, quero Y, para Z")
- `acceptanceCriteria` -> cada item vira um bloco de lista/checkbox/`to_do` ou `bulleted_list` conforme configuração no projeto
- `technicalTasks` -> cada item vira um bloco de tarefas técnicas (`to_do` ou `bulleted_list`)

A importação pressupõe que as opções de seleção (Status, Tipo, Prioridade, Especialidade) já existem na database do Notion. Se houver divergência de valores, a página será criada mas a seleção pode falhar ou criar entradas inesperadas dependendo do SDK/versão.

## Execução

1. Instale dependências:

```sh
npm install
```

2. Configure as variáveis de ambiente em `.env` (na raiz do projeto):

```
NOTION_TOKEN=<sua_chave>
NOTION_DATABASE_ID=<id_da_database>
NOTION_PAGE_ID=<id_da_página>  # opcional
```

3. Coloque o arquivo `backlog.csv` na raiz do projeto seguindo o formato acima.

4. Rode o importador:

```sh
npm run start
```

Durante a execução o processo logará as ações no console (criação de página, erros, etc.).

## Erros comuns e como diagnosticar

- Token inválido ou faltando: verifique `NOTION_TOKEN`. A inicialização do cliente Notion falha se o token não estiver presente.
- Database ID incorreto: verifique `NOTION_DATABASE_ID` e se a integração tem permissões para essa database.
- Valores de seleção não existentes: verifique as options na database do Notion (Status, Tipo, Prioridade, Especialidade).
- CSV mal formatado: abra em um editor de texto e verifique as aspas e separadores de pipe.

## Boas práticas

- Valide um pequeno subset do CSV antes de importar tudo (por exemplo, 2-3 linhas) para confirmar o mapeamento.
- Faça backups da database do Notion antes de rodar importações massivas.
- Mantenha um padrão para `epicoId` e `responsavelId` para facilitar relacionamentos.

## Próximos passos sugeridos

- Implementar validação prévia do CSV e relatório de erros antes de tentar criar páginas.
- Suporte para mapear `epicoId` e `responsavelId` como relacionamentos reais no Notion.
- Permitir mapeamento configurável entre nomes de colunas e propriedades do Notion.

---

Arquivo criado automaticamente: `docs/backlog.md`.
