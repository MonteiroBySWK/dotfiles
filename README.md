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

—

## Notas rápidas
- Arquivos de configuração portáveis estão no repositório; não incluí dados privados ou tokens.
- Se quiser reproduzir o setup, bastam as configurações: tema, módulos e atalhos (os binários e dados pessoais não estão aqui).