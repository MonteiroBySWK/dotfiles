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
    show: false, 
    alwaysOnTop: true,         
    skipTaskbar: true,     
    maximizable: false,         
    resizable: false,
    frame: true,                
    title: "JTCheck Login",
    type: "toolbar",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile(path.join(__dirname, 'windows', htmlFile));

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
      label: '📋 Registro de Usuário',
      click: () => {
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
