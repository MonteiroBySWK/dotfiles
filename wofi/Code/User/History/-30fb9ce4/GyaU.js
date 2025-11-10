const { app, Tray, Menu, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let tray        = null;
let winCadastro = null;
let winLogin    = null;
let winUsuario  = null;

// Diretório onde gravamos JT-Info.json
const LOCAL_APP_DIR = path.join(process.env.LOCALAPPDATA || '', 'JT-App');
const INFO_PATH      = path.join(LOCAL_APP_DIR, 'JT-Info.json');

/* ─── IPC HANDLERS ────────────────────────────────────────────────────── */

// 1) Verificar se existe JT-Info.json
ipcMain.handle('check-registration', async () => {
  try {
    if (fs.existsSync(INFO_PATH)) {
      const raw  = fs.readFileSync(INFO_PATH, 'utf-8');
      const data = JSON.parse(raw);
      return { exists: true, data };
    } else {
      return { exists: false };
    }
  } catch (err) {
    console.error('Erro em check-registration:', err);
    return { exists: false };
  }
});

// 2) Registrar usuário: cria diretório, grava JSON e cria atalho
ipcMain.handle('register-user', async (event, { nome, matricula }) => {
  try {
    if (!fs.existsSync(LOCAL_APP_DIR)) {
      fs.mkdirSync(LOCAL_APP_DIR, { recursive: true });
    }
    const userInfo = { nomeCompleto: nome, matricula };
    fs.writeFileSync(INFO_PATH, JSON.stringify(userInfo, null, 2), 'utf-8');

    // Criar atalho em Startup
    const startupDir   = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
    const shortcutPath = path.join(startupDir, 'CheckSender.lnk');
    const targetExe    = process.execPath;
    const options      = {
      target:      targetExe,
      args:        '--checksender',
      description: 'Inicia automaticamente o CheckSender para registrar presença'
      // icon: path.join(__dirname, 'icon.ico')
    };
    shell.writeShortcutLink(shortcutPath, options);
    return { success: true };
  } catch (err) {
    console.error('Erro em register-user:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('read-registration', async () => {
  try {
    if (fs.existsSync(INFO_PATH)) {
      const raw  = fs.readFileSync(INFO_PATH, 'utf-8');
      const data = JSON.parse(raw);
      return { exists: true, data };
    }
    return { exists: false };
  } catch (err) {
    console.error('Erro em read-registration:', err);
    return { exists: false, error: err.message };
  }
});


function getOrCreateWindow(reference, htmlFile) {
  // if (typeof htmlFile !== 'string') {
  //   console.error('Erro: htmlFile indefinido ou não é string:', htmlFile);
  //   return;
  // }

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
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

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
      console.error('Erro ao medir conteúdo:', err);
      // Fallback genérico - use valores aproximados
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

/* ─── INICIALIZAÇÃO DO APP ───────────────────────────────────────────── */

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
        if (winLogin   && !winLogin.isDestroyed())   winLogin.destroy();
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
