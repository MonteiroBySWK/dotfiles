import os
import json
import getpass
import logging
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
import socket

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("manager.log"),
        logging.StreamHandler()
    ]
)

# Carrega variáveis de ambiente
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class Manager:
    """Handles user registration and environment setup for JT-Check."""

    def __init__(self):
        self.user_name = getpass.getuser()
        self.base_dir = os.path.join(
            os.environ.get('LOCALAPPDATA', f"C:\\Users\\{self.user_name}\\AppData\\Local"),
            "JT-App"
        )
        self.info_file = os.path.join(self.base_dir, "JT-Info.json")
        self.startup_dir = os.path.join(
            os.environ.get('APPDATA', f"C:\\Users\\{self.user_name}\\AppData\\Roaming"),
            "Microsoft", "Windows", "Start Menu", "Programs", "Startup"
        )
        self.check_sender_path = os.path.abspath("./CheckSender.py") 
        self.supabase = self._get_supabase_client()

    def _get_supabase_client(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise EnvironmentError("SUPABASE_URL e SUPABASE_KEY devem estar definidos nas variáveis de ambiente.")
        return create_client(url, key)

    def validate_registration(self, registration):
        """Validates registration format JT00XXXXX."""
        return registration.startswith('JT00') and registration[4:].isdigit() and len(registration[4:]) == 5

    def create_directories(self):
        """Creates required directories for storing user info."""
        os.makedirs(self.base_dir, exist_ok=True)
        logging.info("Directory created or already exists: %s", self.base_dir)

    def save_user_info(self, name, registration):
        """Saves user info to JT-Info.json."""
        data = {"name": name, "registration": registration}
        with open(self.info_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        logging.info("User info saved: %s", data)

    def load_user_info(self):
        """Loads user info if already registered."""
        if os.path.exists(self.info_file):
            with open(self.info_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            logging.info("User info loaded: %s", data)
            return data
        return None

    def create_startup_shortcut(self):
        """Creates a shortcut for CheckSender in the user's Startup folder (Windows only)."""
        shortcut_path = os.path.join(self.startup_dir, "JT-Check-Sender.lnk")
        # Criação de atalho requer pywin32
        try:
            import win32com.client
            shell = win32com.client.Dispatch("WScript.Shell")
            shortcut = shell.CreateShortCut(shortcut_path)
            shortcut.Targetpath = self.check_sender_path
            shortcut.WorkingDirectory = os.path.dirname(self.check_sender_path)
            shortcut.save()
            logging.info("Startup shortcut created at: %s", shortcut_path)
        except ImportError:
            logging.warning("pywin32 not installed. Shortcut not created.")
        except Exception as e:
            logging.error("Failed to create startup shortcut: %s", e)

    def build_attendance_data(self, jt, name, status="2"):
        now = datetime.now()
        return {
            "JT": jt,
            "name": name,
            "pc": socket.gethostname(),
            "date": now.strftime("%Y/%m/%d"),
            "hour": now.strftime("%H:%M:%S"),
            "status": status
        }

    def send(self, jt, name, status="2"):
        data = self.build_attendance_data(jt, name, status)
        try:
            response = self.supabase.table("attendance").insert(data).execute()
            logging.info("Dados enviados com sucesso: %s", response)
            return response
        except Exception as e:
            logging.error("Erro ao enviar dados: %s", e)
            return None

    def run(self):
        """Main logic for user registration and setup."""

        ## Essa é a parte que precisa de GUI
        self.create_directories()
        user_info = self.load_user_info()
        if user_info:
            print("User already registered:")
            print(json.dumps(user_info, indent=4, ensure_ascii=False))
            choice = input("Do you want to reconfigure? (y/N): ").strip().lower()
            if choice != 'y':
                return
        # RF001 - Registro de Usuário
        name = input("Enter your full name: ").strip()
        while True:
            registration = input("Enter your registration (JT00XXXXX): ").strip()
            if self.validate_registration(registration):
                break
            print("Invalid registration format. Please use JT00XXXXX.")
        # RF003 - Armazenamento de Informações
        self.save_user_info(name, registration)
        # RF005 - Geração de Atalho de Inicialização
        self.create_startup_shortcut()
        print("Registration complete and environment configured.")

if __name__ == "__main__":
    manager = Manager()
    manager.run()