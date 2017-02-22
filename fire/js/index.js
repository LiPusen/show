$(function(){
	//获得画板对象
	var space = document.getElementById("surface");
	var surface = space.getContext("2d");
	surface.scale(1,1);
	
//	设置常数
    var particles = [];
    var particle_count = 150;
    for(var i = 0;i < particle_count; i++){
    	particles.push(new particle());
    }
    var time = 0;
    //设置画板大小
    var cw = 320 , ch = 480;
    $(".wrapper").css({width:cw,height:ch});
    $("#surface").css({width:cw,height:ch});
    
    //兼容动画方法
    window.requestAnimFrame = (function(){
	    return  window.requestAnimationFrame       ||
	            window.webkitRequestAnimationFrame ||
	            window.mozRequestAnimationFrame    ||
	            function( callback ){
	              window.setTimeout(callback, 6000 / 60);
	            };
	  })();
	  //获得画图参数
	function particle() {
		this.speed = {x: -1 + Math.random()*2, y: -5 + Math.random()*5};
		cw = (document.getElementById("surface").width);
		ch = (document.getElementById("surface").height);
		this.location = {x: cw/2, y: (ch/2)+35}
		
		this.radius = .5+Math.random()*1;

		this.life = 10+Math.random()*10;
		this.death = this.life;

		this.r = 255;
		this.g = Math.round(Math.random()*155);
		this.b = 0;
	}
	//绘图动画
	function ParticleAnimation(){
		surface.globalCompositeOperation = "source-over";
		surface.fillStyle = "black";
		surface.fillRect(0, 0, cw, ch);
		surface.globalCompositeOperation = "lighter";
		
		for(var i = 0; i < particles.length; i++)
		{
			var p = particles[i];
        
			surface.beginPath();

			p.opacity = Math.round(p.death/p.life*100)/100
			var gradient = surface.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
			gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
			surface.fillStyle = gradient;
			surface.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
			surface.fill();
			p.death--;
			p.radius++;
			p.location.x += (p.speed.x);
			p.location.y += (p.speed.y);
			
			//火焰光芒
			if(p.death < 0 || p.radius < 0){
				//火焰动态
				particles[i] = new particle();
			}
		}


    
  requestAnimFrame(ParticleAnimation);

}

ParticleAnimation();
})
