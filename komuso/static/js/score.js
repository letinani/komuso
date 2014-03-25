/***** Liste des classes ****/

function ScoreEditor() {
    this.isSaved = true;
    this.historic = new Historic();
    this.partition = this.loadPartition();
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
    
    affichage($("#nb-notes-per-columns").val(), this.partition.pistes[0].notes, this.partition.title.text, $("#nb-columns-per-pages").val(), this.cursorPosition);
    
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
             scoreEditor.update();
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
            
            var currentIndex = $( ".note" ).index( ui.selecting ); 
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
        },
        unselecting: function( event, ui ) {        
            var currentIndex = $( ".note" ).index( ui.unselecting );
            
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
        },
	    stop: function() {
	        firstSelected = null;
	        var element = document.getElementsByClassName('ui-selected');
            if(element.length == 0) {
                var menu = document.getElementById('menu-selection');
                if(menu) 
                    menu.parentNode.removeChild(menu);      

            } else {
                element[0].appendChild(scoreEditor.selection);
                
                var index = $( "div.note" ).index( $(".ui-selected")[0] );
                var testRythme = true;
                
                $( ".ui-selected", this ).each(function() {
                    var indexTmp = $( "div.note" ).index( this );
                    scoreEditor.selected.push(JSON.parse(JSON.stringify(scoreEditor.partition.pistes[0].notes[indexTmp])));
                    if(scoreEditor.partition.pistes[0].notes[indexTmp].time != scoreEditor.partition.pistes[0].notes[index].time) testRythme = false;
                });
                
                $('.delete').unbind('mouseup');
                /*** Suppression de notes ***/
                $('.delete').on('mouseup',function(e) {
                    e.preventDefault();
                    
                    scoreEditor.add(new HistoricEvent("delete", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected))));
                    scoreEditor.removeNotesAt(index, 0, scoreEditor.selected.length);
                    scoreEditor.update();
                });
                
                if(testRythme) $('.rythme').find("span").html(scoreEditor.selected[0].time);
                else $('.rythme').find("span").html("?");
                
                $('.rythme').unbind('mouseup');
                /*** Modification du rythme ***/
                $('.rythme').mouseup(function(e) {
                    e.preventDefault();
                    if($(e.target).hasClass('sub-note-menu')) {
                        $(this).find("span").html($(e.target).text());
                        
                        scoreEditor.add(new HistoricEvent("modify", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected)), $(this).find("span").html()));
                        scoreEditor.editNotesAt(index, 0, scoreEditor.selected.length, $(this).find("span").html()); 
                    }                   
                    scoreEditor.update();
                });
                
                //$('.effect').unbind('mouseup');
                /*** Modification de l'effet ***/
                /*$('.effect').mouseup(function(e) {
                    e.preventDefault();
                    if($(e.target).hasClass('sub-note-menu') || $(e.target).parent().hasClass('sub-note-menu')) {
                        $(this).find("span").html($(e.target).parent().html());
                        //alert($(this).find("span").html());
                        scoreEditor.add(new HistoricEvent("modify", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected)), null, $(this).find("span").html()));
                        scoreEditor.editNotesAt(index, 0, scoreEditor.selected.length, null, $(this).find("span").html());
                    }
                    scoreEditor.update();
                });*/
                
                $('.color').unbind('mouseup');
                /*** Modification de la couleur ***/
                $('.color').mouseup(function(e) {
                    e.preventDefault();
                    
                    // A compléter
                });
                
                $('.cut').unbind('mouseup');
                /*** Couper ***/
                $('.cut').mouseup(function(e) {
                    e.preventDefault();
                    
                    scoreEditor.cut();
                });
                
                $('.copy').unbind('mouseup');
                /*** Copier ***/
                $('.copy').mouseup(function(e) {
                    e.preventDefault();
                    
                    scoreEditor.copy();
                });
                
                $('.past').unbind('mouseup');
                /*** Coller ***/
                $('.past').mouseup(function(e) {
                    e.preventDefault();
                    
                    scoreEditor.paste();
                });
            }
        },
        start: function() {
            var menu = document.getElementById('menu-selection');
            if(menu) 
                menu.parentNode.removeChild(menu);
                
            $( ".ui-selected").removeClass("ui-selected");
            scoreEditor.selected.length = 0;
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

    var nav = document.createElement('nav');
    nav.setAttribute("class", "menu-edit-note circles");

        var ul = document.createElement('ul');

            var liDelete = document.createElement('li');
            liDelete.setAttribute("class", "note-picker delete");
                var aDelete = document.createElement('a');
                aDelete.setAttribute("class", "note-menu");
                aDelete.setAttribute("href", "");
                    var spanDelete = document.createElement('span');
                aDelete.appendChild(spanDelete);
            liDelete.appendChild(aDelete);

            var liCopy = document.createElement('li');
            liCopy.setAttribute("class", "note-picker copy");
                var aCopy = document.createElement('a');
                aCopy.setAttribute("class", "note-menu");
                aCopy.setAttribute("href", "");
                    var spanCopy = document.createElement('span');
                aCopy.appendChild(spanCopy);
            liCopy.appendChild(aCopy);

            var liPast = document.createElement('li');
            liPast.setAttribute("class", "note-picker past");
                var aPast = document.createElement('a');
                aPast.setAttribute("class", "note-menu");
                aPast.setAttribute("href", "");
                    var spanPast = document.createElement('span');
                aPast.appendChild(spanPast);
            liPast.appendChild(aPast);

            var liCut = document.createElement('li');
            liCut.setAttribute("class", "note-picker cut");
                var aCut = document.createElement('a');
                aCut.setAttribute("class", "note-menu");
                aCut.setAttribute("href", "");
                    var spanCut = document.createElement('span');
                aCut.appendChild(spanCut);
            liCut.appendChild(aCut);

            var liRythme = document.createElement('li');
            liRythme.setAttribute("class", "note-picker rythme");
                var aRythme = document.createElement('a');
                aRythme.setAttribute("class", "note-menu");
                aRythme.setAttribute("href", "");
                    var spanRythme = document.createElement('span');
                    spanRythme.innerHTML = "'";
                aRythme.appendChild(spanRythme);
                var ulRythme = document.createElement('ul');
                ulRythme.setAttribute("class", "sub-note-picker");
                    var liRythmeEffect1 = document.createElement('li');
                    liRythmeEffect1.setAttribute("class", "effect1");
                        var aRythmeEffect1 = document.createElement('a');
                        aRythmeEffect1.setAttribute("class", "sub-note-menu");
                        aRythmeEffect1.setAttribute("href", "");
                        aRythmeEffect1.innerHTML = "'";
                    liRythmeEffect1.appendChild(aRythmeEffect1);
                    var liRythmeEffect2 = document.createElement('li');
                    liRythmeEffect2.setAttribute("class", "effect2");
                        var aRythmeEffect2 = document.createElement('a');
                        aRythmeEffect2.setAttribute("class", "sub-note-menu");
                        aRythmeEffect2.setAttribute("href", "");
                        aRythmeEffect2.innerHTML = "|";
                    liRythmeEffect2.appendChild(aRythmeEffect2);
                    var liRythmeEffect3 = document.createElement('li');
                    liRythmeEffect3.setAttribute("class", "effect3");
                        var aRythmeEffect3 = document.createElement('a');
                        aRythmeEffect3.setAttribute("class", "sub-note-menu");
                        aRythmeEffect3.setAttribute("href", "");
                        aRythmeEffect3.innerHTML = "||";
                    liRythmeEffect3.appendChild(aRythmeEffect3);
                ulRythme.appendChild(liRythmeEffect1);
                ulRythme.appendChild(liRythmeEffect2);
                ulRythme.appendChild(liRythmeEffect3);
            liRythme.appendChild(aRythme);
            liRythme.appendChild(ulRythme);

            var liEffect = document.createElement('li');
            liEffect.setAttribute("class", "note-picker effect");
                var aEffect = document.createElement('a');
                aEffect.setAttribute("class", "note-menu");
                aEffect.setAttribute("href", "");
                    var spanEffect = document.createElement('span');
                    spanEffect.innerHTML = "&nbsp;";
                    aEffect.appendChild(spanEffect);
                var ulEffect = document.createElement('ul');
                ulEffect.setAttribute("class", "sub-note-picker");
                    var liEffect1 = document.createElement('li');
                    liEffect1.setAttribute("class", "effect1");
                        var aEffect1 = document.createElement('a');
                        aEffect1.setAttribute("class", "sub-note-menu");
                        aEffect1.setAttribute("href", "");
                        aEffect1.innerHTML = "&nbsp;";
                    liEffect1.appendChild(aEffect1);
                    var liEffect2 = document.createElement('li');
                    liEffect2.setAttribute("class", "effect2");
                        var aEffect2 = document.createElement('a');
                        aEffect2.setAttribute("class", "sub-note-menu");
                        aEffect2.setAttribute("href", "");
                            var imgEffect2 = document.createElement("img");
                            imgEffect2.setAttribute('src','/static/img/zigzag.png')
                        aEffect2.appendChild(imgEffect2);
                    liEffect2.appendChild(aEffect2);
                    var liEffect3 = document.createElement('li');
                    liEffect3.setAttribute("class", "effect3");
                        var aEffect3 = document.createElement('a');
                        aEffect3.setAttribute("class", "sub-note-menu");
                        aEffect3.setAttribute("href", "");
                            var imgEffect3 = document.createElement("img");
                            imgEffect3.setAttribute('style','width:20%;')
                            imgEffect3.setAttribute('src','/static/img/eclair.png');
                        aEffect3.appendChild(imgEffect3);
                    liEffect3.appendChild(aEffect3);
                ulEffect.appendChild(liEffect1);
                ulEffect.appendChild(liEffect2);
                ulEffect.appendChild(liEffect3);
            liEffect.appendChild(aEffect);
            liEffect.appendChild(ulEffect);


            var liColor = document.createElement('li');
            liColor.setAttribute("class", "note-picker color");
                var aColor = document.createElement('a');
                aColor.setAttribute("class", "note-menu");
                aColor.setAttribute("href", "");
                    var spanColor = document.createElement('span');
                aColor.appendChild(spanColor);
            liColor.appendChild(aColor);

        ul.appendChild(liDelete);
        ul.appendChild(liCopy);
        ul.appendChild(liPast);
        ul.appendChild(liCut);
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
	blink();
	
	/*** Ajout d'une note ***/
	$('a.note').click(function(e) {
        e.preventDefault();
		var nom = $(this).text(); //retourne la valeur du a
		var type = $(this).attr("name");
		
		var effects = [];
		if($("#current-effect-top-right").text() != "") effects.push(new Effect($("#current-effect-top-right").text(),"effect-top-right"));
		if($("#current-effect-middle-right").text() != "") effects.push(new Effect($("#current-effect-middle-right").text(),"effect-middle-right"));
		if($("#current-effect-bottom-right").text() != "") effects.push(new Effect($("#current-effect-bottom-right").text(),"effect-bottom-right"));
		if($("#current-effect-bottom-left").text() != "") effects.push(new Effect($("#current-effect-bottom-left").text(),"effect-bottom-left"));
		
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
        $("#current-effect-top-right").html("");
        $("#current-effect-middle-right").html("");
        $("#current-effect-bottom-right").html("");
        $("#current-effect-bottom-left").html("");
        
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
    
    $("a.clic-effect-top-right").click( function (e) {
        e.preventDefault();
        
        $("#current-effect-top-right").html($(this).html());
        
        if(scoreEditor.selected.length > 0) {
            var index = $( "div.note" ).index( $( ".ui-selected")[0] );
            
            scoreEditor.add(new HistoricEvent("modify", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected)), null, new Effect($("#current-effect-top-right").text(),"effect-top-right")));
            scoreEditor.editNotesAt(index, 0, scoreEditor.selected.length, null, new Effect($("#current-effect-top-right").text(),"effect-top-right"));
            scoreEditor.update();
        }
    });
    
    $("a.clic-effect-middle-right").click( function (e) {
        e.preventDefault();
        
        $("#current-effect-middle-right").html($(this).html());
        
        if(scoreEditor.selected.length > 0) {
            var index = $( "div.note" ).index( $( ".ui-selected")[0] );
            
            scoreEditor.add(new HistoricEvent("modify", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected)), null, new Effect($("#current-effect-middle-right").text(),"effect-middle-right")));
            scoreEditor.editNotesAt(index, 0, scoreEditor.selected.length, null, new Effect($("#current-effect-middle-right").text(),"effect-middle-right"));
            scoreEditor.update();
        }
    });
    
    $("a.clic-effect-bottom-right").click( function (e) {
        e.preventDefault();
        
        $("#current-effect-bottom-right").html($(this).html());
        
        if(scoreEditor.selected.length > 0) {
            var index = $( "div.note" ).index( $( ".ui-selected")[0] );
            
            scoreEditor.add(new HistoricEvent("modify", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected)), null, new Effect($("#current-effect-bottom-right").text(),"effect-bottom-right")));
            scoreEditor.editNotesAt(index, 0, scoreEditor.selected.length, null, new Effect($("#current-effect-bottom-right").text(),"effect-bottom-right"));
            scoreEditor.update();
        }
    });
    
    $("a.clic-effect-bottom-left").click( function (e) {
        e.preventDefault();
        
        $("#current-effect-bottom-left").html($(this).html());
        
        if(scoreEditor.selected.length > 0) {
            var index = $( "div.note" ).index( $( ".ui-selected")[0] );
            
            scoreEditor.add(new HistoricEvent("modify", index, 0, JSON.parse(JSON.stringify(scoreEditor.selected)), null, new Effect($("#current-effect-bottom-left").text(),"effect-bottom-left")));
            scoreEditor.editNotesAt(index, 0, scoreEditor.selected.length, null, new Effect($("#current-effect-bottom-left").text(),"effect-bottom-left"));
            scoreEditor.update();
        }
    });
    
    $("a.delete-menu").click(function(e) {
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
		        break;
		    case 46:
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
                break;
            case 8:
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
                break;
	        case 37: // Left
	            var i;
	            for(i = 1; i < $("#nb-notes-per-columns").val(); ++i) {
	                if(parseInt(scoreEditor.cursorPosition)+i < scoreEditor.nbNotes()) {
	                    if(scoreEditor.partition.pistes[0].notes[parseInt(scoreEditor.cursorPosition)+i].nom == "blank") break;
	                }
	            }
	            scoreEditor.cursorPosition = parseInt(scoreEditor.cursorPosition)+i;
	            
	            scoreEditor.print();
	            break;
	            
	        case 39: // Right
	            var i;
	            for(i = 1; i < $("#nb-notes-per-columns").val(); ++i) {
	                if(parseInt(scoreEditor.cursorPosition)-i > 0) {
	                    if(scoreEditor.partition.pistes[0].notes[parseInt(scoreEditor.cursorPosition)-i].nom == "blank") break;
	                }
	            }
	            scoreEditor.cursorPosition = parseInt(scoreEditor.cursorPosition)-i;
	            
	            scoreEditor.print();
	            break;
	            
	        case 38: // Top
	            --scoreEditor.cursorPosition;
	            scoreEditor.print();
	            break;
	            
	        case 40: // Bottom
	            ++scoreEditor.cursorPosition;
	            scoreEditor.print();
	            break;
	    }
	});
	
	var down = [];
    $(document).keydown(function(e) {
        e.preventDefault();
        down[e.keyCode] = true;
    }).keyup(function(e) {
        if (down[17] && down[88]) { // Cut
            scoreEditor.cut();
        } else if (down[17] && down[67]) { // Copy
            scoreEditor.copy();
        } else if (down[17] && down[86]) { // Paste
            scoreEditor.paste();
        } else if (down[17] && down[90] && !down[16]) { // Undo
            scoreEditor.undo();
        } else if ((down[17] && down[16] && down[90]) || (down[17] && down[89])) { // Redo
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
