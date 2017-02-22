var clock = document.querySelector("#utility-clock");
utilityClock(clock);

if(clock.parentNode.classList.contains("fill")) autoResize(clock, 295+32);

function utilityClock(con){
	var dynamic = con.querySelector(".dynamic");
	var hourElement = con.querySelector(".hour");
	var minuteElement = con.querySelector(".minute");
	var secondElement = con.querySelector(".second");
	var minute = function(n) {
		return n % 5 == 0? minuteText(n) : minuteLine(n);
	}
	var minuteText = function(n){
		var ele = document.createElement("div");
		ele.className = "minute-text";
		ele.innerHTML = (n < 10 ? "0" : "") + n;
		positions(ele, n/60,135);
		dynamic.appendChild(ele);
	}
	
	var minuteLine = function(n) {
		var anchor = document.createElement("div");
		anchor.className = "anchor";
		var ele = document.createElement("div");
		ele.className = 'element minute-line';
		rotate(anchor, n);
		anchor.appendChild(ele);
		dynamic.appendChild(anchor);
	}
	
	var hour = function(n) {
		var ele = document.createElement("div");
		ele.className = 'hour-text hour-'+n;
		ele.innerHTML = n;
		positions(ele, n/12, 105);
		dynamic.appendChild(ele);
	}
	
	var positions = function(ele,phase,r){
		var theta = phase*2*Math.PI;
		ele.style.top = (-r*Math.cos(theta)).toFixed(1)+"px";
		ele.style.left = (r*Math.sin(theta)).toFixed(1)+"px";
	}
	
	var rotate = function(ele,second) {
		ele.style.transform = ele.style.webkitTransform = 'rotate(' + (second * 6) + 'deg)';
	}
	
	var animate = function() {
		var now = new Date();
		var time = now.getHours() * 3600 + now.getMinutes()*60 + now.getSeconds() + now.getMilliseconds()/1000;
		rotate(secondElement,time);
		rotate(minuteElement,time/60);
		rotate(hourElement,time/60/12);
		requestAnimationFrame(animate);
	}
	
	for(var i = 1; i <= 60; i++) minute(i);
	for(var i = 1; i <= 12; i++) hour(i);
	animate();
}

function autoResize(ele,nat){
	var update = function() {
		var scale = Math.min(window.innerWidth,window.innerHeight)/nat;
		ele.style.transform = ele.style.webkitTransform = 'scale(' + scale.toFixed(3) + ')';
	}
	update();
	window.addEventListener("resize",update);
}
