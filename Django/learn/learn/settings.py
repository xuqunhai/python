"""
Django settings for learn project.

Generated by 'django-admin startproject' using Django 5.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# 使用 Path(__file__) 获取当前文件的路径，然后调用 resolve() 来解析为绝对路径，并通过连续调用两次 parent 属性来获取项目的根目录。
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY 是一个安全密钥，用于加密 cookie、密码复位等。这个密钥应当是秘密的，并且在生产环境中必须是唯一的。
SECRET_KEY = 'django-insecure-36i97d3d*th2an8%8a&-a4u6%bjhk!2u)@p%0)&z7w$h5bpj+i'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ALLOWED_HOSTS 定义了哪些域名可以访问此 Django 站点。如果为空，仅在本地开发时可用。
ALLOWED_HOSTS = []


# Application definition
# INSTALLED_APPS 列表包含了项目中启用的所有 Django 应用。
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# MIDDLEWARE 列表定义了一系列的中间件类，这些中间件是在请求处理的过程中按顺序执行的。
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'learn.urls' # 指定了项目的根 URL 配置模块

# 定义了 Django 如何加载和渲染模板。包括使用的后端、模板文件的位置和上下文处理器等。
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 指定了 WSGI 兼容的 Web 服务器入口点，用于运行你的项目。
WSGI_APPLICATION = 'learn.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
# 配置字典定义了项目使用的数据库。默认使用 SQLite，存放在 BASE_DIR / 'db.sqlite3' 路径下。
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators
# 列出了密码验证器，用于检查用户密码的复杂性。
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/
# LANGUAGE_CODE 设置了项目的默认语言。
LANGUAGE_CODE = 'en-us'
# TIME_ZONE 设置了项目的时区。
TIME_ZONE = 'UTC'
# USE_I18N 表示 Django 的国际化系统是否启用。
USE_I18N = True
# USE_TZ 表示 Django 是否使用时区支持。
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/
# 静态文件的 URL 前缀。
STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field
# 设置了默认的自动创建字段类型，用于所有未显式指定字段类型的模型的主键。
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
