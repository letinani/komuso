/***** Liste des classes ****/

function ScoreEditor() {
    this.isSaved = true;
    this.historic = new Historic();
    this.partition = this.loadPartition();
    $('#nb-columns-per-pages option[value="'+this.partition.colsPerPage+'"]').attr('selected','selected');
    $('#nb-notes-per-columns option[value="'+this.partition.notesPerCol+'"]').attr('selected','selected');
    this.selection = Selection();
    this.selected = [];
    this.clipboard = [];
    this.cursorPosition = this.nbNotes();
}

ScoreEditor.prototype.nbNotes = function() {
    return this.partition.pistes[0].notes.length;
}

// Insert des notes à l'indice spécifié
ScoreEditor.prototype.insertNotesAt = function(indice, piste, notes) {
    if(!notes.length) {
        this.partition.pistes[piste].notes.splice(indice, 0, notes);
        ++this.cursorPosition;
    } else {
        for(var i = notes.length-1; i >= 0; --i) {
            this.partition.pistes[piste].notes.splice(indice, 0, notes[i]);
        }
        this.cursorPosition+=notes.length;
    }
}

// Supprime des notes à l'indice spécifié et les retourne
ScoreEditor.prototype.removeNotesAt = function(indice, piste, nbNotes) {
    if(!nbNotes) {
        this.partition.pistes[piste].notes.splice(indice, 1);
        --this.cursorPosition;
    } else {
        this.partition.pistes[piste].notes.splice(indice, nbNotes);
        this.cursorPosition-=nbNotes;
    }
}

// Modifie des notes à l'indice spécifié et les retourne
ScoreEditor.prototype.editNotesAt = function(indice, piste, nbNotes, time, effect) {
    for(var i = 0; i < nbNotes; ++i) {
        if(time) this.partition.pistes[piste].notes[indice+i].time = time;
        else if(effect) {
            var hasEffect = false;
            for(var j = 0; j < this.partition.pistes[piste].notes[indice+i].effects.length; ++j) {
                if(effect.type == this.partition.pistes[piste].notes[indice+i].effects[j].type) {
                    hasEffect = true;
                    this.partition.pistes[piste].notes[indice+i].effects[j].nom = effect.nom;
                    break;
                }
            }
            
            if(!hasEffect) this.partition.pistes[piste].notes[indice+i].effects.push(effect);
        }
    }
}

ScoreEditor.prototype.cut = function() {
    if(this.selected.length > 0) {        
        var index = $( "div.note" ).index( $(".ui-selected")[0] );
        
        this.clipboard.length = 0;        
        for(var i = 0; i < this.selected.length; ++i) {
            this.clipboard.push(JSON.parse(JSON.stringify(this.selected[i])));
        }
        
        this.add(new HistoricEvent("delete", index, 0, JSON.parse(JSON.stringify(this.selected))));
        this.removeNotesAt(index, 0, this.selected.length);
        this.update();
        
        $( ".ui-selected").removeClass("ui-selected");
        var menu = document.getElementById('menu-selection');
        if(menu) 
            menu.parentNode.removeChild(menu);
    } else {
        alert("Vous devez sélectionner des notes avant de pouvoir les couper !");
    }
}

ScoreEditor.prototype.copy = function() {
    if(this.selected.length > 0) {
        this.clipboard.length = 0;
        for(var i = 0; i < this.selected.length; ++i) {
            this.clipboard.push(JSON.parse(JSON.stringify(this.selected[i])));
        }
        
        this.update();
        
        $( ".ui-selected").removeClass("ui-selected");
        var menu = document.getElementById('menu-selection');
        if(menu) 
            menu.parentNode.removeChild(menu);
    } else {
        alert("Vous devez sélectionner des notes avant de pouvoir les copier !");
    }
}

