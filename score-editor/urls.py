from django.conf.urls import patterns, include, url
#from wkhtmltopdf.views import PDFTemplateView
import os

urlpatterns = patterns('score-editor.views',
    url(r'^$', 'home'),
    #url(r'^export-pdf/', 'home_pdf'),
    #url(r'^export-pdf/', PDFTemplateView.as_view(template_name='score-editor/index.html', filename='partition.pdf'), name='pdf'),
)
