/***** Liste des classes ****/

function ScoreEditor() {
    this.isSaved = true;
    this.historic = new Historic();
    this.partition = this.loadPartition();
    this.selection = Selection();
    this.clipboard = [];
}

ScoreEditor.prototype.nbNotes = function() {
    return this.partition.pistes[0].notes.length;
}

// Insert des notes à l'indice spécifié
ScoreEditor.prototype.insertNotesAt = function(indice, piste, notes) {
    if(!notes.length)
        this.partition.pistes[piste].notes.splice(indice, 0, notes);
    else {
        for(var i = notes.length-1; i >= 0; --i) {
            this.partition.pistes[piste].notes.splice(indice, 0, notes[i]);
        }
    }
}

// Supprime des notes à l'indice spécifié et les retourne
ScoreEditor.prototype.removeNotesAt = function(indice, piste, nbNotes) {
    if(!nbNotes)
        this.partition.pistes[piste].notes.splice(indice, 1);
    else
        this.partition.pistes[piste].notes.splice(indice, nbNotes);
}

// Modifie des notes à l'indice spécifié et les retourne
ScoreEditor.prototype.editNotesAt = function(indice, piste, nbNotes, time, effect) {
    if(!nbNotes) {
        if(time) this.partition.pistes[piste].notes[indice].time = time;
        else if(effect) this.partition.pistes[piste].notes[indice].effect = effect;
    } else {
        for(var i = 0; i < nbNotes; ++i) {
            if(time) this.partition.pistes[piste].notes[indice+i].time = time;
            else if(effect) this.partition.pistes[piste].notes[indice+i].effect = effect;
        }
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
    $("#title").find("textarea").val(this.partition.title.text);
    //$('#notes').html("");
    var clear = 1; 
    if(this.partition.pistes[0].notes.length == 0) $('#notes').html("");
    for(var i in this.partition.pistes[0].notes) { 
        var note = this.partition.pistes[0].notes[i];

        //affichage(nombre max de note par colonne, nom de la note, clear, title, colonne max par page);
        affichage(5, note.nom, clear, this.partition.title.text, 11);
        clear = 0;
        //$('#notes').html($('#notes').html() + "<div class='note " + note.nom + "'>" + note.indice + "</div>");
    }
    load();
    cursor("default");
}

ScoreEditor.prototype.update = function() {
    this.save();
    this.print();
    
    var scoreEditor = this;
    $( ".notes" ).selectable({
        cancel: "a",
	    stop: function() {
	        var element = document.getElementsByClassName('ui-selected');
              
            if(element.length == 0) {
                var menu = document.getElementById('menu-selection');
                if(menu) 
                    menu.parentNode.removeChild(menu);

                $( ".notes" ).unbind("click");
                /*** CLIC CURSOR ***/
                $( ".notes" ).click(function(e) {

                    //S'il a des notes dans la colonne
                    if(this.childNodes) {
                        var notes = this.childNodes; //Récupère toutes les notes de la colonne
                        var y; 
                        if (e.pageX || e.pageY) { 
                          y = e.pageY; //récupère la position y du clic
                        }

                        var cursor = document.getElementById('cursor'); //récupère le curseur

                        //Pour chaque note de la colonne
                        for(i=0; i<notes.length; ++i) {

                            var position = notes[i].getBoundingClientRect(); //récupère la position de la note

                            if(parseInt(position.top - y) < 20) { //s'il est proche du haut de la note 
                                this.insertBefore(cursor, notes[i]); //place le curseur avant la note
                            }

                        }

                        var position = notes[notes.length -1].getBoundingClientRect(); //récupère la position de la note
                        if(parseInt(position.bottom - y) < 20) { //s'il est proche du bas de la note 
                            this.appendChild(cursor); //Ajoute à la fin
                        }
                    }

                });

                $( ".column" ).unbind("click");
                 $('.column').click(function(e) {
                     if(this.childNodes[1]) {
                        if(!this.childNodes[1].firstChild) {
                            var cursor = document.getElementById('cursor'); //récupère le curseur
                            this.childNodes[1].appendChild(cursor);
                        }

                    }
                });               

            } else {
                element[0].appendChild(scoreEditor.selection);
                
                var selection = [];
                var index = $( ".notes div.note" ).index( $( ".ui-selected")[0] );
                
                $( ".ui-selected", this ).each(function() {
                    var indexTmp = $( ".notes div.note" ).index( this );
                    selection.push(JSON.stringify(scoreEditor.partition.pistes[0].notes[indexTmp]));
                });
                
                for(var i = 0; i < selection.length; ++i) {
                    selection[i] = JSON.parse(selection[i]);
                }
                
                $('.delete').unbind('mouseup');
                /*** Suppression de notes ***/
                $('.delete').on('mouseup',function(e) {
                    e.preventDefault();
                    
                    scoreEditor.add(new HistoricEvent("delete", index, 0, selection, $(this).find("span").html()));
                    scoreEditor.removeNotesAt(index, 0, selection.length, $(this).find("span").html());
                    scoreEditor.update();
                });
                
                $('.rythme').unbind('mouseup');
                /*** Modification du rythme ***/
                $('.rythme').mouseup(function(e) {
                    e.preventDefault();
                    
                    scoreEditor.add(new HistoricEvent("modify", index, 0, selection, $(this).find("span").html()));
                    scoreEditor.editNotesAt(index, 0, selection.length, $(this).find("span").html());
                    scoreEditor.update();
                });
                
                $('.effect').unbind('mouseup');
                /*** Modification de l'effet ***/
                $('.effect').mouseup(function(e) {
                    e.preventDefault();
                    
                    scoreEditor.add(new HistoricEvent("modify", index, 0, selection, null, $(this).find("span").html()));
                    scoreEditor.editNotesAt(index, 0, selection.length, null, $(this).find("span").html());
                    scoreEditor.update();
                });
                
                $('.color').unbind('mouseup');
                /*** Modification de la couleur ***/
                $('.color').mouseup(function(e) {
                    e.preventDefault();
                    
                    // A compléter
                });
                
                $('.copy').unbind('mouseup');
                /*** Copier ***/
                $('.copy').mouseup(function(e) {
                    e.preventDefault();
                    
                    scoreEditor.clipboard.length = 0;
                    scoreEditor.clipboard = selection;
                    
                    $( ".ui-selected").removeClass("ui-selected");
                    var menu = document.getElementById('menu-selection');
                    if(menu) 
                        menu.parentNode.removeChild(menu);
                });
                
                $('.past').unbind('mouseup');
                /*** Coller ***/
                $('.past').mouseup(function(e) {
                    e.preventDefault();
                    
                    if(scoreEditor.clipboard.length > 0) {
                        scoreEditor.add(new HistoricEvent("replace", index, 0, selection));
                        scoreEditor.removeNotesAt(index, 0, selection.length);
                        scoreEditor.insertNotesAt(index, 0, scoreEditor.clipboard);
                        scoreEditor.update();
                        
                        $( ".ui-selected").removeClass("ui-selected");
                        var menu = document.getElementById('menu-selection');
                        if(menu) 
                            menu.parentNode.removeChild(menu);
                    } else {
                        alert("Le presse papier est vide !");
                    }
                });
            }
        },
        start: function() {
            var menu = document.getElementById('menu-selection');
            if(menu) 
                menu.parentNode.removeChild(menu);
        }
	});
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
            this.removeNotesAt(event.indice, event.piste, event.notes.length);
            break;
        
        case "delete" :
            this.insertNotesAt(event.indice, event.piste, event.notes);
            break;
        
        case "modify" :
            for(var i = 0; i < event.notes.length; ++i) {
                this.partition.pistes[event.piste].notes[event.indice+i] = event.notes[i];
            }
            alert(JSON.stringify(this.partition.pistes[0].notes));
            break;
        
        case "replace" :
            this.removeNotesAt(event.indice, event.piste, this.clipboard.length);
            this.insertNotesAt(event.indice, event.piste, event.notes);
            break;
    }
    
    this.historic.redoEvents.push(event);
}

