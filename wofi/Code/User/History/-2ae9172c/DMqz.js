const { app, Tray, Menu, BrowserWindow } = require('electron');
const path = require('path');

let tray = null;
let winCadastro = null;
let winLogin = null;
let winUsuario = null;

function getOrCreateWindow(reference, htmlFile, opts = {}) {
  if (reference && !reference.isDestroyed()) {
    if (reference.isMinimized()) reference.restore();
    reference.show();
    reference.focus();
    return reference;
  }

  const win = new BrowserWindow({
    width: opts.width || 500,
    height: opts.height || 400,
    useContentSize: true,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    maximizable: false,
    resizable: false,
    frame: false,
    title: "JTCheck Login",
    type: "toolbar",
    skipTaskbar: true,
    alwaysOnTop: true,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile(path.join(__dirname, 'windows', htmlFile));

  winLogin.webContents.on('did-finish-load', async () => {
    try {
      // Executa no renderer um script que retorna um objeto {w, h} com scrollWidth/scrollHeight
      const size = await winLogin.webContents.executeJavaScript(`
        new Promise(resolve => {
          // Espera um pouquinho para garantir estilos carregados
          setTimeout(() => {
            const doc = document.documentElement;
            // scrollWidth e scrollHeight incluem margens internas necessárias para todo o conteúdo
            const w = doc.scrollWidth;
            const h = doc.scrollHeight;
            resolve({ w, h });
          }, 10);
        });
      `);

      // Ajusta o tamanho da janela para caber o conteúdo exato
      winLogin.setContentSize(size.w, size.h);
      winLogin.center();     // opcional: centraliza na tela após redimensionar
      winLogin.show();       // mostra a janela (ela estava oculta até aqui)
      winLogin.focus();
    } catch (err) {
      console.error("Erro ao medir conteúdo:", err);
      // Se algo falhar, mostra a janela num tamanho fixo fallback
      winLogin.setContentSize(380, 480);
      winLogin.center();
      winLogin.show();
      winLogin.focus();
    }
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('close', (event) => {
    event.preventDefault();
    win.hide();
  });

  return win;
}

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Registro',
      click: () => {
        winCadastro = getOrCreateWindow(winCadastro, 'cadastro.html', { width: 380, height: 480 });
      }
    },
    {
      label: 'Login',
      click: () => {
        winLogin = getOrCreateWindow(winLogin, 'login.html', { width: 400, height: 520 });
      }
    },
    {
      label: 'Dashboard',
      click: () => {
        winUsuario = getOrCreateWindow(winUsuario, 'dashboard.html', { width: 1280, height: 720 });
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
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

});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});
