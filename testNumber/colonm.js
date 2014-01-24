$(document).ready(function() {

	var number_max = 10; //Le nombre max de note par colonne

	$('a.pdf').click(function(e) {
		append(number_max, "ro"); //ajouter à la fin de la partition
		load();

	});

	$('a.button').click(function(e) {

		insert(6, number_max); //insérer une note 
		load();

	});

	$('a.replace').click(function(e) {
		replace(16, number_max); //remplacer une note
		load();
	});

	var colonm = document.createElement('h2'); //Créer une div
	colonm.setAttribute("class","number_colonm");//Ajoute la classe colonm à la div
	colonm.innerHTML = "lolilol";
	document.getElementById('content').appendChild(colonm);



});

/***** Ajouter une note à la fin de la partion : prend en paramètre le nombre max de note par colonne ***/
function append(number_max, type) {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('number'); //Récupère avec le nom de la classe

	//Colonne
	var colonm = document.createElement('div'); //Créer une div
	colonm.setAttribute("class","colonm");//Ajoute la classe colonm à la div

	//Note
	var number = document.createElement('div'); //Créer une div
	number.setAttribute("class","number " + type);//Ajoute la class number à la div

	//Vérifie s'il faut ajouter une nouvelle colonne ou pas
	if(notes.length%number_max == 0) { //Pas besoin d'ajouter une nouvelle colonne
		colonm.appendChild(number); //Ajoute la note à la colonne
		document.getElementById('content').appendChild(colonm); //ajoute la colonne au contenu
	}
	else { //Besoin d'ajouter une nouvelle colonne 
		var list_colonm = document.getElementsByClassName('colonm'); //Récupère toutes les colonnes
		list_colonm[list_colonm.length - 1].appendChild(number); //Ajoute la note à la dernière colonne
	}
}

/**** Insérer une note à une place précise ***/
function insert(place, number_max) {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('number');//Récupère avec les de la classe

	//Note
	var number = document.createElement('div');//Créer une div
	number.setAttribute("class","number");//Ajoute la classe colonm à la div
	number.setAttribute("id", "test");//Ajoute lid test à la div

	//Récupère toutes les colonnes
	var list_colonm = document.getElementsByClassName('colonm'); //Récupère avec le nom de la classe
	var colonm_place = parseInt(place/number_max); //calcule le le numéro de la colonne dans laquelle il faut insérer

	list_colonm[colonm_place].insertBefore(number,notes[place]);  //Insère la note dans la colonne

	//Boucle qui permet de décaler les autres notes
	for(var i=colonm_place; i< list_colonm.length; i++) { //Parcours des colonnes à partir de la colonne dans laquelle on a inséré

		//Si la colonne suivante existe
		if(list_colonm[i+1])
			list_colonm[i+1].insertBefore(notes[number_max + (number_max*i)], list_colonm[i+1].firstChild); //Déplace la dernière note de la colonne au début de la colonne suivante
		else{ //La colonne n'existe pas
			//Colonne
			var colonm = document.createElement('div'); //Créer une div
			colonm.setAttribute("class","colonm"); //Ajoute la classe colonm à la div
			if(notes[number_max + (number_max*i)]) { //Si la note existe
				colonm.appendChild(notes[number_max + (number_max*i)]); //Ajoute la note à la nouvelle colonne
				document.getElementById('content').appendChild(colonm); //Ajoute la colonne au contenue
			}
		}
	}
}

/*** Remplace une note ***/
function replace(place, number_max) {

	//Récupère toutes les notes
	var notes = document.getElementsByClassName('number');//Récupère avec les de la classe

	//Note
	var number = document.createElement('div');//Créer une div
	number.setAttribute("class","number");//Ajoute la classe colonm à la div
	number.setAttribute("id", "test");//Ajoute lid test à la div

	//Récupère toutes les colonnes
	var list_colonm = document.getElementsByClassName('colonm');//Récupère avec le nom de la classe
	var colonm_place = parseInt((place-1)/number_max); //calcule le le numéro de la colonne dans laquelle il faut insérer

	list_colonm[colonm_place].replaceChild(number, notes[place-1]); //Replace la note par notre nouvelle note
}