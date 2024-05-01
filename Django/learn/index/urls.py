from django.urls import path,re_path,include
from .views import *

urlpatterns = [
    path('index/', index_views),
    re_path(r'^$', index_views),
]
