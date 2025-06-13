FROM python:3.10

WORKDIR /app
COPY . /app/
RUN pip install --upgrade pip && pip install -r requirements.txt
RUN mkdir -p /var/log/django && \
    touch /var/log/django/helpdesk.log && \
    chmod -R 777 /var/log/django

EXPOSE 8000

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]