"""
Django settings for komuso project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.realpath(os.path.dirname(__file__) + '/..')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '4+_55w=d2&&v$^fs7gns7(d9q#9f_wtsz-7rf!juyi1vc!v7d8'

# SECURITY WARNING: don't run with debug turned on in production!
#DEBUG = bool(os.environ.get('DEBUG', False))
DEBUG = False

TEMPLATE_DEBUG = DEBUG

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']

ADMINS = (
    ('Laetitia Nanni', 'laetitia.nanni@gmail.com'),
    ('Julie Po', 'pojulie07@gmail.com'),
    ('Thibault Fievet', 'thibault.fievet@gmail.com'),
)

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'komuso',
    'score-editor',
    'pipeline',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.core.context_processors.i18n",
)

ROOT_URLCONF = 'komuso.urls'

WSGI_APPLICATION = 'komuso.wsgi.application'


# Database (https://docs.djangoproject.com/en/1.6/ref/settings/#databases)

# Parse database configuration from DATABASE_URL environment variable
import dj_database_url
DATABASES = {
    'default': dj_database_url.config()
}
# Defaults to sqlite database
if not 'ENGINE' in DATABASES['default']:
    DATABASES['default'] = dj_database_url.parse('sqlite:///{}/komuso.db'.format(BASE_DIR))


# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

TIME_ZONE = 'Europe/Paris'
LANGUAGE_CODE = 'fr'

USE_I18N = True
USE_L10N = True

LANGUAGES = (
    ('fr', 'Francais'),
    ('en', 'Anglais'),
    ('ja', 'Japonais'),
)

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

# Templates
TEMPLATE_DIRS = (
    "templates"
)

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = '{}/static'.format(BASE_DIR)



STATICFILES_STORAGE = 'pipeline.storage.PipelineStorage'

PIPELINE_CSS_COMPRESSOR = 'pipeline.compressors.cssmin.CSSMinCompressor'
PIPELINE_CSSMIN_BINARY = 'cssmin'
PIPELINE_JS_COMPRESSOR = 'pipeline.compressors.slimit.SlimItCompressor'

PIPELINE_CSS = {
    'common_css': {
        'source_filenames': (
            'css/normalize.css',
            'css/main.css',
            'css/medias-queries.css',
            'css/jquery.contextMenu.css',
        ),
        'output_filename': 'min.css',
        'variant': 'datauri',
    },
}
PIPELINE_JS = {
    'common_js': {
        'source_filenames': (
            'js/jquery.min.js',
            'js/jquery-ui-1.10.3.custom.min.js',
            'js/jquery.ui.position.js',
            'js/Blob.js',
            'js/FileSaver.js',
            'js/ScoreEditor.js',
            'js/main.js',
            'js/numbers.js',
            'js/PrintScore.js',
            'js/jquery.contextMenu.js',
            'js/noty/packaged/jquery.noty.packaged.min.js',

        ),
        'output_filename': 'min.js',
    }
}

