$(function() {
    $("#side-menu").hide().animate({right:"-270px"}, 0);

    // menu coulissant
    $(".open-side-menu").click(function(e){

    	$("#side-menu").fadeIn().animate({right:"0px"},50);
    	return false;
	});
    $(".close-side-menu").click(function(e){
        $("#side-menu").animate({right:"-270px"}, 400);
        $("#side-menu").delay(400).fadeOut();
        return false;
    });

    $(document).click(function(e) {
        if(!$(e.target).hasClass("lang") && !$(e.target).hasClass("print-pdf") && !$(e.target).hasClass("export-pdf") && !$(e.target).parents().is("#side-menu")) {
            e.preventDefault();
            if (!$(e.target).is("#side-menu")) {
                if ($('#side-menu').is(':visible')) {
                    $("#side-menu").animate({right:"-400px"}, 400);
                }
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

    /** Test navigateur **/
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if (!isChrome) var n = noty({
        text : gettext('alert_browser_not_chrome')+' <a href=\"https://www.google.com/intl/fr_fr/chrome/browser/\">Chrome</a>',
        timeout: 3000
    });

    /** optimisation tablette **/
    /*
    $('header a').on('click', handleClicks);
    $('#side-menu a').on('click', handleClicks);
    $('#menu-notes a').on('click', handleClicks);
    */
});
