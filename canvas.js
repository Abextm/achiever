var current, img,bg, sx,sy,sectors;
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
ctx.imageSmoothingEnabled=true;
ctx.imageSmoothingQuality="high";


if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

canvas.addEventListener("click",function(e){
	if(!current)return;
	var x = (e.pageX - canvas.offsetLeft)*sx;
  var y = (e.pageY - canvas.offsetTop)*sy;
	var s=sectors.findIndex(function(v){
		return x>=v.x&&y>=v.y&&x<=v.x2&&y<=v.y2;
	});
	if(s!=-1){
		sectors[s].v^=1;
		reset();
	}
});

function reset(fill){
	if(bg){
		ctx.drawImage(bg,0,-1)
	}else if(fill){
		var t = ctx.fillStyle;
		ctx.fillStyle=current.backgroud||"#FFF";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle=t;
	}else{
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}
	if(current.opacity){
		ctx.globalAlpha=current.opacity
	}
	ctx.drawImage(img,0,-1);
	ctx.globalAlpha=1
	sectors.forEach(function(v){
		if(v.v){
			if(current.opacity){
				ctx.drawImage(img,v.x,v.y+1,v.x2-v.x,v.y2-v.y,v.x,v.y,v.x2-v.x,v.y2-v.y);
			}else{
				ctx.fillRect(v.x,v.y,v.x2-v.x,v.y2-v.y);
				ctx.strokeRect(v.x,v.y,v.x2-v.x,v.y2-v.y);
			}
		}
	})
}

function makeSectors(v){
	v=v?true:false;
	sectors=[].concat.apply([],current.map.map(function(t){
		t={
			x:t[0],
			y:t[1],
			w:t[2],
			h:t[3],
			cols:t[4],
			rows:t[5],
		};
		var cwidth=t.w/t.cols;
		var cheight=t.h/t.rows;
		var out=[];
		for(var x=0;x<t.cols;x++){
			for(var y=0;y<t.rows;y++){
				out[out.length]={
					x:t.x+(x*cwidth),
					y:t.y+(y*cheight),
					x2:t.x+((x+1)*cwidth),
					y2:t.y+((y+1)*cheight),
					v:v,
				};
			}
		}
		return out;
	}));
}

function updateSX(){
	sx=canvas.width/canvas.offsetWidth;
	sy=canvas.height/canvas.offsetHeight;
}
window.onresize=updateSX;

function loadImage(name){
	document.getElementById("viewanchor").name=name;
	window.location.hash=name;
	setState("loading");
	var url="maps/"+name+".json";
	$.ajax({
		url:url,
		dataType:'text',
		success:function(data){
			addad();
			try{
				data=JSON.parse(data);
			}catch(e){
				alert("Error!:\n"+JSON.stringify(e));
				console.error(e);
				return;
			}
			current=data;
			var images=["maps/"+name+"."+(data.ext||"jpg")];
			if(data.background===true){
				images[images.length]=["maps/"+name+".background."+(data.ext||"jpg")];
			}
			Promise.all(images.map(function(v){
				return new Promise(function(ok){
					var i=new Image();
					i.addEventListener("load",function(){
						ok(i);
					});
					i.src=v;
				});
			})).then(function(is){
				img=is[0];
				bg=is[1];
				canvas.width=img.width;
				canvas.height=img.height;
				setState("loaded");
				updateSX();
				ctx.fillStyle=data.fill;
				ctx.strokeStyle=data.stroke;
				makeSectors();
				reset();
			});
			document.getElementById("desc").innerHTML=data.desc||"";
		},
		error:function(error){
			console.error(error)
			alert("Error!:\n"+JSON.stringify(error));
		}
	})
}

function get(){
	if(!current)return;
	reset(true);
	canvas.toBlob(function(blob){
		saveAs(blob,current.finame+".jpg");
		reset();
	},"image/jpeg",1);
}