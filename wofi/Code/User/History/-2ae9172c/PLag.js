// arquivo: main.js
const { app, Tray, Menu, BrowserWindow } = require('electron');
const path = require('path');

// Referências fixas às janelas:
let tray = null;
let winCadastro = null;
let winLogin = null;
let winUsuario = null;

// Função genérica para criar/mostrar janelas e impedir destruição ao fechar
function getOrCreateWindow(reference, htmlFile, opts = {}) {
  // Se já existe e não foi destruída, apenas mostra e foca
  if (reference && !reference.isDestroyed()) {
    if (reference.isMinimized()) reference.restore();
    reference.show();
    reference.focus();
    return reference;
  }

  // Caso contrário, cria nova instância
  const win = new BrowserWindow({
    width: opts.width || 500,
    height: opts.height || 400,
    show: false, // só mostramos depois de "ready-to-show"
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Carrega o HTML local (cadastro.html, login.html ou usuario.html)
  win.loadFile(path.join(__dirname, 'windows', htmlFile));

  // Quando estiver pronto, mostra a janela
  win.once('ready-to-show', () => {
    win.show();
  });

  // Em vez de destruir a janela ao fechar, apenas a escondemos
  win.on('close', (event) => {
    // Se o usuário clicar no “X”, não destruímos: apenas escondemos
    event.preventDefault();
    win.hide();
  });

  return win;
}

app.whenReady().then(() => {
  // Cria o ícone do Tray
  tray = new Tray(path.join(__dirname, 'icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '📋 Registro de Usuário',
      click: () => {
        // Chama nossa função: se já existir, só mostra; senão, cria
        winCadastro = getOrCreateWindow(winCadastro, 'cadastro.html', { width: 380, height: 480 });
      }
    },
    {
      label: '🔐 Login',
      click: () => {
        winLogin = getOrCreateWindow(winLogin, 'login.html', { width: 400, height: 520 });
      }
    },
    {
      label: '👤 Área do Usuário',
      click: () => {
        winUsuario = getOrCreateWindow(winUsuario, 'usuario.html', { width: 500, height: 600 });
      }
    },
    { type: 'separator' },
    {
      label: '❌ Sair',
      click: () => {
        // Antes de sair completamente, desconecta todos os listeners e destrói janelas
        if (winCadastro && !winCadastro.isDestroyed()) {
          winCadastro.destroy();
        }
        if (winLogin && !winLogin.isDestroyed()) {
          winLogin.destroy();
        }
        if (winUsuario && !winUsuario.isDestroyed()) {
          winUsuario.destroy();
        }
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Meu App no Tray');
  tray.setContextMenu(contextMenu);

  // Se quiser, cria a primeira janela invisível aqui mesmo ou espera clique no menu
});

// ======== Para que o app não feche completamente quando todas as janelas forem fechadas ========
app.on('window-all-closed', (e) => {
  // Previne que o app seja encerrado ao fechar janelas, pra continuar ativo no Tray.
  e.preventDefault();
});
