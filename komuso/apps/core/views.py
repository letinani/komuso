#-*- coding: utf-8 -*-
from django.http import HttpResponse

def home(request):
  text = """<h1>Application komuso !</h1>
            <p>page de test</p>"""
  return HttpResponse(text)