# dotfiles

Configurações pessoais para um setup inicial do Arch Linux com Hyprland, incluindo instalador automatizado.

## 🚀 Instalação Rápida

```bash
git clone https://github.com/MonteiroBySWK/dotfiles.git ~/.config/dotfiles
cd ~/.config/dotfiles
chmod +x install.sh
./install.sh
```

## 📦 Instalação Personalizada

### Opções do instalador

```bash
# Instalação completa (recomendada)
./install.sh

# Instalação não-interativa
./install.sh -y

# Pular configuração do Oh My Zsh
./install.sh --no-oh-my-zsh

# Instalar apenas o grupo inicial de pacotes
./install.sh --group initial

# Combinar opções
./install.sh -y --group initial --no-oh-my-zsh
```

## 🛠️ O que está incluído

### **Ambiente Desktop**
- **Hyprland** - Compositor Wayland
- **Waybar** - Barra de status
- **Mako** - Notificações
- **Wofi** - Launcher de aplicações
- **Swaylock Effects** - Bloqueio de tela

### **Terminal e Shell**
- **Kitty** - Terminal emulator
- **Zsh + Oh My Zsh** - Shell avançado com plugins
- **Fish** - Shell alternativo (configurado)

### **Áudio e Multimídia**
- **PipeWire + WirePlumber** - Sistema de áudio
- **Pavucontrol + Pamixer** - Controle de volume
- **Cava** - Visualizador de áudio
- **OBS Studio** - Gravação e streaming

### **Utilitários**
- **Thunar** - Gerenciador de arquivos
- **Network Manager** - Rede
- **Bluez + Blueman** - Bluetooth
- **Grim + Slurp + Swappy** - Screenshots
- **Git, Ripgrep, Rsync** - Ferramentas de desenvolvimento

## 📁 Estrutura

```
dotfiles/
├── install.sh              # Instalador automatizado
├── packages.yaml           # Lista declarativa de pacotes
├── hypr/                   # Configurações Hyprland
├── waybar/                 # Configurações Waybar
├── kitty/                  # Configurações Kitty
├── mako/                   # Configurações Mako
├── wofi/                   # Configurações Wofi
├── nvim/                   # Configurações Neovim
├── cava/                   # Configurações Cava
├── obs-studio/             # Configurações OBS Studio
├── swaylock/               # Configurações Swaylock
├── fish/                   # Configurações Fish shell
└── ...                     # Outras configurações
```

## 🔧 Personalização

### Modificar pacotes
Edite `packages.yaml` para adicionar/remover pacotes:

```yaml
packages:
  - seu-pacote-aqui

aur_packages:
  - pacote-do-aur

groups:
  initial:
    - pacotes-essenciais
```

### Configurações manuais
Todas as configurações são sincronizadas automaticamente para `~/.config/` durante a instalação.

## 📝 Notas

- **Pré-requisitos**: Arch Linux com `pacman` instalado
- **AUR Helper**: O instalador configura automaticamente o `paru`
- **Backup**: Arquivos existentes são preservados com backup
- **Modular**: Use `--group initial` para instalação mínima

## 🤝 Contribuindo

Sinta-se à vontade para sugerir melhorias ou reportar problemas através das issues do GitHub.

