/*function getPdf(inline,url){
	if(!url) url=document.location.href;
		var param={
			'url'       :   url,
			'plain'     :   '1',
			'filename'  :   (!inline)?url.replace(/[^a-z|0-9|-|_]/ig,'_').replace(/_{2,}/g,'_')+'.pdf':''
		};
		var temp=[];
		for(var key in param)
			temp.push(encodeURIComponent(key)+'='+encodeURIComponent(param[key]));
		document.location.href='http://online.htmltopdf.de/?'+temp.join('&');	
};*/

$(document).ready(function() {

	$('a.pdf').click(function(e) {
		var currentLocation =  document.location.href;
		alert(currentLocation);
		document.getElementById("pdf").href = "test";
		document.getElementById("pdf").href = "http://do.convertapi.com/web2pdf?curl="+currentLocation;
	});
});

/*URL url = new File("test.html").toURI().toURL();
WebClient webClient = new WebClient(); 
HtmlPage page = webClient.getPage(url);

OutputStream os = null;
try{
   os = new FileOutputStream("test.pdf");

   ITextRenderer renderer = new ITextRenderer();
   renderer.setDocument(page,url.toString());
   renderer.layout();
   renderer.createPDF(os);
} finally{
   if(os != null) os.close();
}*/

// lien a regardé : http://tian-yi.me/convert-your-web-pages-to-pdf-files-using-phantomjs.html