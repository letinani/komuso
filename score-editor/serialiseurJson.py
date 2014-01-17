# -*-coding:Latin-1 -*

""" Module qui contient le serialiseur pour passer des classes à un fichier JSON """

from classeProject import *


def serialiseur_perso(obj):

	""" Serialiseur JSON passe des classes à un fichier JSON """

	# Si c'est un titre.
	if isinstance(obj, Title):
		return {"__class__": "Title",
                "font": obj.font,
                "fontSize": obj.fontSize,
                "color": obj.color,
                "fontWeight": obj.fontWeight}
    
    # Si c'est un template.
	if isinstance(obj, Template):
		return {"__class__": "Template",
                "border": obj.border,
                "school": obj.school,
                "fontSizeNote": obj.fontSizeNote,
                "numberLine": obj.numberLine,
                "numberPage": obj.numberPage}

	# Si c'est une note.
	if isinstance(obj, Note):
		return {"__class__": "Note",
                "nom": obj.nom,
                "time": obj.time,
                "effect": obj.effect}

	# Si c'est une piste.
	if isinstance(obj, Piste):
		return {"__class__": "Piste",
                "template": obj.template,
                "title": obj.title,
                "notes": obj.notes}

	# Si c'est une note.
	if isinstance(obj, Partition):
		return {"__class__": "Partition",
                "title": obj.title,
                "autor": obj.autor,
                "date": obj.date,
                "version": obj.version,
                "pistes": obj.pistes}

    # Sinon le type de l'objet est inconnu, on lance une exception.
	raise TypeError(repr(obj) + " n'est pas sérialisable !")