ScoreEditor.prototype.paste = function() {      
    if(this.clipboard.length > 0) {
        if(this.selected.length > 0) {
            var index = $( "div.note" ).index( $(".ui-selected")[0] );
            this.add(new HistoricEvent("replace", index, 0, JSON.parse(JSON.stringify(this.selected)), null, null, JSON.parse(JSON.stringify(this.clipboard))));
            this.removeNotesAt(index, 0, this.selected.length);
            this.insertNotesAt(index, 0, JSON.parse(JSON.stringify(this.clipboard)));
        } else {
            this.add(new HistoricEvent("add", this.cursorPosition, 0, JSON.parse(JSON.stringify(this.clipboard))));
            this.insertNotesAt(this.cursorPosition, 0, JSON.parse(JSON.stringify(this.clipboard)));
        }
        
        this.update();
        
        $( ".ui-selected").removeClass("ui-selected");
        var menu = document.getElementById('menu-selection');
        if(menu) 
            menu.parentNode.removeChild(menu);
    } else {
        alert("Le presse papier est vide !");
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
    this.selected.length = 0;
    
    if(this.cursorPosition > this.nbNotes()) this.cursorPosition = this.nbNotes();
    else if(this.cursorPosition < 0) this.cursorPosition = 0;
    
    affichage(this.partition.notesPerCol, this.partition.pistes[0].notes, this.partition.title.text, this.partition.colsPerPage, this.cursorPosition, this.partition.language);
    
    $('.cursor').unbind('mouseover');
    $('.cursor').mouseover(function(e) {
        if(!$(this).hasClass('currentCursor')) {
        
            $( this ).animate({
                opacity: 0.75
            }, 50);
        }
    });
    
    $('.cursor').unbind('mouseout');
    $('.cursor').mouseout(function(e) {
        if(!$(this).hasClass('currentCursor')) {
        
            $( this ).animate({
                opacity: 0
            }, 50);
        }
    });
    
    $('.cursor').unbind('mouseup');
    var scoreEditor = this;
    $('.cursor').mouseup(function(e) {     
         if(!$(this).hasClass('currentCursor')) {
             $('.cursor').css('border-top','solid 2px #AAA');
             $( this ).css('border-top','solid 2px #F70');
             $( '.currentCursor' ).animate({
                    opacity: 0
             }, 100);
             $( '.currentCursor' ).removeClass('currentCursor');
             $( this ).addClass('currentCursor');
             
             scoreEditor.cursorPosition = $( this ).attr('name');
         }
    });
   
    load();
}

ScoreEditor.prototype.update = function() {
    this.save();
    this.print();
    
    var scoreEditor = this;
    var firstSelected;
    $( "#score" ).selectable({
        filter: "div.note,textarea",
        cancel: "a,textarea,.cursor",
        selecting: function( event, ui ) {
            if(!firstSelected) firstSelected = ui.selecting;
            
            refreshSelection(firstSelected, ui.selecting);
        },
        unselecting: function( event, ui ) {        
            refreshSelection(firstSelected, ui.unselecting);
        },
	    stop: function() {
	        firstSelected = null;
	        var element = document.getElementsByClassName('ui-selected');
            if(element.length == 0) {
                var menu = document.getElementById('menu-selection');
                if(menu) 
                    menu.parentNode.removeChild(menu);      

            } else {                
                var index = $( "div.note" ).index( $(".ui-selected")[0] );
                
                $( ".ui-selected", this ).each(function() {
                    var indexTmp = $( "div.note" ).index( this );
                    scoreEditor.selected.push(JSON.parse(JSON.stringify(scoreEditor.partition.pistes[0].notes[indexTmp])));
                });
                
                var effectTest = false;
                if(scoreEditor.selected[0].effects) {
                    for(var i = 0; i < scoreEditor.selected[0].effects.length; ++i) {
                        if(scoreEditor.selected[0].effects[i].type == "effect-note") effectTest = true;
                    }
                }
                
                if(element.length == 1 && !effectTest) {
                    element[0].appendChild(scoreEditor.selection);
                    /*** Personnalisation du menu de sélection ***/
                    $("#menu-selection").find(".note-menu").html("&nbsp;");
                    if(scoreEditor.selected[0].effects) {
                        for(var i = 0; i < scoreEditor.selected[0].effects.length; ++i) {
                            $("#menu-selection").find(".note-menu[name='"+ scoreEditor.selected[0].effects[i].type +"']").html(scoreEditor.selected[0].effects[i].nom);
                        }
                    }
                }
                
                $('.clic-delete').unbind('mouseup');
                /*** Suppression de notes ***/
                $('.clic-delete').mouseup(function(e) {
                    e.preventDefault();
                    
                    scoreEditor.add(new HistoricEvent("delete", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected))));
                    scoreEditor.removeNotesAt(index, 0, scoreEditor.selected.length);
                    scoreEditor.update();
                });
                
                $('.sub-note-menu').unbind('mouseup');
                /*** Modification de l'effet ***/
                $('.sub-note-menu').mouseup(function(e) {
                    e.preventDefault();
                    var effect = $(this).text();
                    var effectType = $(this).attr("name");
                    $(this).parent().parent().parent().find("span.note-menu").html(effect);
                    
                    scoreEditor.add(new HistoricEvent("modify", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected)), null, new Effect(effect, effectType)));
                    scoreEditor.editNotesAt(index, 0, scoreEditor.selected.length, null, new Effect(effect, effectType));
                    scoreEditor.update();
                });
                
                //$('.color').unbind('mouseup');
                /*** Modification de la couleur ***/
                /*$('.color').mouseup(function(e) {
                    e.preventDefault();
                    
                    // A compléter
                });*/
            }
        },
        start: function() {
            var menu = document.getElementById('menu-selection');
            if(menu) 
                menu.parentNode.removeChild(menu);
                
            $( ".ui-selected").removeClass("ui-selected");
            scoreEditor.selected.length = 0;
            
            if ($('#side-menu').is(':visible')) {
                $("#side-menu").animate({right:"-400px"}, 400);
            }
        }
	});
}

