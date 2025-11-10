const { app, Tray, Menu, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;
let winCadastro = null;

// Diretório local onde o Manager armazena dados:
// C:\Users\<Username>\AppData\Local\JT-App
const LOCAL_APP_DIR = path.join(process.env.LOCALAPPDATA, 'JT-App');
// Caminho completo para o arquivo de configuração/registro:
const INFO_PATH = path.join(LOCAL_APP_DIR, 'JT-Info.json');

// Função para criar (ou reutilizar) a janela de cadastro (Manager)
function getOrCreateWindow(reference, htmlFile) {
  // Se já existe e não foi destruída, apenas mostra/foca:
  if (reference && !reference.isDestroyed()) {
    if (reference.isMinimized()) reference.restore();
    reference.show();
    reference.focus();
    return reference;
  }

  // Caso contrário, cria nova janela "fit-content" e frameless:
  const win = new BrowserWindow({
    // Começamos com um tamanho pequeno; vamos redimensionar depois via conteúdo
    width: 100,
    height: 100,
    useContentSize: true,   // width/height serão relativos ao conteúdo HTML
    frame: false,           // sem bordas nativas ou barra de título
    resizable: false,       // sem redimensionamento manual
    alwaysOnTop: true,      // fica acima de outras janelas
    skipTaskbar: true,      // não aparece na barra de tarefas
    webPreferences: {
      nodeIntegration: true,      // para podermos usar 'require' no renderer
      contextIsolation: false,    // para facilitar comunicação (ipcRenderer)
    }
  });

  // Carrega o HTML de registro (cadastro.html)
  win.loadFile(path.join(__dirname, 'windows', htmlFile));

  // Quando o HTML terminar de carregar, mede conteúdo e redimensiona a janela:
  win.webContents.on('did-finish-load', async () => {
    try {
      // Injeta um script no renderer para obter scrollWidth/scrollHeight:
      const size = await win.webContents.executeJavaScript(`
        new Promise(resolve => {
          setTimeout(() => {
            const doc = document.documentElement;
            resolve({ w: doc.scrollWidth, h: doc.scrollHeight });
          }, 10);
        });
      `);

      // Ajusta a área de conteúdo exatamente ao tamanho necessário:
      win.setContentSize(size.w, size.h);
      win.center();     // opcional: centraliza a janela
      win.show();       // exibe a janela (ela estava oculta até aqui)
      win.focus();
    } catch (err) {
      console.error('Erro ao medir conteúdo do cadastro:', err);
      // Se falhar, usa valores de fallback (380×480)
      win.setContentSize(380, 480);
      win.center();
      win.show();
      win.focus();
    }
  });

  // Ao clicar no “X” (close), prevenimos a destruição e apenas escondemos a janela:
  win.on('close', (event) => {
    event.preventDefault();
    win.hide();
  });

  return win;
}

// Quando o Electron estiver pronto, cria o ícone de tray e o menu:
app.whenReady().then(() => {
  // 1) Cria o ícone na bandeja do sistema
  tray = new Tray(path.join(__dirname, 'icon.png'));

  // 2) Menu de contexto do Tray:
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Registro',
      click: () => {
        winCadastro = getOrCreateWindow(winCadastro, 'cadastro.html');
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
        // Ao sair, destrói a janela de cadastro se existir
        if (winCadastro && !winCadastro.isDestroyed()) {
          winCadastro.destroy();
        }
        app.quit();
      }
    }
  ]);

  tray.setToolTip('JTCheck Manager');
  tray.setContextMenu(contextMenu);
});

// Impede que o app feche completamente quando a janela for escondida
app.on('window-all-closed', (e) => {
  e.preventDefault();
});

// ================== HANDLERS IPC MAIN ==================
// 1) Verificar se já existe registro (JT-Info.json)
ipcMain.handle('check-registration', async () => {
  try {
    if (fs.existsSync(INFO_PATH)) {
      const raw = fs.readFileSync(INFO_PATH, 'utf-8');
      const dados = JSON.parse(raw);
      return { exists: true, data: dados };
    } else {
      return { exists: false };
    }
  } catch (err) {
    console.error('Erro ao checar registro:', err);
    return { exists: false };
  }
});

// 2) Registrar usuário (criar diretórios, arquivo JSON, atalho)
ipcMain.handle('register-user', async (event, { nome, matricula }) => {
  try {
    // 2.1) Garantir que o diretório local existe
    if (!fs.existsSync(LOCAL_APP_DIR)) {
      fs.mkdirSync(LOCAL_APP_DIR, { recursive: true });
    }

    // 2.2) Montar o objeto de informações a ser salvo
    const userInfo = {
      nomeCompleto: nome,
      matricula: matricula
    };

    // 2.3) Escrever no arquivo JT-Info.json
    fs.writeFileSync(INFO_PATH, JSON.stringify(userInfo, null, 2), 'utf-8');

    // 2.4) Criar atalho do CheckSender na pasta Startup do usuário do Windows
    // Pasta Startup: %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
    const startupDir = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
    const shortcutPath = path.join(startupDir, 'CheckSender.lnk');

    // O alvo do atalho será o próprio executável do Electron 
    // (no caso de distribute, seria o exe do CheckSender).
    // Aqui, por simplicidade, criamos um atalho para o próprio app (manager),
    // mas você pode trocar `process.execPath` por onde está o executável do CheckSender.
    const targetExe = process.execPath;

    // Monta propriedades do atalho
    const options = {
      target: targetExe,
      args: '--checksender', // Caso queira passar um argumento para o app diferenciar o modo CheckSender
      description: 'Inicia automaticamente o CheckSender para registrar presença',
      // icon: você pode apontar aqui para um .ico caso queira, ex:
      // icon: path.join(__dirname, 'icon.ico'),
    };

    // Cria ou atualiza o atalho
    shell.writeShortcutLink(shortcutPath, options);

    return { success: true };
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    return { success: false, error: err.message };
  }
});

// 3) Se o usuário escolher “Visualizar dados atuais”, podemos retornar o conteúdo
ipcMain.handle('read-registration', async () => {
  try {
    if (fs.existsSync(INFO_PATH)) {
      const raw = fs.readFileSync(INFO_PATH, 'utf-8');
      const dados = JSON.parse(raw);
      return { exists: true, data: dados };
    }
    return { exists: false };
  } catch (err) {
    console.error('Erro ao ler registro:', err);
    return { exists: false, error: err.message };
  }
});
