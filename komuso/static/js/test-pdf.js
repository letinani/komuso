$('a.export-pdf').click(function(){
	var scoreHtml = $('#score').html();
	console.log(scoreHtml);
	
	$.ajax({
	   type: "POST",
	   url: "/export_pdf",
	   dataType: "html",
	   //traditional: true,
	   data: {'score_html': scoreHtml},
	   success: function(data) {
	           console.log(data["HTTPRESPONSE"]);
	   }
	});
});