const { app, Tray, Menu, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;
let winCadastro = null;
let winLogin = null;
let winUsuario = null;

// Diretório e arquivo de configuração (caso precise, conforme seu projeto)
const LOCAL_APP_DIR = path.join(process.env.LOCALAPPDATA || '', 'JT-App');
const INFO_PATH = path.join(LOCAL_APP_DIR, 'JT-Info.json');

function getOrCreateWindow(reference, htmlFile) {
  if (typeof htmlFile !== 'string') {
    console.error('Erro: htmlFile está indefinido ou não é string:', htmlFile);
    return;
  }

  if (reference && !reference.isDestroyed()) {
    if (reference.isMinimized()) reference.restore();
    reference.show();
    reference.focus();
    return reference;
  }

  const win = new BrowserWindow({
    useContentSize: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Monta o caminho completo para o HTML
  const fullPath = path.join(__dirname, 'windows', htmlFile);
  if (!fs.existsSync(fullPath)) {
    console.error(`Erro: não encontrou o arquivo HTML em "${fullPath}"`);
    win.destroy();
    return;
  }

  win.loadFile(fullPath);

  win.webContents.on('did-finish-load', async () => {
    try {
      const size = await win.webContents.executeJavaScript(`
        new Promise(resolve => {
          setTimeout(() => {
            const doc = document.documentElement;
            resolve({ w: doc.scrollWidth, h: doc.scrollHeight });
          }, 10);
        });
      `);
      win.setContentSize(size.w, size.h);
      win.center();
      win.show();
      win.focus();
    } catch (err) {
      console.error('Erro ao medir conteúdo do HTML:', err);
      // fallback genérico
      win.setContentSize(380, 480);
      win.center();
      win.show();
      win.focus();
    }
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
        winCadastro = getOrCreateWindow(winCadastro, 'cadastro.html');
      }
    },
    {
      label: 'Login',
      click: () => {
        winLogin = getOrCreateWindow(winLogin, 'login.html');
      }
    },
    {
      label: 'Dashboard',
      click: () => {
        winUsuario = getOrCreateWindow(winUsuario, 'dashboard.html');
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
        if (winCadastro && !winCadastro.isDestroyed()) winCadastro.destroy();
        if (winLogin && !winLogin.isDestroyed()) winLogin.destroy();
        if (winUsuario && !winUsuario.isDestroyed()) winUsuario.destroy();
        app.quit();
      }
    }
  ]);

  tray.setToolTip('JTCheck App');
  tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});
