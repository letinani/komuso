$(document).ready(function() {

	var number_max = 13; //Le nombre max de note par colonne

	$('a.pdf').click(function(e) {
		append(number_max, "ro"); //ajouter à la fin de la partition
		load();

	});

	$('a.button').click(function(e) {

		insert(6, number_max, "ro"); //insérer une note 
		load();

	});

	$('a.replace').click(function(e) {
		replace(16, number_max, "ro"); //remplacer une note
		load();
	});

});

/***** Ajouter une note à la fin de la partion : prend en paramètre le nombre max de note par colonne ***/
function append(number_max, type) {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('note'); //Récupère avec le nom de la classe

	//Note
	var note = document.createElement('div'); //Créer une div
	note.setAttribute("class","note " + type);//Ajoute la class note à la div

	switch(type) {
		case "ro" :
			note.innerHTML = "a";
			break;

		case "tsu" :
			note.innerHTML = "b";
			break;

		case "re" :
			note.innerHTML = "c";
			break;

		case "chi" :
			note.innerHTML = "d";
			break;

		case "ri" :
			note.innerHTML = "e";
			break;
	}

	//Vérifie s'il faut ajouter une nouvelle colonne ou pas
	if(notes.length%number_max == 0) { //Besoin d'ajouter une nouvelle colonne 
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

		colonm.appendChild(number);
		colonm.appendChild(list_notes);
		list_notes.appendChild(note); //Ajoute la note à la colonne
		document.getElementById('content').appendChild(colonm); //ajoute la colonne au contenu
	}
	else { //Pas besoin d'ajouter une nouvelle colonne
		var list_notes = document.getElementsByClassName('notes'); //Récupère toutes les colonnes
		list_notes[list_notes.length - 1].appendChild(note); //Ajoute la note à la dernière colonne
	}
}

/**** Insérer une note à une place précise ***/
function insert(place, number_max, type) {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('note');//Récupère avec les de la classe

	if(place <= notes.length) {

		//Note
		var note = document.createElement('div');//Créer une div
		note.setAttribute("class","note " + type);//Ajoute la classe colonm à la div
		note.setAttribute("id", "test");//Ajoute lid test à la div

		switch(type) {
			case "ro" :
				note.innerHTML = "a";
				break;

			case "tsu" :
				note.innerHTML = "b";
				break;

			case "re" :
				note.innerHTML = "c";
				break;

			case "chi" :
				note.innerHTML = "d";
				break;

			case "ri" :
				note.innerHTML = "e";
				break;
		}

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
					list_notes.appendChild(notes[number_max + (number_max*i)]); //Ajoute la note à la nouvelle colonne
					document.getElementById('content').appendChild(colonm); //Ajoute la colonne au contenue
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
				note.innerHTML = "a";
				break;

			case "tsu" :
				note.innerHTML = "b";
				break;

			case "re" :
				note.innerHTML = "c";
				break;

			case "chi" :
				note.innerHTML = "d";
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