/***** Liste des classes ****/

function ScoreEditor() {
    this.isSaved = true;
    this.historic = new Historic();
    this.partition = this.loadPartition();
}

ScoreEditor.prototype.nbNotes = function() {
    return this.partition.pistes[0].notes.length;
}

// Insert des notes à l'indice spécifié
ScoreEditor.prototype.insertNotesAt = function(indice, piste, notes) {
    this.partition.pistes[piste].notes.splice(indice, 0, notes);
}

// Supprime des notes à l'indice spécifié et les retourne
ScoreEditor.prototype.removeNotesAt = function(indice, piste, nbNotes) {
    return this.partition.pistes[piste].notes.splice(indice, nbNotes);
}

// Modifie des notes à l'indice spécifié et les retourne
ScoreEditor.prototype.editNotesAt = function(indice, piste, nbNotes, time, effect) {
    for(var i = 0; i < nbNotes; ++i) {
        this.partition.pistes[piste].notes[i].time = time;
        this.partition.pistes[piste].notes[i].effect = effect;
    }
}

// Sauvegarde la partition sur l'ordinateur de l'utilisateur avec localStorage
ScoreEditor.prototype.save = function() {
    if(typeof localStorage!='undefined') {
        localStorage.setItem("partition",JSON.stringify(this.partition));
        localStorage.setItem("historic",JSON.stringify(this.historic));
    } else {
        alert("localStorage n'est pas supporté. Impossible de sauvegarder la partition.");
        // A compléter : utilisation de userData pour IE 6 et 7
    }
}

// Actualise l'affichage de la partition
ScoreEditor.prototype.print = function() {
   // $("#title").find("textarea").val(this.partition.title.text);
    //$('#notes').html("");
    var clear = 1; 
    for(var i in this.partition.pistes[0].notes) { 
       var note = this.partition.pistes[0].notes[i];

       //affichage(nombre max de note par colonne, nom de la note, clear, title, colonne max par page);
       affichage(12, note.nom, clear, this.partition.title.text, 11);
       clear = 0;
        //$('#notes').html($('#notes').html() + "<div class='note " + note.nom + "'>" + note.indice + "</div>");
     }
     load();

 }

// Crée une partition vide.
ScoreEditor.prototype.createPartition = function() { 
    var title = new Title("", "Arial", 20, "#000",  "normal"); //A ajouter à la création d'un titre
    var partition = new Partition(title, "Michu", new Date(), 2); //A ajouter à la création d'une partition
    var template = new Template(true, "konko", 20, false, false); //A ajouter à la création d'une piste
    partition.pistes.push(new Piste(template, title)); //A ajouter à la création d'une piste => ajoute une piste à la partition
    
    return partition;
}

// Charge la partition sur l'ordinateur de l'utilisateur avec localStorage
ScoreEditor.prototype.loadPartition = function() {
    // Si l'utilisateur a déjà une partition stockée sur son ordinateur, on la récupère, sinon on lui en crée une nouvelle.
    if(typeof localStorage!='undefined') {
        if('partition' in localStorage) {
            this.historic = JSON.parse(localStorage.getItem("historic"));
            return JSON.parse(localStorage.getItem("partition"));
        } else {
            this.historic.redoEvents.length = 0;
            this.historic.undoEvents.length = 0;
            return this.createPartition();
        }
    }
    
    alert("localStorage n'est pas supporté. Impossible de charger la partition.");
    // A compléter : utilisation de userData pour IE 6 et 7
    
    return this.createPartition();
}

ScoreEditor.prototype.add = function(event) {
    this.isSaved = false;
    this.historic.redoEvents.length = 0;
    this.historic.undoEvents.push(event);
}

ScoreEditor.prototype.undo = function() {
    if(this.historic.undoEvents.length <= 0) return;
    
    var event = this.historic.undoEvents.pop();
    
    switch(event.action) {
        case "add" :
            this.removeNotesAt(event.indice, event.piste, [event.notes].length);
            break;
        
        case "delete" :
            this.insertNotesAt(event.indice, event.piste, event.notes[0]);
            break;
        
        case "modify" :
            var tmp = event;
            event.time = this.partition.pistes[event.piste].notes[event.indice].time;
            event.effect = this.partition.pistes[event.piste].notes[event.indice].effect;
            this.editNotesAt(tmp.indice, tmp.piste, [tmp.notes].length, tmp.time, tmp.effect);
            break;
    }
    
    this.historic.redoEvents.push(event);
}

ScoreEditor.prototype.redo = function() {
    if(this.historic.redoEvents.length <= 0) return;
    
    var event = this.historic.redoEvents.pop();
    
    switch(event.action) {
        case "add" :
            this.insertNotesAt(event.indice, event.piste, event.notes[0]);
            break;
        
        case "delete" :
            this.removeNotesAt(event.indice, event.piste, [event.notes].length);
            break;
        
        case "modify" :
            var tmp = event;
            event.time = this.partition.pistes[event.piste].notes[event.indice].time;
            event.effect = this.partition.pistes[event.piste].notes[event.indice].effect;
            this.editNotesAt(tmp.indice, tmp.piste, [tmp.notes].length, tmp.time, tmp.effect);
            break;
    }
    
    this.historic.undoEvents.push(event);
}