ScoreEditor.prototype.redo = function() {
    if(this.historic.redoEvents.length <= 0) return;
    
    var event = this.historic.redoEvents.pop();
    
    switch(event.action) {
        case "add" :
            this.insertNotesAt(event.indice, event.piste, event.notes);
            break;
        
        case "delete" :
            this.removeNotesAt(event.indice, event.piste, event.notes.length);
            break;
        
        case "modify" :
            this.editNotesAt(event.indice, event.piste, event.notes.length, event.time, event.effect);
            alert(JSON.stringify(this.partition.pistes[0].notes));
            break;
            
        case "replace" :
            this.removeNotesAt(event.indice, event.piste, event.notes.length);
            this.insertNotesAt(event.indice, event.piste, this.clipboard);
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

// Constructeur de la sélection de notes.
function Selection() {
    
    var selection = document.createElement('div');
    selection.setAttribute("id", "menu-selection");
    selection.setAttribute("class", "note-selected");

    var nav = document.createElement('nav');
    nav.setAttribute("class", "menu-edit-note circles");

        var ul = document.createElement('ul');

            var liDelete = document.createElement('li');
                var aDelete = document.createElement('a');
                aDelete.setAttribute("class", "note-picker note-menu delete");
                aDelete.setAttribute("href", "");
                    var spanDelete = document.createElement('span');
                aDelete.appendChild(spanDelete);
            liDelete.appendChild(aDelete);

            var liCopy = document.createElement('li');
                var aCopy = document.createElement('a');
                aCopy.setAttribute("class", "note-picker note-menu copy");
                aCopy.setAttribute("href", "");
                    var spanCopy = document.createElement('span');
                aCopy.appendChild(spanCopy);
            liCopy.appendChild(aCopy);

            var liPast = document.createElement('li');
                var aPast = document.createElement('a');
                aPast.setAttribute("class", "note-picker note-menu past");
                aPast.setAttribute("href", "");
                    var spanPast = document.createElement('span');
                aPast.appendChild(spanPast);
            liPast.appendChild(aPast);

            var liRythme = document.createElement('li');
                var aRythme = document.createElement('a');
                aRythme.setAttribute("class", "note-picker note-menu rythme");
                aRythme.setAttribute("href", "");
                    var spanRythme = document.createElement('span');
                    spanRythme.innerHTML = "'";
                aRythme.appendChild(spanRythme);
            liRythme.appendChild(aRythme);

            var liEffect = document.createElement('li');
                var aEffect = document.createElement('a');
                aEffect.setAttribute("class", "note-picker note-menu effect");
                aEffect.setAttribute("href", "");

                    var spanEffect = document.createElement('span');
                    spanEffect.innerHTML = "a";
                aEffect.appendChild(spanEffect);
            liEffect.appendChild(aEffect);

            var liColor = document.createElement('li');
                var aColor = document.createElement('a');
                aColor.setAttribute("class", "note-picker note-menu color");
                aColor.setAttribute("href", "");
                    var spanColor = document.createElement('span');
                aColor.appendChild(spanColor);
            liColor.appendChild(aColor);

        ul.appendChild(liDelete);
        ul.appendChild(liCopy);
        ul.appendChild(liPast);
        ul.appendChild(liRythme);
        ul.appendChild(liEffect);
        ul.appendChild(liColor);

    nav.appendChild(ul);
    selection.appendChild(nav);
    
    return selection;
}

$(document).ready(function() {
    var scoreEditor = new ScoreEditor();

	scoreEditor.update();
	
	if(document.getElementById('cursor'))
        setInterval(cligno, 1000);
	
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
        scoreEditor.add(new HistoricEvent("add", getPositionCursor(), 0, note));
        scoreEditor.insertNotesAt(getPositionCursor(), 0, note);
        
		scoreEditor.update();
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
                scoreEditor.update();
            }
        } else {
            scoreEditor.historic.redoEvents.length = 0;
            scoreEditor.historic.undoEvents.length = 0;
            scoreEditor.partition = scoreEditor.createPartition();
            scoreEditor.update();
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
                    scoreEditor.update();
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
                scoreEditor.update();
            };
            reader.readAsText(fileInput.files[0]);
        }
    };
	
	$('.undo').click(function(e) {
	    e.preventDefault();
		scoreEditor.undo();
		scoreEditor.update();
	});	
	
	$('.redo').click(function(e) {
	    e.preventDefault();
		scoreEditor.redo();
		scoreEditor.update();
	});

});
