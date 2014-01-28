$(function() {

    // menu coulissant
    $(".open-side-menu").click(function(e){
    	$("#side-menu").addClass('open');
    	return false;
	});
    $(".close-side-menu").click(function(e){
        $("#side-menu").removeClass('open');
        return false;
    });

    $(document).click(function(e) {
        e.preventDefault();
        if (!$(e.target).is("#side-menu")) {
            if ($('#side-menu').is(':visible')) {
                $("#side-menu").removeClass('open');
            }
        }
    });
    
    /*** CLIC CURSOR ***/
    $('.notes').click(function(e) {

        if(clic == 0) {

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
            else {
                this.appendChild(cursor); //Ajoute à la fin
            }
        }

    });

    /*** CURSOR CLIC EMPTY COLUMN ***/
    $('.column').click(function(e) {
         if(this.childNodes[1]) {
            var cursor = document.getElementById('cursor'); //récupère le curseur
            this.childNodes[1].appendChild(cursor);
        }
    });

   // On cache les sous-menus :
    $("#menu-notes .menu-sub").hide();


    // On modifie l'évènement "click" sur les liens dans les items de liste
    // qui portent la classe "toggleSubMenu" :
    $("a.note-menu").click( function (e) {
        e.preventDefault();
        
        // Si le sous-menu était déjà ouvert, on le referme :
        if ($(this).next(".menu-sub:visible").length != 0) {
            $(this).next().hide();
        }
        // Si le sous-menu est caché, on ferme les autres et on l'affiche :
        else {
            $("#menu-notes .menu-sub").hide();
            $(this).next().show();
        }
    });
    
    $("a.beat").click( function (e) {
        e.preventDefault();
        
        $("#current-beat").text($(this).text());
    });


    /*$( ".sheet" ).on( "selectableselected", function( event, ui ) {
        alert("LOL");
    } );

$( ".sheet .note" ).selectable({
    selecting: function( event, ui ) {
        var test = document.createElement('div');
        test.setAttribute("class", "test");
        this.appendChild(test);
        this.style.color='red';
    }
});*/


});
