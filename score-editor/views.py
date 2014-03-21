#-*- coding: utf-8 -*-
from django.http import HttpResponse
from django.template import Context
from django.shortcuts import render_to_response
from django.template import RequestContext
import os
from django.conf import settings
from django.template.loader import get_template
from xhtml2pdf import pisa
import json
from django.templatetags.static import static

def home(request):
        url = settings.STATIC_ROOT+'/js/notes.json'
        font_data = json.load(open(url))
        return render_to_response('score-editor/index.html',font_data, RequestContext(request))

def fetch_resources(uri, rel):
    """
    Callback to allow xhtml2pdf/reportlab to retrieve Images,Stylesheets, etc.
    `uri` is the href attribute from the html link element.
    `rel` gives a relative path, but it's not used here.

    """
    if uri.startswith(settings.MEDIA_URL):
        path = os.path.join(settings.MEDIA_ROOT,
                            uri.replace(settings.MEDIA_URL, ""))
    elif uri.startswith(settings.STATIC_URL):
        path = os.path.join(settings.STATIC_ROOT,
                            uri.replace(settings.STATIC_URL, ""))
    else:
        path = os.path.join(settings.STATIC_ROOT,
                            uri.replace(settings.STATIC_URL, ""))

        if not os.path.isfile(path):
            path = os.path.join(settings.MEDIA_ROOT,
                                uri.replace(settings.MEDIA_URL, ""))

            if not os.path.isfile(path):
                raise UnsupportedMediaPathException(
                                    'media urls must start with %s or %s' % (
                                    settings.MEDIA_ROOT, settings.STATIC_ROOT))

    return path
                 
def home_pdf(request):
    # Prepare context
    data = {}
    data['STATIC_ROOT'] = settings.STATIC_ROOT
    if request.method == 'GET':
        data['partition'] = json.loads(request.GET.get("partition"))

    # Render html content through html template with context
    template = get_template('score-editor/pdf.html')
    html = template.render(Context(data))

    # Write PDF to file
    file = open(os.path.join(settings.STATIC_ROOT, 'partition.pdf'), "w+b")
    pisaStatus = pisa.CreatePDF(html, dest=file,
            link_callback = fetch_resources)

    # Return PDF document through a Django HTTP response
    file.seek(0)
    pdf = file.read()
    file.close()            # Don't forget to close the file handle
    return HttpResponse(pdf, mimetype='application/pdf')
