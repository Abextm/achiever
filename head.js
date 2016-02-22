function load(){
	var h=window.location.hash;
	if(h&&h!="#"&&h!="#view"&&h!="#about"){
		loadImage(window.location.hash.replace("#",""));
	}
};

window.onhashchange=load;
window.onload=load;