/***** Affichage de toutes les notes de la partition ****/
function affichage(number_max, partition, titlePartition, colonm_max, position) {

	 var currentCol = 1;
	 var currentLine = 0;
	 var currentSheet = 1;
	 
	 var score = document.getElementById('score');
	 score.innerHTML = "";
	 
    var sheet = document.createElement('section');
    sheet.setAttribute("class","sheet");
    
    var title = document.createElement('section');
    title.setAttribute("class","empty");
    title.setAttribute("id","title");
    
    var form = document.createElement('form');
    
    var textarea = document.createElement('textarea');
    textarea.setAttribute('rows','20');
    textarea.setAttribute('cols','1');
    textarea.setAttribute('placeholder','Titre de la partition');
    textarea.innerHTML = titlePartition;
    
    var numPages = document.createElement('span');
    numPages.setAttribute("class","num-page");
    numPages.innerHTML = "1";
    
    form.appendChild(textarea);
    title.appendChild(form);
    
    sheet.appendChild(title);
    if($("#score-pages:checked").length == 1) sheet.appendChild(numPages);
    
    score.appendChild(sheet);
			        
    var colonm;
    var number;
    //Colonne
	colonm = document.createElement('div'); //Créer une div
	colonm.setAttribute("class","column notes2");//Ajoute la classe colonm à la div
	if($("#score-borders:checked").length == 1) colonm.setAttribute("style","border-left:1px solid black; border-right:1px solid black;");
	
	//H2
	number = document.createElement('h2'); //Créer un h2
	number.setAttribute("class","cols_numbers");//Ajoute la classe colonm au h2
	number.innerHTML = currentCol;
	
	if($("#score-lines:checked").length == 1) colonm.appendChild(number);
	sheet.appendChild(colonm);	
	
	var cursor = document.createElement('div');
	cursor.setAttribute("name", 0);
	if(position == 0) {
	    cursor.setAttribute("class", "cursor currentCursor");
	    cursor.style.opacity = "0.75";
	} else {
		cursor.setAttribute("class", "cursor");
	    cursor.style.opacity = "0";
	}    
	    colonm.appendChild(cursor);
	 
	 for(var i = 0; i < partition.length; ++i) {

		//Vérifie s'il faut ajouter une nouvelle colonne ou pas
		if(currentLine == number_max || partition[i].nom == "blank") { //Besoin d'ajouter une nouvelle colonne 
            currentLine = 0;
            
            // Vérifie s'il faut ajouter une nouvelle page ou pas
			if(currentCol == colonm_max) {
			    currentCol = 0;
			    ++currentSheet;
			    
			    //Page
			    sheet = document.createElement('section'); //Créer un h2
			    sheet.setAttribute("class","sheet");//Ajoute la classe colonm au h2
			    
			    numPages = document.createElement('div');
			    numPages.setAttribute("class","num-page");
                numPages.innerHTML = currentSheet;
                
                if($("#score-pages:checked").length == 1) sheet.appendChild(numPages);
			    
			    score.appendChild(sheet);
			}
			
            ++currentCol;
            
			//Colonne
			colonm = document.createElement('div'); //Créer une div
			colonm.setAttribute("class","column notes2");//Ajoute la classe colonm à la div
			if($("#score-borders:checked").length == 1) colonm.setAttribute("style","border-left:1px solid black;");

			//H2
			number = document.createElement('h2'); //Créer un h2
			number.setAttribute("class","cols_numbers");//Ajoute la classe colonm au h2
			number.innerHTML = currentCol;
			
			if($("#score-lines:checked").length == 1) colonm.appendChild(number);
			
			sheet.appendChild(colonm);
			
			cursor = document.createElement('div');
		    cursor.setAttribute("class", "cursor");
		    cursor.setAttribute("name", i);
	        cursor.style.opacity = "0";
	        
	        colonm.appendChild(cursor);	
		}
		
		var classes = "note ui-state-default";
        
        var note = document.createElement('div');
	    note.setAttribute("class",classes);
	    if(partition[i].nom != "blank") note.innerHTML = partition[i].nom;
	    else note.innerHTML = "";
	    
	    var time = document.createElement('div');
        
        colonm.appendChild(note);
        
        cursor = document.createElement('div');
	    cursor.setAttribute("name", i+1);
        if(position == i+1) {
            cursor.setAttribute("class", "cursor currentCursor");
            cursor.style.opacity = "0.75";
        } else {
            cursor.setAttribute("class", "cursor");
            cursor.style.opacity = "0";
        }
        colonm.appendChild(cursor);
        
        if(partition[i].nom != "blank") {
            if(partition[i].time == "|") {
            	if($("#score-barre:checked").length == 1)
            		time.setAttribute("class","effect-time-1-center");
            	else 
            	    time.setAttribute("class","effect-time-1");
            	
                note.appendChild(time);
            } else if(partition[i].time == "||") {
            	if($("#score-barre:checked").length == 1)
            		time.setAttribute("class","effect-time-2-center");
            	else 
            	    time.setAttribute("class","effect-time-2");
               		
                note.appendChild(time);
            }
            
            if(partition[i].effects) {
                for(var j = 0; j < partition[i].effects.length; ++j) {
                    var effect = document.createElement('div');
                    effect.setAttribute("class", partition[i].effects[j].type);
                    effect.innerHTML = partition[i].effects[j].nom;
                    note.appendChild(effect);
                }
            }
            
            currentLine++;
        }
	 }

}

function blink() {
     $( '.currentCursor' ).animate({
            opacity: 0
     }, 800, 'linear', function() { 
            $( '.currentCursor' ).animate({
                opacity: 0.75
            }, 800, 'linear', function() { blink(); });
    });
}
