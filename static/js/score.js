/***** Liste des classes ****/

// Constructeur de la class partition, prend en paramètre un titre(class), un auteur, une date et une version
function Partition(title, author, date, version) {
	this.title = title;
	this.author = author;
	this.date = date;
	this.version = version;
	this.pistes = [];
}

// Constructeur de la class title, prend en paramètre une font, une font size, une couleur et un font weight
function Title(font, fontSize, color, fontWeight) {
	this.font = font;
	this.fontSize = this.fontSize;
	this.color = color;
	this.fontWeight = fontWeight;
}

//Constructeur de template, prend en paramètre la bordure (true/false), l'école, la taille de la note, le nombre de ligne(true/false) et le nombre de page (true/false)
function Template(border, school, fontSizeNote, numberLine, numberPage) {
	this.border = border;
	this.school = school;
	this.fontSizeNote = fontSizeNote;
	this.numberLine = numberLine;
	this.numberPage = numberPage;
}

//Constructeur d'une piste, prend en paramètre un template(class) et un titre(class)
function Piste(template, title, notes) {
	this.template = template;
	this.title = title;
	this.notes = [];
}

//Constructeur d'une note, prend en paramètre un nom, une durée et un effet
function Note(indice, nom, time, effect) {
    this.indice = indice;
	this.nom = nom;
	this.time = time;
	this.effect = effect;
}

// Sauvegarde la partition sur l'ordinateur de l'utilisateur avec localStorage
function savePartition(partition) {
    if(typeof localStorage!='undefined') {
        var partition_json = JSON.stringify(partition);
        localStorage.setItem("partition",partition_json);
    } else {
        alert("localStorage n'est pas supporté. Impossible de sauvegarder la partition.");
        // A compléter : utilisation de userData pour IE 6 et 7
    }
}

// Actualise l'affichage de la partition
function printPartition(partition) {
    $('#notes').html("");
    for(var i in partition.pistes[0].notes) {
        var note = partition.pistes[0].notes[i];
        $('#notes').html($('#notes').html() + "<div class='note " + note.nom + "'>" + note.indice + "</div>");
    }
}

// Insert des notes à l'indice spécifié
function insertNotesAt(indice, piste, notes) {
    piste.notes.splice(indice, 0, notes);
}

// Supprime des notes à l'indice spécifié et les retourne
function removeNotesAt(indice, piste, nbNotes) {
    return piste.notes.splice(indice, nbNotes);
}

//Constructeur d'événements pour l'historique avec l'action produite et les notes modifiés
function HistoricEvent(action, indice, piste, notes) {
    this.action = action;
    this.indice = indice;
    this.piste = piste;
    this.notes = notes;
}

//Constructeur de l'historique avec un tableau d'événements
function Historic() {
    this.undoEvents = [];
    this.redoEvents = [];
}

Historic.prototype.add = function(event) {
    this.redoEvents.length = 0;
    this.undoEvents.push(event);
}

Historic.prototype.undo = function() {
    if(this.undoEvents.length <= 0) return;
    
    var event = this.undoEvents.pop();
    this.redoEvents.push(event);
    
    switch(event.action) {
        case "add" :
            removeNotesAt(event.indice, event.piste, event.notes.length);
            break;
        
        case "delete" :
            insertNotesAt(event.indice, event.piste, event.notes[0]);
            break;
        
        case "modify" :
            
            break;
    }
}

Historic.prototype.redo = function() {
    if(this.redoEvents.length <= 0) return;
    
    var event = this.redoEvents.pop();
    this.undoEvents.push(event);
    
    switch(event.action) {
        case "add" :
            insertNotesAt(event.indice, event.piste, event.notes[0]);
            break;
        
        case "delete" :
            removeNotesAt(event.indice, event.piste, event.notes.length);
            break;
        
        case "modify" :
            
            break;
    }
}

// Crée une partition vide.
function createPartition() {
        
    var title = new Title("Arial", 20, "#000",  "normal"); //A ajouter à la création d'un titre
    var partition = new Partition(title, "Michu", new Date(), 2); //A ajouter à la création d'une partition
    var template = new Template(true, "konko", 20, false, false); //A ajouter à la création d'une piste
    partition.pistes.push(new Piste(template, title)); //A ajouter à la création d'une piste => ajoute une piste à la partition
    
    savePartition(partition);
    return partition;
}

// Charge la partition sur l'ordinateur de l'utilisateur avec localStorage
function loadPartition() {
    // Si l'utilisateur a déjà une partition stockée sur son ordinateur, on la récupère, sinon on lui en crée une nouvelle.
    if(typeof localStorage!='undefined') {
        if('partition' in localStorage) {
            var partition_json = localStorage.getItem("partition");
            partition = JSON.parse(partition_json);
            
            return partition;
        } else return createPartition();
    }
    
    alert("localStorage n'est pas supporté. Impossible de charger la partition.");
    // A compléter : utilisation de userData pour IE 6 et 7
    return createPartition();
}

$(document).ready(function() {
    var partition = loadPartition();
    var historic = new Historic();
	
	var nbNotes = partition.pistes[0].notes.length;
	printPartition(partition);
	
	/*** Ajout d'une note ***/
	$('a.note-picker').click(function(e) {
        e.preventDefault();
        
		var n = $(this).text();
		var nom;
		var indice;
		switch(n) {
			case "ro" : 
				nom = "ro";
				indice = "a";
				break;

			case "tsu" : 
				nom = "tsu";
				indice = "b";
				break;

			case "re" : 
				nom = "re";
				indice = "c";
				break;

			case "chi" :
				nom = "chi";
				indice = "d";
				break;

			case "ri" :
				nom = "ri";
				indice = "e";
				break; 
				
			default : alert("Note inconnue : " + n);
			    break;
		}
        
        var note = new Note(indice, nom, 20, "aigu");
        historic.add(new HistoricEvent("add", nbNotes, partition.pistes[0], [note]));
        insertNotesAt(nbNotes++, partition.pistes[0], note);
		
		printPartition(partition);
		savePartition(partition);
	});


	/*** Sauvegarde ***/
	$('.save').click(function(e) {
		savePartition(partition);
	});
    
    /*** Chargement ***/
	/*$('div.deserialisation').click(function(e) {
		loadPartition(partition);
		partition.print();
	});*/
	
	$('.undo').click(function(e) {
	    e.preventDefault();
		historic.undo();
		nbNotes = partition.pistes[0].notes.length;
		printPartition(partition);
		
	});	
	
	$('.redo').click(function(e) {
	    e.preventDefault();
		historic.redo();
		nbNotes = partition.pistes[0].notes.length;
		printPartition(partition);
	});

});