function refreshSelection(firstSelected, selecting) {
    var currentIndex = $( ".note" ).index( selecting ); 
    var index = $( ".note" ).index( firstSelected );
    var element = document.getElementsByClassName('note');
    
    for(var i = 0; i < element.length; ++i) {
        if($(element[i]).hasClass('ui-selecting')) $(element[i]).removeClass('ui-selecting');
        
        if(currentIndex < index) {
            if(i >= currentIndex && i <= index) $(element[i]).addClass('ui-selecting');
        } else {
            if(i <= currentIndex && i >= index) $(element[i]).addClass('ui-selecting');
        }
    }
}

// Crée une partition vide.
ScoreEditor.prototype.createPartition = function() { 
    var title = new Title("", "Arial", 20, "#000",  "normal"); //A ajouter à la création d'un titre
    
    var partition = new Partition(title, "Michu", new Date(), 2, $("#nb-columns-per-pages").val(), $("#nb-notes-per-columns").val(), "japanese"); //A ajouter à la création d'une partition
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
            break;
        
        case "replace" :
            this.removeNotesAt(event.indice, event.piste, event.tmp.length);
            this.insertNotesAt(event.indice, event.piste, event.notes);
            break;
    }
    
    this.historic.redoEvents.push(event);
    
    this.update();
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
            break;
            
        case "replace" :
            this.removeNotesAt(event.indice, event.piste, event.notes.length);
            this.insertNotesAt(event.indice, event.piste, event.tmp);
            break;
    }
    
    this.historic.undoEvents.push(event);
    
    this.update();
}

