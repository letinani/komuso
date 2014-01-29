/***** Affichage de toutes les notes de la partition ****/
function affichage(number_max, type, clear, title, colonm_max) {

	if(clear == 1) {
		document.getElementById('score').innerHTML = "";
		var section = document.createElement('section');
		section.setAttribute("id", "title");
		section.setAttribute("class", "empty");

		var form = document.createElement('form');

		var textarea = document.createElement('textarea');
		textarea.setAttribute("rows", "20");
		textarea.setAttribute("cols", "1");
		textarea.setAttribute("placeholder", "Titre de la partition");
		textarea.innerHTML = title;

		form.appendChild(textarea);
		section.appendChild(form);
	}

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('note'); //Récupère avec le nom de la classe

	//Note
	
	var note = document.createElement('div'); //Créer une div
	if(type != "blank")
		note.setAttribute("class","note ui-state-default " + type);//Ajoute la class note à la div
	else
		note.setAttribute("class", "note "+type);

	switch(type) {
		case "ro" :
			note.innerHTML = "d";
			break;

		case "tsu" :
			note.innerHTML = "f";
			break;

		case "re" :
			note.innerHTML = "c";
			break;

		case "chi" :
			note.innerHTML = "a";
			break;

		case "ri" :
			note.innerHTML = "e";
			break;
	}

	//Vérifie s'il faut ajouter une nouvelle colonne ou pas
	if(notes.length%number_max == 0 || type == "blank") { //Besoin d'ajouter une nouvelle colonne 
		//Colonne
		var colonm = document.createElement('div'); //Créer une div
		colonm.setAttribute("class","column");//Ajoute la classe colonm à la div

		//H2
		var number = document.createElement('h2'); //Créer un h2
		number.setAttribute("class","cols_numbers");//Ajoute la classe colonm au h2
		number.innerHTML = notes.length + 1;

		//Pages
		var sheets = document.getElementsByClassName('sheet'); //Récupère avec le nom de la classe

		//div notes
		var list_notes = document.createElement('div'); //Créer une div
		list_notes.setAttribute("class","notes");//Ajoute la classe notes à la div

		//Récupère toutes les colonnes
		var list_colonms = document.getElementsByClassName('notes'); //Récupère toutes les colonnes

		colonm.appendChild(number);
		colonm.appendChild(list_notes);
		
		list_notes.appendChild(note); //Ajoute la note à la colonne

		var colonm_max_sheet; //nombre colonne max par page
		var list_colonms_lenght;
		if(sheets.length <= 1) {
			colonm_max_sheet = colonm_max - 1;
			list_colonms_lenght = list_colonms.length;
		}
		else {
			colonm_max_sheet = colonm_max;
			list_colonms_lenght = list_colonms.length + 1;
		}

		//Vérifie s'il faut ajouter une page ou pas
		if(list_colonms_lenght%colonm_max_sheet == 0) { //Besoin d'ajouter une nouvelle page

			//Page 
			var page = document.createElement('section'); //Créer une dive
			page.setAttribute("class", "sheet");

			var create_clear = document.createElement('div');
			create_clear.setAttribute("class", "clear");

			if(clear == 1)
				page.appendChild(section);

			page.appendChild(colonm);
			page.appendChild(create_clear);

			document.getElementById('score').appendChild(page);

		}
		else {
			//Récupère la div clear
			var clear = sheets[sheets.length-1].getElementsByClassName('clear'); //Récupère avec le nom de la classe
			sheets[sheets.length-1].insertBefore(colonm, clear[0]); //ajoute la colonne au contenu
		}
		
	}
	else { //Pas besoin d'ajouter une nouvelle colonne
		var list_notes = document.getElementsByClassName('notes'); //Récupère toutes les colonnes
		if(list_notes[list_notes.length-1])
			list_notes[list_notes.length-1].appendChild(note); //Ajoute la note à la dernière colonne
	}

}

