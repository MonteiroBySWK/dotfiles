import os
from supabase import create_client, Client
from datetime import datetime
import socket
import logging
from dotenv import load_dotenv


load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("attendance.log"),  # Nome do arquivo de log
        logging.StreamHandler()                 # Também mostra no console
    ]
)

class Manager:
    def __init__(self):
        self.supabase = self._get_supabase_client()

    def _get_supabase_client(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise EnvironmentError("SUPABASE_URL e SUPABASE_KEY devem estar definidos nas variáveis de ambiente.")
        return create_client(url, key)

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
        
if __name__ == "__main__":
    sender = AttendanceSender()

    # Exemplo de uso    
    jt = "JT00176675"
    name = "Manuzinha Calculistah"
    status = "2"  # Status pode ser "1" para presente, "2" para ausente, etc.
    
    response = sender.send(jt, name, status)
    if response:
        logging.info("Resposta do Supabase: %s", response)
    else:
        logging.error("Falha ao enviar os dados.")