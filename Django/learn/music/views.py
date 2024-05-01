from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import get_template

# Create your views here.
def index_views(request):
  # return HttpResponse('<h1>music index</h1>')
  t = get_template("static.html") # 模版名称
  html = t.render()
  return HttpResponse(html)