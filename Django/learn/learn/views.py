# 编写视图函数，一个函数就是一个独立视图
from django.http import HttpResponse
from django.template.loader import get_template
from django.shortcuts import render

def run_views(request):
  return HttpResponse("Django program")

def run2_views(request, p1, p2):
  return HttpResponse(f'{p1},{p2}')

def test_views(request):
  return HttpResponse('<h1>666</h1>')

def default_views(request):
  return HttpResponse('default')

def login_views(request):
  return HttpResponse('login')

def sum(n1, n2):
  return n1 + n2

def rx_views(request):
  t = get_template("rx.html") # 模版名称
  my_list = [1,2,3,4,5,6,7,8]
  # 同时遍历两个列表for num, letter in zip(list1, list2):
  my_dict = {'a': 1, 'b': 2, 'c': 3}
  # 输出键for key in my_dict:
  # 输出值for value in my_dict.values():
  # 输出键和对应的值for key, value in my_dict.items():
  # 使用索引遍历for index, value in enumerate(my_list):
  context = {
      'variable': 'Hello, world!',
      # 条件遍历：使用列表推导式或生成器表达式可以基于条件遍历列表或字典。
      'list': [x for x in my_list if x > 4],
      'tup': ('a', 'b'),
      'func': sum(6,-6),
      'my_dict': my_dict
  }
  html = t.render(context)
  return HttpResponse(html)
  # return render(request, 'rx.html', context)

def rxstat_views(request):
  # return render(request, 'static.html')
  t = get_template("static.html") # 模版名称
  html = t.render()
  return HttpResponse(html)