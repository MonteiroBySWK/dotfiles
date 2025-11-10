# Administrative Prototype for Technos

Este é um protótipo administrativo desenvolvido em Django, com customização do painel administrativo utilizando o tema Jazzmin.

## Estrutura do Projeto

- **admin/**: Configurações principais do projeto Django.
- **clientes/**: Aplicação para gerenciamento de clientes.
- **financas/**: Aplicação para controle financeiro.
- **servicos/**: Aplicação para gerenciamento de serviços.
- **static/** e **staticfiles/**: Arquivos estáticos.
- **templates/**: Templates HTML do projeto.

## Requisitos

- Python (versão definida em `.python-version`)
- Django (verifique a versão em `requirements.txt`)
- Jazzmin (tema para o admin do Django)

## Instalação

1. Clone o repositório:
    ```sh
    git clone <url-do-repositorio>
    cd administrative-prototype-for-technos
    ```

2. Crie e ative um ambiente virtual:
    ```sh
    python -m venv .venv
    source .venv/bin/activate
    ```

3. Instale as dependências:
    ```sh
    pip install -r requirements.txt
    ```

4. Execute as migrações:
    ```sh
    python manage.py migrate
    ```

5. Crie um superusuário:
    ```sh
    python manage.py createsuperuser
    ```

6. Inicie o servidor:
    ```sh
    python manage.py runserver
    ```

Desenvolvido para fins de prototipagem interna.
