import os
from supabase import create_client, Client
from datetime import datetime
import socket
import logging

class AttendanceSender:
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