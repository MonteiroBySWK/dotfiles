[![dotfiles](https://img.shields.io/badge/dotfiles-%7E%2F.config-brightgreen)]() [![arch](https://img.shields.io/badge/arch-linux-blue)]() [![hyprland](https://img.shields.io/badge/hyprland-compositor-purple)]() [![neovim](https://img.shields.io/badge/neovim-editor-green)]()

# Meu Setup — ~/.config

Este repositório mostra o visual e as configurações do meu ambiente (sem expor segredos). É pensado como um portfólio do meu desktop: compositor, barras, menus e tema do editor.

—

## Componentes mostrados
- Hyprland (compositor)
- Waybar (status bar)
- Wofi (launcher)
- nvim (config visual e tema)
- Kitty (terminal)
- Fastfetch (informações do sistema)

—

## Galeria

![Preview 1](assets/image01.jpeg)

![Preview 2](assets/image02.jpeg)

![Preview 3](assets/image03.jpeg)

![Preview 4](assets/image04.jpeg)

—

## OpenCode (`opencode/`)

Este repositório também inclui minha configuração do [OpenCode](https://opencode.ai) (agente AI para terminal).

### Variáveis de ambiente necessárias

Para o OpenCode funcionar corretamente, exporte estas variáveis no seu `~/.zshrc` (ou equivalente):

```bash
# Context7 MCP — documentação de bibliotecas (obrigatório)
export CONTEXT7_API_KEY="sua-chave-aqui"

# Memory Plugin — auto-capture de memória (opcional)
# export MEMORY_API_KEY="sua-chave-aqui"
```

O config usa a sintaxe `{env:NOME}` do OpenCode para ler do ambiente — **nenhuma chave está hardcoded nos arquivos**.

> Template em `opencode/opencode-env-template.txt`

### Como funciona
- `opencode.json` → lê `{env:CONTEXT7_API_KEY}` para o MCP Context7
- `opencode-mem.jsonc` → lê `env://MEMORY_API_KEY` para auto-capture
- `.gitignore` global bloqueia `.env`, `.env.*` e `*.bak` — sem risco de vazar secrets

### Plugins

| Plugin | Função |
|---|---|
| `oh-my-opencode-slim` | Orquestração de agentes especializados (orchestrator, oracle, fixer, designer, etc.) |
| `superpowers` | Skills avançados (brainstorming, TDD, debugging, code review, etc.) |
| `openslimedit` | Edição otimizada via subagentes |
| `opencode-damage-control` | Proteção de paths sensíveis (`.env`, `~/.zshrc`, etc.) |
| `rtk` (plugins/rtk.ts) | Compressão automática de output de comandos bash (Rust Token Killer) |

### MCPs (Model Context Protocol)

| MCP | Tipo | Status | Descrição |
|---|---|---|---|
| `context7` | remote | ✅ ativo | Documentação de bibliotecas via Context7 API |
| `memory` | local | ✅ ativo | Persistência de memória (vetores) |
| `playwright` | local | ⏸️ desativado | Automação de browser (Firefox) |
| `token-optimizer` | local | ⏸️ desativado | Otimização de tokens |

### Agentes (oh-my-opencode-slim)

| Agente | Modelo | Skills | MCPs |
|---|---|---|---|
| **orchestrator** | `deepseek-v4-flash` | `*` (todos) | `*` exceto context7 |
| **oracle** | `deepseek-v4-flash` | `simplify` | — |
| **fixer** | `deepseek-v4-flash` | — | — |
| **designer** | `deepseek-v4-flash` | — | — |
| **explorer** | `deepseek-v4-flash` | — | — |
| **librarian** | `deepseek-v4-flash` | — | websearch, context7, gh_grep |
| **observer** | `deepseek-v4-flash` | — | — |

### Agentes customizados

| Agente | Modo | Descrição |
|---|---|---|
| `fixer` | subagent | Execução de tarefas bem definidas (bash/read/write/edit permitidos) |
| `designer` | subagent | UI/UX design e implementação visual (permissões totais) |
| `reviewer` | subagent | Revisão de código: catching de alucinações, erros de tipo e lógica |
| `explore` (agent) | subagent | — 🔴 desabilitado |
| `general` | — | — 🔴 desabilitado |

### Skills disponíveis

| Skill | Descrição |
|---|---|
| `brainstorming` | Exploração de requisitos e design antes de implementar |
| `clonedeps` | Clonagem de dependências para inspeção de código-fonte |
| `codemap` | Mapeamento hierárquico de repositórios desconhecidos |
| `deepwork` | Workflow de alta complexidade com múltiplas fases e revisões |
| `dispatching-parallel-agents` | Execução paralela de tarefas independentes |
| `executing-plans` | Execução de planos de implementação |
| `finishing-a-development-branch` | Finalização de branches (merge/PR/cleanup) |
| `receiving-code-review` | Processamento de feedback de code review |
| `requesting-code-review` | Solicitação de code review |
| `simplify` | Simplificação de código sem mudar comportamento |
| `subagent-driven-development` | Desenvolvimento orientado a subagentes |
| `systematic-debugging` | Debug estruturado de bugs e falhas |
| `test-driven-development` | TDD — testes antes da implementação |
| `using-git-worktrees` | Isolamento via git worktrees |
| `verification-before-completion` | Verificação antes de declarar conclusão |
| `verification-planning` | Planejamento de verificação para mudanças complexas |
| `writing-domain-docs` | Documentação de domínios de negócio |
| `writing-plans` | Criação de planos de implementação |
| `writing-skills` | Criação e edição de skills |

—

## Notas rápidas
- Arquivos de configuração portáveis estão no repositório; não incluí dados privados ou tokens.
- Se quiser reproduzir o setup, bastam as configurações: tema, módulos e atalhos (os binários e dados pessoais não estão aqui).