// Constructeur de la class partition, prend en paramètre un titre(class), un auteur, une date et une version
function Partition(title, author, date, version) {
	this.title = title;
	this.author = author;
	this.date = date;
	this.version = version;
	this.pistes = [];
}

// Constructeur de la class title, prend en paramètre une font, une font size, une couleur et un font weight
function Title(text, font, fontSize, color, fontWeight) {
    this.text = text;
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

//Constructeur d'événements pour l'historique avec l'action produite et les notes modifiés
function HistoricEvent(action, indice, piste, notes, time, effect) {
    this.action = action;
    this.indice = indice;
    this.piste = piste;
    this.notes = notes;
    this.time = time;
    this.effect = effect;
}

//Constructeur de l'historique avec un tableau d'événements
function Historic() {
    this.undoEvents = [];
    this.redoEvents = [];
}

$(document).ready(function() {
    var scoreEditor = new ScoreEditor();

	scoreEditor.print();
	
	/*** Ajout d'une note ***/
	$('a.ton').click(function(e) {
        e.preventDefault();
        
		var n = $(this).text();
		var nom = "ro";
		var indice = "a";
		switch(n) {
			case "ro" : 
				nom = "ro";
				indice = "d";
				break;

			case "tsu" : 
				nom = "tsu";
				indice = "f";
				break;

			case "re" : 
				nom = "re";
				indice = "g";
				break;

			case "chi" :
				nom = "chi";
				indice = "a";
				break;

			case "ri" :
				nom = "ri";
				indice = "e";
				break; 

            case "blank" :
                nom = "blank";
                indice = "";
                break;
				
			default : alert("Note inconnue : " + n);
			    break;
		}
        
        var note = new Note(indice, nom, $("#current-beat").text(), "aigu");
        scoreEditor.add(new HistoricEvent("add", scoreEditor.nbNotes(), 0, [note]));
        scoreEditor.insertNotesAt(scoreEditor.nbNotes(), 0, note);
        
		scoreEditor.save();
		scoreEditor.print();
	});
	
	/*** Title ***/
	$("#title").find("textarea").change(function(e) {
	    scoreEditor.partition.title.text = $(this).val();
	    scoreEditor.isSaved = false;
	    scoreEditor.save();
	});

	/*** Sauvegarde ***/
	$('.saveButton').click(function(e) {
		e.preventDefault();
	    if(typeof localStorage!='undefined') {
            if('partition' in localStorage) {
                var BB = Blob;
                var title = $("#title").find("textarea").val();
                if(title == "") title = "partition";
	            var test = saveAs(
		              new BB(
			              [localStorage.getItem("partition")]
			            , {type: "text/plain;charset=" + document.characterSet}
		            )
		            , title + ".skh"
	            );
	            scoreEditor.isSaved = true;
            }
        }
	    
	});
	
	/*** Nouveau Document ***/
	$('.newDocument').click(function(e) {
	    e.preventDefault();
	    if(!scoreEditor.isSaved) {
	        if(confirm("Vous n'avez pas encore sauvegardé. Si vous continuez, vos modifications seront perdues.")) {
                scoreEditor.partition = scoreEditor.createPartition();
                scoreEditor.historic.redoEvents.length = 0;
                scoreEditor.historic.undoEvents.length = 0;
                scoreEditor.save();
                scoreEditor.print();
            }
        } else {
            scoreEditor.historic.redoEvents.length = 0;
            scoreEditor.historic.undoEvents.length = 0;
            scoreEditor.partition = scoreEditor.createPartition();
            scoreEditor.save();
            scoreEditor.print();
        }
	});
    
    /*** Chargement ***/
    var fileInput = document.querySelector('.loadFile');
    fileInput.onchange = function() {
         if(!scoreEditor.isSaved) {
	        if(confirm("Vous n'avez pas encore sauvegardé. Si vous continuez, vos modifications seront perdues.")) {  
                var reader = new FileReader();
                reader.onload = function() {
                    scoreEditor.historic.redoEvents.length = 0;
                    scoreEditor.historic.undoEvents.length = 0;
                    scoreEditor.partition = JSON.parse(reader.result);
                    scoreEditor.save();
                    scoreEditor.print();
                    scoreEditor.isSaved = true;
                };
                reader.readAsText(fileInput.files[0]);
            }
        } else {
            var reader = new FileReader();
            reader.onload = function() {
                scoreEditor.historic.redoEvents.length = 0;
                scoreEditor.historic.undoEvents.length = 0;
                scoreEditor.partition = JSON.parse(reader.result);
                scoreEditor.save();
                scoreEditor.print();
            };
            reader.readAsText(fileInput.files[0]);
        }
    };
	
	$('.undo').click(function(e) {
	    e.preventDefault();
		scoreEditor.undo();
		scoreEditor.save();
		scoreEditor.print();
	});	
	
	$('.redo').click(function(e) {
	    e.preventDefault();
		scoreEditor.redo();
		scoreEditor.save();
		scoreEditor.print();
	});

});
