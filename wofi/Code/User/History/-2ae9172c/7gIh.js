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
    // Mediremos o tamanho exato depois que o HTML carregar. Aqui, passamos um valor inicial pequeno.
    width: opts.width || 100,
    height: opts.height || 100,

    // Faz com que width/height revertam-se ao conteúdo HTML (não à janela inteira):
    useContentSize: true,

    // ---------- configurações para ficar "sem borda" e sempre flutuante ----------
    frame: false,            // sem barra de título nem bordas nativas
    maximizable: false,      // impede maximizar
    resizable: false,        // impede redimensionar manualmente
    alwaysOnTop: true,       // fica acima de outras janelas
    skipTaskbar: true,       // não aparece na barra de tarefas
    // -------------------------------------------------------------------------------

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile(path.join(__dirname, 'windows', htmlFile));

  // Quando o HTML terminar de carregar, medimos o scrollWidth/scrollHeight para ajustar o tamanho exato:
  win.webContents.on('did-finish-load', async () => {
    try {
      // Executa no contexto da página um pequeno script que retorna scrollWidth/scrollHeight:
      const size = await win.webContents.executeJavaScript(`
        new Promise(resolve => {
          // Pequeno timeout para garantir que CSS já foi aplicado
          setTimeout(() => {
            const doc = document.documentElement;
            // Valores exatos necessários para caber todo o conteúdo
            resolve({ w: doc.scrollWidth, h: doc.scrollHeight });
          }, 10);
        });
      `);

      // Ajusta a área de conteúdo para exatamente w×h:
      win.setContentSize(size.w, size.h);

      // (Opcional) Centraliza a janela após redimensionar:
      win.center();

      // Mostra a janela só agora (ela estava oculta)
      win.show();
      win.focus();
    } catch (err) {
      console.error('Erro ao medir conteúdo:', err);
      // Se falhar, aplica o tamanho de fallback (opts.width, opts.height), caso estejam definidos:
      const fallbackW = opts.width || 380;
      const fallbackH = opts.height || 480;
      win.setContentSize(fallbackW, fallbackH);
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
        winCadastro = getOrCreateWindow(
          winCadastro,
          'cadastro.html',
          { width: 380, height: 480 }
        );
      }
    },
    {
      label: 'Login',
      click: () => {
        winLogin = getOrCreateWindow(
          winLogin,
          'login.html',
          { width: 400, height: 520 }
        );
      }
    },
    {
      label: 'Dashboard',
      click: () => {
        winUsuario = getOrCreateWindow(
          winUsuario,
          'dashboard.html',
          { width: 1280, height: 720 }
        );
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
