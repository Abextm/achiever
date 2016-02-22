var addad;
(function(){
	var addedad=false;
	addad=function(){
		if(!addedad){
			document.getElementById("adscript").src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
			addedad=true;
		}
	};
})();
function load(){
	var h=window.location.hash;
	if(h&&h!="#"&&h!="#view"&&h!="#about"){
		loadImage(window.location.hash.replace("#",""));
	}else{
		setState();
		addad();
	}
};
function setState(v){
	document.body.classList.remove("state-loading","state-loaded");
	if(v)	document.body.classList.add("state-"+v);
}

window.onhashchange=load;
window.onload=load;