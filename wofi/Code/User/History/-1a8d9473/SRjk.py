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