const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let tray, winLogin;

function createLoginWindow() {
  // Se já existir e não estiver destruída, só mostra e foca
  if (winLogin && !winLogin.isDestroyed()) {
    winLogin.show();
    winLogin.focus();
    return;
  }

  winLogin = new BrowserWindow({
    width: 400,
    height: 500,
    // ------------------------------------------------------
    // Flags que pedem ao compositor para flutuar essa janela
    // ------------------------------------------------------
    alwaysOnTop: true,          // Mantém acima de outras janelas
    skipTaskbar: true,          // Não aparece na barra de tarefas
    maximizable: false,         // impede maximização “comum”
    resizable: false,           // opcional, se não quiser redimensionar
    frame: true,                // se quiser manter borda padrão
    title: "JTCheck Login",

    // AQUI está o tipo que realmente diz “isso é uma janela especial”:
    // - "toolbar" / "splash" / "popup-menu" / "dropdown-menu" / "notification" etc.
    // No Wayland (e X11) isso vira _NET_WM_WINDOW_TYPE hint.
    type: "toolbar",

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  winLogin.loadFile(path.join(__dirname, 'windows', 'login.html'));

  // Quando o usuário clicar no “X”, apenas escondemos:
  winLogin.on('close', e => {
    e.preventDefault();
    winLogin.hide();
  });

  // Só exibimos depois que o conteúdo estiver carregado
  winLogin.once('ready-to-show', () => {
    winLogin.show();
  });
}

app.whenReady().then(() => {
  // Cria ícone do Tray
  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "🔐 Login",
      click: createLoginWindow
    },
    { type: "separator" },
    {
      label: "❌ Sair",
      click: () => {
        if (winLogin && !winLogin.isDestroyed()) winLogin.destroy();
        app.quit();
      }
    }
  ]);
  tray.setToolTip("JTCheck System");
  tray.setContextMenu(contextMenu);
});
