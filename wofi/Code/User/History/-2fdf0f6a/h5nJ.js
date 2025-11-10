const { app, Tray, Menu } = require('electron');
const path = require('path');

let tray = null;

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Dizer oi', click: () => console.log('Olá!') },
    { label: 'Sair', click: () => app.quit() }
  ]);

  tray.setToolTip('Meu App Tray');
  tray.setContextMenu(contextMenu);
});
