## Deployer sur heroku

### la première fois

* heroku git:remote -a komuso
* git push heroku master
* heroku ps:scale web=1
* heroku run python manage.py syncdb

### les fois suivantes

* git push heroku master
* heroku run python manage.py syncdb




## lancer le projet en local

* installer pip
* pip install -r requirements/dev.txt
* python manage.py ruserver

### si erreur 500 django_session : Créer la base
* python manage.py syncdb

### Activer le debug en variable d'environnement
* export DEBUG=1
* python manage.py ruserver


## virtualenv

* source komusoenv/bin/activate

## sass

* cd komuso/static
* sass --watch sass/main.scss:css/main.css



