import os
import json
import logging

class Validator:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), 'students_data.json')

    def load_data(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    logging.info("Data loaded: %s", data)
            except json.JSONDecodeError:
                data = {}
                logging.warning("Empty or invalid JSON, creating new.")
        else:
            data = {}
            logging.info("File not found, creating new.")
        return data

    def validate_registration(self, registration):
        return registration.startswith('JT00') and registration[4:].isdigit() and len(registration[4:]) == 5

    def save_data(self, data):
        with open(self.data_file, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4, ensure_ascii=False)
            logging.info("Data saved: %s", data)

    def add_student(self, name, registration):
        if not self.validate_registration(registration):
            raise ValueError("Use the format (JT00XXXXX)*")
        data = self.load_data()
        data[registration] = {"name": name, "registration": registration}
        self.save_data(data)
        logging.info("Student %s (%s) added.", name, registration)

    def list_students(self):
        data = self.load_data()
        for reg, info in data.items():
            print(f"Registration: {reg}, Name: {info['name']}")
        return data
