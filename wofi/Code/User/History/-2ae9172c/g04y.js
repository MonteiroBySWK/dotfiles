const { app, Tray, Menu, BrowserWindow } = require('electron');
const path = require('path');

let tray = null;
let winCadastro = null;
let winLogin = null;
let winUsuario = null;

function createWindow(file, ref) {
  if (ref && !ref.isDestroyed()) {
    ref.show();
    return ref;
  }
  const win = new BrowserWindow({
    width: 500,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile(path.join(__dirname, 'windows', file));
  return win;
}

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: '📋 Registro de Usuário', click: () => { winCadastro = createWindow('cadastro.html', winCadastro); } },
    { label: '🔐 Login', click: () => { winLogin = createWindow('login.html', winLogin); } },
    { label: '👤 Área do Usuário', click: () => { winUsuario = createWindow('dashboard.html', winUsuario); } },
    { type: 'separator' },
    { label: '❌ Sair', click: () => app.quit() }
  ]);

  tray.setToolTip('App no Tray');
  tray.setContextMenu(contextMenu);
});
