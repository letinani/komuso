/***** Liste des classes ****/

// Constructeur de la class partition, prend en paramètre un titre(class), un auteur, une date et une version
function Partition(title, autor, date, version) {
	this.class = "Partition";
	this.title = title;
	this.autor = autor;
	this.date = date;
	this.version = version;
	this.pistes = [];
}

// Constructeur de la class title, prend en paramètre une font, une font size, une couleur et un font weight
function Title(font, fontSize, color, fontWeight) {
	this.class = "Title";
	this.font = font;
	this.fontSize = this.fontSize;
	this.color = color;
	this.fontWeight = fontWeight;
}

//Constructeur de template, prend en paramètre la bordure (true/false), l'école, la taille de la note, le nombre de ligne(true/false) et le nombre de page (true/false)
function Template(border, school, fontSizeNote, numberLine, numberPage) {
	this.class = "Template";
	this.border = border;
	this.school = school;
	this.fontSizeNote = fontSizeNote;
	this.numberLine = numberLine;
	this.numberPage = numberPage;
}

//Constructeur d'une piste, prend en paramètre un template(class) et un titre(class)
function Piste(template, title, notes) {
	this.class = "Piste";
	this.template = template;
	this.title = title;
	this.notes = [];
}

//Constructeur d'une note, prend en paramètre un nom, une durée et un effet
function Note(nom, time, effect) {
	this.class = "Note";
	this.nom = nom;
	this.time = time;
	this.effect = effect;
}


var title = new Title("Arial", 20, "#000",  "normal"); //A ajouter à la création d'un titre
var partition = new Partition(title, "Test", new Date(), 2); //A ajouter à la création d'une partition
var template = new Template(Boolean(true), "konko", 20, Boolean(false), Boolean(false)); //A ajouter à la création d'une piste
partition.pistes.push(new Piste(template, title)); //A ajouter à la création d'une piste => ajoute une piste à la partition

function saveJSON() {
    window.open( "data:text/json;charset=utf-8," + escape(JSON.stringify(partition,  null, "\t")));
}


$(document).ready(function() {

	var i  = 0;

	/**** Clique sur un bouton ***/
	$('a').click(function(e) {

		var n = $(this).index();
		var nom;
		switch(n) {
			case 0 : 
				nom = "ro";
				break;

			case 1 : 
				nom = "tsu";
				break;

			case 2 : 
				nom = "re";
				break;

			case 3 :
				nom = "chi";
				break;

			case 4 :
				nom = "ri";
				break; 
		}

		partition.pistes[0].notes.push(new Note(nom, 20, "aigu")); //A ajouter à la création d'une note => ajoute une note à la premiere piste

		alert(partition.pistes[0].notes[i].nom);
		++i;

		console.log(JSON.stringify(partition,  null, "\t"));

	});


	/**** clique sur la div test sérialisation ***/
	$('div.serialisation').click(function(e) {
		saveJSON();
		//console.log(JSON.stringify(partition,  null, "\t"));

	});

	$('div.deserialisation').click(function(e) {
		console.log(JSON.parse(JSON.stringify(partition,  null, "\t")));
		//console.log(JSON.stringify(partition,  null, "\t"));

	});

});