import os
import json
import time
import logging
import socket
from datetime import datetime
import threading
import requests

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("checksender.log"),
        logging.StreamHandler()
    ]
)

class CheckSender:
    """Handles automatic presence detection and sending."""

    def __init__(self):
        self.base_dir = os.path.join(
            os.environ.get('LOCALAPPDATA', f"C:\\Users\\{os.getlogin()}\\AppData\\Local"),
            "JT-App"
        )
        self.info_file = os.path.join(self.base_dir, "JT-Info.json")
        self.queue_file = os.path.join(self.base_dir, "pending_attendance.json")
        self.api_url = os.getenv("API_URL", "https://sua-api-central.com/attendance")  # Defina no .env
        self.retry_interval = 300  # segundos (5 minutos)

    def read_user_info(self):
        """Reads user info from JT-Info.json."""
        if not os.path.exists(self.info_file):
            logging.error("User info file not found: %s", self.info_file)
            return None
        with open(self.info_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def build_payload(self, user_info):
        """Builds the attendance payload."""
        now = datetime.now()
        return {
            "registration": user_info["registration"],
            "name": user_info["name"],
            "hostname": socket.gethostname(),
            "datetime": now.strftime("%Y-%m-%d %H:%M:%S")
        }

    def send_payload(self, payload):
        """Sends the payload to the central API."""
        try:
            response = requests.post(self.api_url, json=payload, timeout=10)
            if response.status_code == 200:
                logging.info("Attendance sent successfully: %s", payload)
                return True
            else:
                logging.error("API error %s: %s", response.status_code, response.text)
                return False
        except requests.RequestException as e:
            logging.warning("Network error, will queue attendance: %s", e)
            return False

    def queue_payload(self, payload):
        """Stores the payload locally for later retry."""
        queue = []
        if os.path.exists(self.queue_file):
            with open(self.queue_file, 'r', encoding='utf-8') as f:
                try:
                    queue = json.load(f)
                except json.JSONDecodeError:
                    queue = []
        queue.append(payload)
        with open(self.queue_file, 'w', encoding='utf-8') as f:
            json.dump(queue, f, indent=4, ensure_ascii=False)
        logging.info("Attendance queued for later sending.")

    def retry_queued_payloads(self):
        """Tries to resend queued attendances."""
        if not os.path.exists(self.queue_file):
            return
        with open(self.queue_file, 'r', encoding='utf-8') as f:
            try:
                queue = json.load(f)
            except json.JSONDecodeError:
                queue = []
        if not queue:
            return
        new_queue = []
        for payload in queue:
            if not self.send_payload(payload):
                new_queue.append(payload)
        # Save only unsent payloads
        with open(self.queue_file, 'w', encoding='utf-8') as f:
            json.dump(new_queue, f, indent=4, ensure_ascii=False)
        if new_queue:
            logging.info("Some attendances remain queued.")
        else:
            logging.info("All queued attendances sent successfully.")

    def run(self):
        """Main logic: send attendance and retry queue in background."""
        user_info = self.read_user_info()
        if not user_info:
            print("User info not found. Please run the Manager first.")
            return
        payload = self.build_payload(user_info)
        if not self.send_payload(payload):
            self.queue_payload(payload)
        # Start background thread for retrying queued attendances
        def retry_loop():
            while True:
                time.sleep(self.retry_interval)
                self.retry_queued_payloads()
        threading.Thread(target=retry_loop, daemon=True).start()
        # Mantém o processo rodando em segundo plano
        while True:
            time.sleep(3600)

if __name__ == "__main__":
    sender = CheckSender()
    sender.run()