/***** Ajouter une note à la fin de la partion : prend en paramètre le nombre max de note par colonne ***/
function append(number_max, type, colonm_max) {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('note'); //Récupère avec le nom de la classe

	//Note
	var note = document.createElement('div'); //Créer une div
	note.setAttribute("class","note " + type);//Ajoute la class note à la div

	switch(type) {
		case "ro" :
			note.innerHTML = "d";
			break;

		case "tsu" :
			note.innerHTML = "f";
			break;

		case "re" :
			note.innerHTML = "c";
			break;

		case "chi" :
			note.innerHTML = "a";
			break;

		case "ri" :
			note.innerHTML = "e";
			break;
	}

	//Vérifie s'il faut ajouter une nouvelle colonne ou pas
	if(notes.length%number_max == 0 || type == "blank") { //Besoin d'ajouter une nouvelle colonne 
		//Colonne
		var colonm = document.createElement('div'); //Créer une div
		colonm.setAttribute("class","column");//Ajoute la classe colonm à la div

		//H2
		var number = document.createElement('h2'); //Créer un h2
		number.setAttribute("class","cols_numbers");//Ajoute la classe colonm au h2
		number.innerHTML = notes.length + 1;

		//Pages
		var sheets = document.getElementsByClassName('sheet'); //Récupère avec le nom de la classe

		//div notes
		var list_notes = document.createElement('div'); //Créer une div
		list_notes.setAttribute("class","notes");//Ajoute la classe notes à la div
		list_notes.setAttribute("id","notes");//Ajoute la classe notes à la div

		colonm.appendChild(number);
		colonm.appendChild(list_notes);
		if(type != "blank")
			list_notes.appendChild(note); //Ajoute la note à la colonne

		var colonm_max_sheet; //nombre colonne max par page
		var list_colonms_lenght;
		if(sheets.length <= 1) {
			colonm_max_sheet = colonm_max - 1;
			list_colonms_lenght = list_colonms.length;
		}
		else {
			colonm_max_sheet = colonm_max;
			list_colonms_lenght = list_colonms.length + 1;
		}

		//Vérifie s'il faut ajouter une page ou pas
		if(list_colonms_lenght%colonm_max_sheet == 0) { //Besoin d'ajouter une nouvelle page

			//Page 
			var page = document.createElement('section'); //Créer une dive
			page.setAttribute("class", "sheet");

			var create_clear = document.createElement('div');
			create_clear.setAttribute("class", "clear");

			page.appendChild(colonm);
			page.appendChild(create_clear);

			document.getElementById('score').appendChild(page);

		}
		else {
			//Récupère la div clear
			var clear = sheets[sheets.length-1].getElementsByClassName('clear'); //Récupère avec le nom de la classe
			sheets[sheets.length-1].insertBefore(colonm, clear[0]); //ajoute la colonne au contenu
		}
	}
	else { //Pas besoin d'ajouter une nouvelle colonne
		var list_notes = document.getElementsByClassName('notes'); //Récupère toutes les colonnes
		if(list_notes[list_notes.length-1])
			list_notes[list_notes.length-1].appendChild(note); //Ajoute la note à la dernière colonne
	}
}

/*** Remove la dernière note ***/
function removeLast() {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('note'); //Récupère avec le nom de la classe

	var list_colonm = document.getElementsByClassName('column'); //Récupère toutes les colonnes

	//Pages
	var sheets = document.getElementsByClassName('sheet'); //Récupère avec le nom de la classe

	notes[notes.length-1].parentNode.removeChild(notes[notes.length-1]); //Retirer la note à la colonne

	//Vérifie s'il faut retirer une colonne ou pas
	if(!list_colonm[list_colonm.length - 1].childNodes[1].firstChild) { //Retirer une colonne 
		sheets[sheets.length -1].removeChild(list_colonm[list_colonm.length - 1]); 

		if(sheets[sheets.length -1].innerHTML == "") { //Vérifie s'il faut retirer la page ou pas
			document.getElementById('score').removeChild(sheets[sheets.length -1]);
		}
	}
}

