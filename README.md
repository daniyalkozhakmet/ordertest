# ORDER TEST

Необходимо реализовать систему для приема заказов на разработку сайтов. Отправить ссылку на гитхаб с инструкцией по запуску проекта.

## Installation dependencies for BACKEND

In a root folder run:

```bash
pip install -r requirements.txt
```

After installation navigate to folder ({rootFoler}/backend) cd bacend ,then to turn on server

```bash
python manage.py runserver
```

You can create admin user running following command or log in
{
email:admin@mail.ru;
password:admin
}:

```bash
python manage.py createsuperuser
```

Server should start at http://127.0.0.1:8000/

## Installation dependencies for FRONTEND

Navigate to folder : ({rootFoler}/frontend) cd frontend ,then run following comand to install dependencies:

```bash
npm install
```

To start frontend, run:

```bash
npm start
```
