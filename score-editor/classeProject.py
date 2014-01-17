# -*-coding:Latin-1 -*

""" Module qui contient les class du projet komuso : partition, title, template, piste, note """

class Partition : 
	""" Class partition qui contient un titre(class), un auteur, une date et une version"""
	def __init__(self, title, autor, date, version) :
		""" Constructeur de la class partition, prend en paramètre un titre(class), un auteur, une date et une version """
		self.title = title
		self.autor = autor
		self.date = date
		self.version = version
		self.pistes = []

class Title :
	""" Class title qui contient une font, la taille de la font, sa couleur et le font weight """
	def __init__(self, font, fontSize, color, fontWeight) :
		""" Constructeur de la class title, prend en paramètre une font, une font size, une couleur et un font weight """
		self.font = font
		self.fontSize = fontSize
		self.color = color
		self.fontWeight = fontWeight

class Template :
	""" Class template qui contient la bordure (true/false), l'école, la taille de la note, le nombre de ligne(true/false) et le nombre de page (true/false) """
	def __init__(self, border, school, fontSizeNote, numberLine, numberPage) :
		""" Constructeur de template, prend en paramètre la bordure (true/false), l'école, la taille de la note, le nombre de ligne(true/false) et le nombre de page (true/false) """
		self.border = border
		self.school = school
		self.fontSizeNote = fontSizeNote
		self.numberLine = numberLine
		self.numberPage = numberPage

class Piste : 
	""" Class Piste qui contient un template(class) et un titre(class) """
	def __init__(self, template, title) :
		""" Constructeur d'une piste, prend en paramètre un template(class) et un titre(class) """
		self.template = template
		self.title = title
		self.notes = []

class Note :
	""" Class note qui contient le nom, la durée et l'effet de la note """ 
	def __init__(self, nom, time, effect) :
		""" Constructeur d'une note, prend en paramètre un nom, une durée et un effet """
		self.nom = nom
		self.time = time
		self.effect = effect
