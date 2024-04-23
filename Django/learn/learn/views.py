# 编写视图函数，一个函数就是一个独立视图
from django.http import HttpResponse
def run_views(request):
  return HttpResponse("Django program")

def run2_views(request, p1, p2):
  return HttpResponse(f'{p1},{p2}')

def test_views(request):
  return '<h1>666</h1>'