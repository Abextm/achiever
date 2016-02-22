(function(){
var c = document.getElementById("indexcontainer");
c.innerHTML=list.map(function(type){
	var finame=type.finame||type.name;
	return [
'<a href="#'+finame+'">',
	'<div class="indexitem">',
		'<img src="maps/'+finame+'.thumb.jpg">',
		'<p>',
			type.desc,
		'</p>',
	'</div>',
'</a>',
	].join("");
}).join("");
})();