const { app, Tray, Menu } = require('electron');
const path = require('path');

let tray = null;

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Dizer oi', click: () => console.log('Olá!') },
    { label: 'Abrir janela', click: () => {
      // Aqui você pode abrir uma janela ou executar outra ação
      console.log('Janela aberta!');
    }},
    { type: 'separator' },
    { label: 'Configurações', click: () => console.log('Abrindo configurações...') },
    { type: 'separator' },
    { label: 'Sair', click: () => app.quit() }
  ]);

  tray.setToolTip('Meu App Tray');
  tray.setContextMenu(contextMenu);
});
