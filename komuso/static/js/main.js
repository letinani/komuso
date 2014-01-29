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
