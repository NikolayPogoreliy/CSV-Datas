1. install all required packages for Python/Django project:
    pip install -r requirements.txt

2. Make directory named 'data' for csv-files:
    mkdir "data"

3. Place all csv-files to 'data'-directory

4. Change working directory on './datas'
    cd datas

5. Make DB-migration for Django-project:
    ./manage.py migrate

6. Run application server (127.0.0.1:8000 by default):
    ./manage.py runserver

7. Change working directory:
    cd ..

8. Run data-collecting script:
    python CSV_parse.py

9 In your browser`s address bar type "127.0.0.1:8000" to see datas histogram