// Constructeur de la class partition, prend en paramètre un titre(class), un auteur, une date et une version
function Partition(title, author, date, version, colsPerPage, notesPerCol, language) {
	this.title = title;
	this.author = author;
	this.date = date;
	this.version = version;
    this.language = language;
	this.pistes = [];
	this.colsPerPage = colsPerPage;
	this.notesPerCol = notesPerCol;
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
function Note(nom, type, time, effects) {
    this.type = type;
	this.nom = nom;
	this.time = time;
	this.effects = [];
	for(var i = 0; i < effects.length; ++i) {
	    this.effects.push(effects[i]);
	}
}

function Effect(nom, type) {
    this.nom = nom;
    this.type = type;
}

//Constructeur d'événements pour l'historique avec l'action produite et les notes modifiés
function HistoricEvent(action, indice, piste, notes, time, effect, tmp) {
    this.action = action;
    this.indice = indice;
    this.piste = piste;
    this.notes = notes;
    this.time = time;
    this.effect = effect;
    this.tmp = tmp;
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
    selection.innerHTML = $("#menu-selection").html();
    return selection;
}

$(document).ready(function() {
    var scoreEditor = new ScoreEditor();

	scoreEditor.update();
	blink();
	
	/*** Ajout d'une note ***/
	$('a.note').click(function(e) {
        e.preventDefault();
		var nom = $(this).text(); //retourne la valeur du a
		var type = $(this).attr("name");
		
		var effects = [];
		if(type == "effect-note") effects.push(new Effect("",type));
		
		var note = new Note(nom, type, $("#current-beat").text(), effects);
		
		if(scoreEditor.selected.length == 0) {
            scoreEditor.add(new HistoricEvent("add", $('.currentCursor').attr('name'), 0, note));
            scoreEditor.insertNotesAt($('.currentCursor').attr('name'), 0, note);
        } else {
            var index = $( "div.note" ).index( $( ".ui-selected")[0] );
            
            scoreEditor.add(new HistoricEvent("replace", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected)), null, null, note));
            scoreEditor.removeNotesAt(index, 0, scoreEditor.selected.length);
            scoreEditor.insertNotesAt(index, 0, note);
        }
        
		scoreEditor.update();
	});
	
	$("a.beat").click( function (e) {
        e.preventDefault();
        
        $("#current-beat").text($(this).text());
        
        if(scoreEditor.selected.length > 0) {
            var index = $( "div.note" ).index( $( ".ui-selected")[0] );
            
            scoreEditor.add(new HistoricEvent("modify", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected)), $("#current-beat").text()));
            scoreEditor.editNotesAt(index, 0, scoreEditor.selected.length, $("#current-beat").text());
            scoreEditor.update();
        }
    });
    
    $("a.blank").click(function(e) {
        e.preventDefault();
        var note = new Note("blank", "", "", []);
		
        if(scoreEditor.selected.length == 0) {
            scoreEditor.add(new HistoricEvent("add", $('.currentCursor').attr('name'), 0, note));
            scoreEditor.insertNotesAt($('.currentCursor').attr('name'), 0, note);
        } else {
            var index = $( "div.note" ).index( $( ".ui-selected")[0] );
        
            scoreEditor.add(new HistoricEvent("add", index, 0, note));
            scoreEditor.insertNotesAt(index, 0, note);
        }
    
        scoreEditor.update();
    });
    
    $("a.delete-menu").click(function(e) {
        e.preventDefault();
        if(scoreEditor.selected.length > 0) {
            var index = $( "div.note" ).index( $( ".ui-selected")[0] );
            
            scoreEditor.add(new HistoricEvent("delete", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected))));
            scoreEditor.removeNotesAt(index, 0, scoreEditor.selected.length);
            scoreEditor.update();
        } else {
            alert("Vous devez sélectionner des notes avant de les supprimer !");
        }
    });
    
     /*** Title ***/
	$("#title").find("textarea").change(function(e) {
	    scoreEditor.partition.title.text = $(this).val();
	    scoreEditor.isSaved = false;
	    scoreEditor.save();
	});
	
	$("#nb-notes-per-columns").change(function(e) {
	    scoreEditor.partition.notesPerCol = $(this).val();
	    scoreEditor.save();
	});
	
	$("#nb-columns-per-pages").change(function(e) {
	    scoreEditor.partition.colsPerPage = $(this).val();
	    scoreEditor.save();
	});

    /*** Changement de langue du titre ***/
     $("#languageButton").click(function(e) {
        e.preventDefault();

        if(this.className == "buttonFrench")
            scoreEditor.partition.language = "french";
        else
            scoreEditor.partition.language = "japanese";

        scoreEditor.update();
        
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
	});	
	
	$('.redo').click(function(e) {
	    e.preventDefault();
		scoreEditor.redo();
	});
	
	$(document).keydown(function(e) {
        switch(e.which) {
            case 13:
                if($(':focus').length == 0) {
                    e.preventDefault();
                    var note = new Note("blank", "", "", []);

                    if(scoreEditor.selected.length == 0) {
                        scoreEditor.add(new HistoricEvent("add", $('.currentCursor').attr('name'), 0, note));
                        scoreEditor.insertNotesAt($('.currentCursor').attr('name'), 0, note);
                    } else {
                        var index = $( "div.note" ).index( $( ".ui-selected")[0] );
                    
                        scoreEditor.add(new HistoricEvent("add", index, 0, note));
                        scoreEditor.insertNotesAt(index, 0, note);
                    }
                    scoreEditor.update();
                }
	            break;
	        case 46:
	            if($(':focus').length == 0) {
                    e.preventDefault();
                    var index = scoreEditor.cursorPosition;
                    if(scoreEditor.selected.length > 0) { 
                        index = $( "div.note" ).index( $(".ui-selected")[0] );
                               
                        scoreEditor.add(new HistoricEvent("delete", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected))));
                        scoreEditor.removeNotesAt(index, 0, scoreEditor.selected.length);
                        scoreEditor.update();
                    } else if(scoreEditor.partition.pistes[0].notes[index]) {
                        scoreEditor.add(new HistoricEvent("delete", index, 0, JSON.parse(JSON.stringify(scoreEditor.partition.pistes[0].notes[index]))));
                        scoreEditor.removeNotesAt(index, 0, 1);
                        scoreEditor.update();
                    }
                }
                break;
            case 8:
                if($(':focus').length == 0) {
                    e.preventDefault();
                    var index = scoreEditor.cursorPosition;
                    if(scoreEditor.selected.length > 0) { 
                        index = $( "div.note" ).index( $(".ui-selected")[0] );
                               
                        scoreEditor.add(new HistoricEvent("delete", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected))));
                        scoreEditor.removeNotesAt(index, 0, scoreEditor.selected.length);
                        scoreEditor.update();
                    } else if(scoreEditor.partition.pistes[0].notes[index-1]) {
                        scoreEditor.add(new HistoricEvent("delete", index-1, 0, JSON.parse(JSON.stringify(scoreEditor.partition.pistes[0].notes[index-1]))));
                        scoreEditor.removeNotesAt(index-1, 0, 1);
                        scoreEditor.update();
                    }
                }
                break;
            case 37: // Left
                if($(':focus').length == 0) {
                    e.preventDefault();
                    var i;
                    for(i = 1; i < $("#nb-notes-per-columns").val(); ++i) {
                        if(parseInt(scoreEditor.cursorPosition)+i < scoreEditor.nbNotes()) {
                            if(scoreEditor.partition.pistes[0].notes[parseInt(scoreEditor.cursorPosition)+i].nom == "blank") break;
                        }
                    }
                    scoreEditor.cursorPosition = parseInt(scoreEditor.cursorPosition)+i;
                    
                    scoreEditor.print();
                }
                break;
                
            case 39: // Right
                if($(':focus').length == 0) {
                    e.preventDefault();
                    var i;
                    for(i = 1; i < $("#nb-notes-per-columns").val(); ++i) {
                        if(parseInt(scoreEditor.cursorPosition)-i > 0) {
                            if(scoreEditor.partition.pistes[0].notes[parseInt(scoreEditor.cursorPosition)-i].nom == "blank") break;
                        }
                    }
                    scoreEditor.cursorPosition = parseInt(scoreEditor.cursorPosition)-i;
                    
                    scoreEditor.print();
                }
                break;
                
            case 38: // Top
                if($(':focus').length == 0) {
                    e.preventDefault();
                    --scoreEditor.cursorPosition;
                    scoreEditor.print();
                }
                break;
                
            case 40: // Bottom
                if($(':focus').length == 0) {
                    e.preventDefault();
                    ++scoreEditor.cursorPosition;
                    scoreEditor.print();
                }
                break;
        }
	});
	
	var down = [];
    $(document).keydown(function(e) {
        down[e.keyCode] = true;
    }).keyup(function(e) {
        if (down[17] && down[88]) { // Cut
            scoreEditor.cut();
        } else if (down[17] && down[67]) { // Copy
            scoreEditor.copy();
        } else if (down[17] && down[86]) { // Paste
            scoreEditor.paste();
        } else if (down[17] && down[90] && !down[16]) { // Undo
            e.preventDefault();
            scoreEditor.undo();
        } else if ((down[17] && down[16] && down[90]) || (down[17] && down[89])) { // Redo
            e.preventDefault();
            scoreEditor.redo();
        } else if (down[17] && down[65]) { // Select All
            // A compléter.
        }
        down[e.keyCode] = false;
    });
	
	$( "input:checkbox" ).click(function(e) {
	    scoreEditor.print();
	});
	
	$( "select" ).change(function(e) {
	    scoreEditor.print();
	});
	
	$.contextMenu({
        selector: '#score', 
        callback: function(key, options) {
            switch(key) {
                case "cut":
                    scoreEditor.cut();
                    break;
                
                case "copy":
                    scoreEditor.copy();
                    break;
                
                case "paste":
                    scoreEditor.paste();
                    break;
                
                case "delete":
                    if(scoreEditor.selected.length > 0) {        
                        var index = $( "div.note" ).index( $(".ui-selected")[0] );
            
                        scoreEditor.add(new HistoricEvent("delete", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected))));
                        scoreEditor.removeNotesAt(index, 0, scoreEditor.selected.length);
                        scoreEditor.update();
                    } else alert("Vous devez sélectionner des notes pour les supprimer !");
                    break;
                
                case "undo":
                    scoreEditor.undo();
                    break;
                
                case "redo":
                    scoreEditor.redo();
                    break;
            }
        },
        items: {
            "cut": {name: "Cut", icon: "cut"},
            "copy": {name: "Copy", icon: "copy"},
            "paste": {name: "Paste", icon: "paste"},
            "delete": {name: "Delete", icon: "delete"},
            "sep1": "---------",
            "undo": {name: "Undo"},
            "redo": {name: "Redo"}
        }
    });
    
    $('#export-pdf').click(function(e){
        e.preventDefault();
        $("#partition-pdf").val(JSON.stringify(scoreEditor.partition));
        $("#form-export-pdf").submit();
    });
    
    $('#print-pdf').click(function(e){
        e.preventDefault();
        window.print();
    });

});
