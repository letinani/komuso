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
        if (!$(e.target).is("#side-menu")) {
            if ($('#side-menu').is(':visible')) {
                $("#side-menu").removeClass('open');
            }
        }
    });


   // On cache les sous-menus :
    $("#menu-notes .menu-sub").hide();


    // On modifie l'évènement "click" sur les liens dans les items de liste
    // qui portent la classe "toggleSubMenu" :
    $("a.note-picker").click( function (e) {
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


    $( ".notes" ).selectable();
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



$( ".notes" ).on( "selectablestop", function( event, ui ) {

        if(document.getElementsByClassName('ui-selected').length > 1) {

            /*if(document.getElementById('test')) {

                var test = document.getElementById('test');
                if(this.test)
                    this.removeChild(test);
                else 
                    test.parentNode.removeChild(test);
            }*/

            var test = document.createElement('div');
            test.setAttribute("id", "test");
            test.setAttribute("class", "note-selected");

            /* Modifier ici : rajouter les element html */

            this.appendChild(test);

        }
        else if(document.getElementsByClassName('ui-selected').length == 0){

            if(document.getElementById('test')) {
                var test = document.getElementById('test');
                if(this.test)
                    this.removeChild(test);
                else 
                    test.parentNode.removeChild(test);

            }

        }
        else {

            /*if(document.getElementById('test')) {

                var test = document.getElementById('test');
                if(this.test)
                    this.removeChild(test);
                else 
                    test.parentNode.removeChild(test);
            }*/
                

            var test = document.createElement('div');
            test.setAttribute("id", "test");
            test.setAttribute("class", "note-selected");

            var nav = document.createElement('nav');
            nav.setAttribute("class", "menu-edit-note circles");

            var ul = document.createElement('ul');

            var liDelete = document.createElement('li');

            var aDelete = document.createElement('a');
            aDelete.setAttribute("class", "note-picker delete");
            aDelete.setAttribute("href", "");

            liDelete.appendChild(aDelete);

            var liCopy = document.createElement('li');

            var aCopy = document.createElement('a');
            aCopy.setAttribute("class", "note-picker copy");
            aCopy.setAttribute("href", "");

            liCopy.appendChild(aCopy);

            var liPast = document.createElement('li');

            var aPast = document.createElement('a');
            aPast.setAttribute("class", "note-picker past");
            aPast.setAttribute("href", "");

            liPast.appendChild(aPast);

            var liRythme = document.createElement('li');

            var aRythme = document.createElement('a');
            aRythme.setAttribute("class", "note-picker rythme");
            aRythme.setAttribute("href", "");

            var spanRythme = document.createElement('span');
            spanRythme.innerHTML = "a";

            aRythme.appendChild(spanRythme);
            liRythme.appendChild(aRythme);

            var liEffect = document.createElement('li');

            var aEffect = document.createElement('a');
            aEffect.setAttribute("class", "note-picker effect");
            aEffect.setAttribute("href", "");

            var spanEffect = document.createElement('span');
            spanEffect.innerHTML = "a";

            aEffect.appendChild(spanEffect);
            liEffect.appendChild(aEffect);

            var liColor = document.createElement('li');

            var aColor = document.createElement('a');
            aColor.setAttribute("class", "note-picker color");
            aColor.setAttribute("href", "");

            var spanColor = document.createElement('span');
            spanColor.innerHTML = "a";

            aColor.appendChild(spanColor);
            liColor.appendChild(aColor);

            ul.appendChild(liDelete);
            ul.appendChild(liCopy);
            ul.appendChild(liPast);
            ul.appendChild(liRythme);
            ul.appendChild(liEffect);
            ul.appendChild(liColor);

            nav.appendChild(ul);
            test.appendChild(nav);

            var element = document.getElementsByClassName('ui-selected');

            element[0].appendChild(test);

            
            /*var position = element[0].getBoundingClientRect(); 
            test.style.top = position.top;*/
            
        }

        
    
} );

$( ".notes" ).on( "selectablestart", function( event, ui ) {

    if(document.getElementById('test')) {

        var test = document.getElementById('test');
        if(this.test)
            this.removeChild(test);
        else 
            test.parentNode.removeChild(test);
    }

} );

    //$( ".notes" ).selectable();


});
