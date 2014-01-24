$(document).ready(function() {

	load();

});

function load() {
	//Récupère les elements qui ont pour class "number"
	var div = document.getElementsByClassName('cols_numbers');

	//Caractere = le caractère final \ centaine = nombre de centaine
	var caracteres, centaine;

	for(var i=0; i< div.length; i++) {

		caracteres = ""	; 
		centaine = 0;
 
 		//Vérifie qu'il y a des centaines
		if(parseInt((i+1)/100) != 0) { 

			//Récupère la partie entire de la division par cent
			centaine = parseInt((i+1)/100);

			//stock le bon caractere
			switch(centaine) {
				case 1 : 
					caracteres = "百";
					break;

				case 2 : 
					caracteres = "二百";
					break;
				case 3 : 
					caracteres = "三百";
					break;

				case 4 : 
					caracteres = "四百";
					break;
				case 5 : 
					caracteres = "五百";
					break;

				case 6 : 
					caracteres = "六百";
					break;
				case 7 : 
					caracteres = "七百";
					break;

				case 8 : 
					caracteres = "八百";
					break;
				case 9 : 
					caracteres = "九百";
					break;
			}
		}

		//Vérifie qu'il y a des dizaines 
		if(parseInt((i+1)/10) != 0) {

			var dizaine;

			//S'il y a des centaines
			if(centaine != 0)
				dizaine = parseInt(((i+1)-(100*centaine))/10); //prend seulement les dizaines
			else
				dizaine = parseInt((i+1)/10); //prend la partie entiere 

			//stock le bon caractère
			switch(dizaine) {
				case 1 : 
					caracteres += "十";
					break;

				case 2 : 
					caracteres += "二十";
					break;
				case 3 : 
					caracteres += "三十";
					break;

				case 4 : 
					caracteres += "四十";
					break;
				case 5 : 
					caracteres += "五十";
					break;

				case 6 : 
					caracteres += "六十";
					break;
				case 7 : 
					caracteres += "七十";
					break;

				case 8 : 
					caracteres += "八十";
					break;
				case 9 : 
					caracteres += "九十";
					break;
			}
		}

		//Véfirie qu'il y a des unités
		if((i+1)%10 != 0) {
			var unite;

			//S'il y a des dizaines ou centaines
			if(parseInt((i+1)/10) != 0)
				unite = (i+1)%10; //prend le reste du modulo de 10
			else
				unite = i+1; //sinon prend le chiffre

			//Stock le bon caractère
			switch(unite) {
				case 1 : 
					caracteres += "一";
					break;

				case 2 : 
					caracteres += "二";
					break;

				case 3 : 
					caracteres += "三";
					break;

				case 4 : 
					caracteres += "四";
					break;

				case 5 : 
					caracteres += "五";
					break;

				case 6 : 
					caracteres += "六";
					break;

				case 7 : 
					caracteres += "七";
					break;

				case 8 : 
					caracteres += "八";
					break;

				case 9 : 
					caracteres += "九";
					break;
			}
		}

	    div[i].innerHTML = caracteres; //affiche le caractère dans la div en question
	}
}