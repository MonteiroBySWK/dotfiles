import eel

eel.init('web')

@eel.expose
def get_message_from_python(name):
    print(f"Mensagem recebida do JavaScript: {name}")
    if name:
        return f"Olá, {name}! Mensagem do Python recebida!"
    else:
        return "Olá! Nenhuma mensagem recebida do JavaScript. Você esqueceu seu nome?"

eel.start('index.html', size=(700, 500))