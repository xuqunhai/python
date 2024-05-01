"""
URL configuration for learn project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,re_path,include
from .views import *
"""
需要使用 views.py 中定义的所有函数和类时使用。
这里的单个点 (.) 表示当前目录，即与当前执行的脚本文件在同一目录。
views 是指同目录下的一个名为 views.py 的文件。
import * 表示导入目标模块中定义的所有公共对象。公共对象指那些没有以下划线 (_) 开头的对象。

问题
命名空间污染：导入太多不需要的函数和类可能会使命名空间变得杂乱，
代码可读性降低：当查看代码时，如果使用了 import *
"""

"""
如果你的 Django 版本是 2.x 或更新的版本，你应该使用 path() 或 re_path() 替换 url()。
应该更新为使用 path() 和/或 re_path()：
re_path(r'^home/$', views.home, name='home') 使用了 re_path()，它允许你继续使用正则表达式定义复杂的 URL 模式。
"""

app_name = 'learn'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('run/', run_views),
    path('rx/', rx_views),
    path('rxstat/', rxstat_views), # http://127.0.0.1:8000/rxstat/
    # path('music/', include('music.urls')),
    re_path(r'^music/', include('music.urls')),
    re_path(r'^run/(\d{4})/(\d{2})/$', run2_views),
    re_path(r'^user/(?P<user_id>\d+)/$', test_views, name='user-profile'),
    re_path(r'^$', default_views),
    re_path(r'^.*$', login_views),
]