/**** Insérer une note à une place précise ***/
function insert(place, number_max, type, colonm_max) {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('note');//Récupère avec les de la classe

	if(place <= notes.length) {

		//Note
		var note = document.createElement('div');//Créer une div
		note.setAttribute("class","note " + type);//Ajoute la classe colonm à la div
		note.setAttribute("id", "test");//Ajoute lid test à la div

		switch(type) {
			case "ro" :
				note.innerHTML = "d";
				break;

			case "tsu" :
				note.innerHTML = "f";
				break;

			case "re" :
				note.innerHTML = "c";
				break;

			case "chi" :
				note.innerHTML = "a";
				break;

			case "ri" :
				note.innerHTML = "e";
				break;
		}

		//Pages
		var sheets = document.getElementsByClassName('sheet'); //Récupère avec le nom de la classe

		//Récupère toutes les colonnes
		var list_colonm = document.getElementsByClassName('notes'); //Récupère avec le nom de la classe
		var colonm_place = parseInt(place/number_max); //calcule le le numéro de la colonne dans laquelle il faut insérer

		list_colonm[colonm_place].insertBefore(note,notes[place]);  //Insère la note dans la colonne

		//Boucle qui permet de décaler les autres notes
		for(var i=colonm_place; i< list_colonm.length; i++) { //Parcours des colonnes à partir de la colonne dans laquelle on a inséré

			//Si la colonne suivante existe
			if(list_colonm[i+1])
				list_colonm[i+1].insertBefore(notes[number_max + (number_max*i)], list_colonm[i+1].firstChild); //Déplace la dernière note de la colonne au début de la colonne suivante
			else{ //La colonne n'existe pas
				//Colonne
				var colonm = document.createElement('div'); //Créer une div
				colonm.setAttribute("class","colonm");//Ajoute la classe colonm à la div

				//H2
				var number = document.createElement('h2'); //Créer un h2
				number.setAttribute("class","cols_numbers");//Ajoute la classe colonm au h2
				number.innerHTML = notes.length + 1;

				//div notes
				var list_notes = document.createElement('div'); //Créer une div
				list_notes.setAttribute("class","notes");//Ajoute la classe notes à la div

				if(notes[number_max + (number_max*i)]) { //Si la note existe
					colonm.appendChild(number);
					colonm.appendChild(list_notes);
					if(type != "blank")
						list_notes.appendChild(notes[number_max + (number_max*i)]); //Ajoute la note à la nouvelle colonne

					var colonm_max_sheet; //nombre colonne max par page
					var list_colonms_lenght;
					if(sheets.length <= 1) {
						colonm_max_sheet = colonm_max - 1;
						list_colonms_lenght = list_colonms.length;
					}
					else {
						colonm_max_sheet = colonm_max;
						list_colonms_lenght = list_colonms.length + 1;
					}

					//Vérifie s'il faut ajouter une page ou pas
					if(list_colonms_lenght%colonm_max_sheet == 0) { //Besoin d'ajouter une nouvelle page

						//Page 
						var page = document.createElement('section'); //Créer une dive
						page.setAttribute("class", "sheet");

						var create_clear = document.createElement('div');
						create_clear.setAttribute("class", "clear");

						page.appendChild(colonm);
						page.appendChild(create_clear);

						document.getElementById('score').appendChild(page);

					}
					else {
						//Récupère la div clear
						var clear = sheets[sheets.length-1].getElementsByClassName('clear'); //Récupère avec le nom de la classe
						sheets[sheets.length-1].insertBefore(colonm, clear[0]); //ajoute la colonne au contenu
					}
				}

			}
		}
	}
}

/*** Remove une note ***/
function remove(place, number_max) {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('number');//Récupère avec les de la classe

	//Récupère toutes les colonnes
	var list_colonm = document.getElementsByClassName('colonm'); //Récupère avec le nom de la classe
	var colonm_place = parseInt(place/number_max); //calcule le le numéro de la colonne dans laquelle il faut insérer

	list_colonm[colonm_place].removeChild(notes[place]);  //Enleve la note dans la colonne

	//Boucle qui permet de décaler les autres notes
	for(var i=colonm_place; i< list_colonm.length; i++) { //Parcours des colonnes à partir de la colonne dans laquelle on a retirer

		//Si la colonne suivante existe
		if(list_colonm[i+1]) {
			list_colonm[i].appendChild(list_colonm[i+1].firstChild); //Déplace le premier element de la colonne suivante à la fin de la colonne
			
			if(!list_colonm[i+1].firstChild) { //S'il n'y a plus de note dans la colonne
				list_colonm[i+1].parentNode.parentNode.removeChild(list_colonm[i+1].parentNode); //Retire la colonne

				if(sheets[sheets.length -1].innerHTML == "") { //Vérifie s'il faut retirer la page ou pas
					document.getElementById('score').removeChild(sheets[sheets.length -1]);
				}
			}
		}
	}
}

/*** Remplace une note ***/
function replace(place, number_max) {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('note');//Récupère avec les de la classe

	if(place <= notes.length) {

		//Note
		var note = document.createElement('div');//Créer une div
		note.setAttribute("class","note " + type);//Ajoute la classe colonm à la div
		note.setAttribute("id", "test");//Ajoute lid test à la div

		switch(type) {
			case "ro" :
				note.innerHTML = "d";
				break;

			case "tsu" :
				note.innerHTML = "f";
				break;

			case "re" :
				note.innerHTML = "c";
				break;

			case "chi" :
				note.innerHTML = "a";
				break;

			case "ri" :
				note.innerHTML = "e";
				break;
		}
		//Récupère toutes les colonnes
		var list_colonm = document.getElementsByClassName('notes');//Récupère avec le nom de la classe
		var colonm_place = parseInt((place-1)/number_max); //calcule le le numéro de la colonne dans laquelle il faut insérer

		list_colonm[colonm_place].replaceChild(note, notes[place-1]); //Replace la note par notre nouvelle note
	}

	/*** OU ****/
	/****
	var notes = document.getElementsByClassName('note');//Récupère avec les de la classe
	if(place <= notes.length)
		notes[place -1].setAttribute("class","note " + type);
	****/
}