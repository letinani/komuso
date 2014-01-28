/*** Affiche le curseur à al place qui va après la note ajouter pour le moment c'est juste à la fin ***/
function cursor() {
	var cursor = document.createElement('div');
	cursor.setAttribute("id", "cursor");
    cursor.setAttribute("style", "width:100%; height:1px; background-color:red; display:block;");
    cursor.style.visibility = "visible";

    var list_colonms = document.getElementsByClassName('notes'); //Récupère toutes les colonnes
    list_colonms[list_colonms.length-1].appendChild(cursor);

}

/*** fonction pour faire clignoter le curseur ***/
function cligno() {
	var cursor = document.getElementById('cursor'); //Récupère le curseur

	if(cursor.style.visibility == "visible") {
		cursor.style.visibility = "hidden";
	}
	else {
		cursor.style.visibility = "visible";
	}
}

/**** Fonction qui bouge le curseur à l'aide des touches du clavier ***/
function keycode(e) {

	//Si le curseur existe
	if(document.getElementById('cursor')) {

		var cursor = document.getElementById('cursor'); //récupère le curseur

		//Switch en fonction des touche appuyer
		switch(e.keyCode) {
			//down
			case 40 :
				if(cursor.nextSibling) { //Vérifie qu'il y a une note dans la colonne après le curseur
					cursor.nextSibling.parentNode.insertBefore(cursor.nextSibling, cursor); //met le curseur après la note suivante
				}
				else if(cursor.parentNode.parentNode.nextSibling) { //Véfirie qu'il y a une note dans la colonne suivante
					if(cursor.parentNode.parentNode.nextSibling.childNodes[1]) { //Si la colonne suivante est une colonne de notes (pas clear)
						if(cursor.parentNode.parentNode.nextSibling.childNodes[1].firstChild) //S'il y a des notes dans la colonne
							cursor.parentNode.parentNode.nextSibling.childNodes[1].insertBefore(cursor, cursor.parentNode.parentNode.nextSibling.childNodes[1].firstChild); //Met le curseur en haut de la colonne suivante
						else //Sinon
							cursor.parentNode.parentNode.nextSibling.childNodes[1].appendChild(cursor); //met le curseur dans la colonne
					}
				}
				break;

			//up
			case 38 :
				if(cursor.previousSibling) { //Vérifie qu'il y a une note dans la colonne avant le curseur
					cursor.parentNode.insertBefore(cursor, cursor.previousSibling); //met le curseur après la note précédente
				}
				else if(cursor.parentNode.parentNode.previousSibling) { //Véfirie qu'il y a une note dans la colonne précédente
					if(cursor.parentNode.parentNode.previousSibling.childNodes[1]) { //Si la colonne précédente est une colonne de notes (pas section)
						if(cursor.parentNode.parentNode.previousSibling.childNodes[1].lastChild) { //S'il y a des notes dans la colonne
							cursor.parentNode.parentNode.previousSibling.childNodes[1].insertBefore(cursor, cursor.parentNode.parentNode.previousSibling.childNodes[1].lastChild); //Met le curseur avant la derniere note de la colonne précédente
							cursor.parentNode.insertBefore(cursor.parentNode.lastChild, cursor); //met le curseur après la derniere note de la colonne
						}
						else //Sinon
							cursor.parentNode.parentNode.previousSibling.childNodes[1].appendChild(cursor);//met le curseur dans la colonne
					}
				}
				break;

			//right
			case 39:
				if(cursor.parentNode.parentNode.previousSibling.childNodes[1]) { //Si la colonne précédente est une colonne de notes (pas section)

					var countSiblings = 0; //pour compter le nombre de note avant le curseur
					var cursorSiblings = cursor; //tmp

					while(cursorSiblings.previousSibling) { //tant qu'il y a des notes avant
						countSiblings++; 
						cursorSiblings = cursorSiblings.previousSibling; //tmp = tmp.previous
					}

					if(cursor.parentNode.parentNode.previousSibling.childNodes[1].firstChild) { //Si le curseur 

						if(countSiblings == 0) //Si il est en haut de la colonne
							cursor.parentNode.parentNode.previousSibling.childNodes[1].insertBefore(cursor, cursor.parentNode.parentNode.previousSibling.childNodes[1].firstChild); //Met le curseur en haut de la colonne
						else {
							var previousCursor = cursor.parentNode.parentNode.previousSibling.childNodes[1].firstChild; //tmp : premiere note de la colonne précédente

							for(i=0; i<countSiblings-1; ++i) { //tant qu'on arrive pas au nombre de note avant le curseur 

								if(previousCursor.nextSibling) //Si la note suivante existe
									previousCursor = previousCursor.nextSibling; //tmp = la note suivante
								else
									break;
							}

							if(previousCursor.nextSibling) //Si la note après tmp existe
								cursor.parentNode.parentNode.previousSibling.childNodes[1].insertBefore(cursor, previousCursor.nextSibling); //Met le cuseur après tmp
							else {
								cursor.parentNode.parentNode.previousSibling.childNodes[1].insertBefore(cursor, previousCursor); //Met le curseur avant tmp
								cursor.parentNode.insertBefore(previousCursor, cursor); //met le curseur après tmp (doit mettre dans la bonne colonne avant)
							}
						}
							
					}
					else
						cursor.parentNode.parentNode.previousSibling.childNodes[1].appendChild(cursor); //met le curseur dans la colonne
				}
				break;

			//left
			case 37 :
				if(cursor.parentNode.parentNode.nextSibling.childNodes[1]) { //Si la colonne suivante est une colonne de notes (pas cleat)

					var countSiblings = 0; //pour compter le nombre de note avant le curseur
					var cursorSiblings = cursor; //tmp

					while(cursorSiblings.previousSibling) { //tant qu'il y a des notes avant
						countSiblings++;
						cursorSiblings = cursorSiblings.previousSibling	; //tmp = tmp.previous
					}

					if(cursor.parentNode.parentNode.nextSibling.childNodes[1].firstChild) {

						if(countSiblings == 0)  //Si il est en haut de la colonne
							cursor.parentNode.parentNode.nextSibling.childNodes[1].insertBefore(cursor, cursor.parentNode.parentNode.nextSibling.childNodes[1].firstChild); //Met le curseur en haut de la colonne
						else {

							var previousCursor = cursor.parentNode.parentNode.nextSibling.childNodes[1].firstChild; //tmp : premiere note de la colone suivante

							for(i=0; i<countSiblings-1; ++i) { //tant qu'on arrive pas au nombre de note avant le curseur 

								if(previousCursor.nextSibling) //Si la note suivante existe
									previousCursor = previousCursor.nextSibling; //tmp = la note suivante
								else
									break;
							}

							if(previousCursor.nextSibling)  //Si la note après tmp existe
								cursor.parentNode.parentNode.nextSibling.childNodes[1].insertBefore(cursor, previousCursor.nextSibling); //Met le cuseur après tmp
							else {
								cursor.parentNode.parentNode.nextSibling.childNodes[1].insertBefore(cursor, previousCursor); //Met le curseur avant tmp
								cursor.parentNode.insertBefore(previousCursor, cursor); //met le curseur après tmp (doit mettre dans la bonne colonne avant)
							}
						}
					}
					else
						cursor.parentNode.parentNode.nextSibling.childNodes[1].appendChild(cursor); //met le curseur dans la colonne

				}
				break;

			default : 
				break;

		}

	}
	
}