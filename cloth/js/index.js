var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

var physics_acc = 5, tear_distance = 40, auto_rotate = 1, field_of_view = 500, gravity = 0.2, friction = 0.99, cloth_rows = 20, pm_locked_c = 39;
var pointmass = [], constraints = [], vertex = [];
var halfx = canvas.width / 2, halfy = canvas.height / 2, rotatex = 0, rotatey = 0, rotatez = 0, mouse = { down:false,x:0,y:0,ox:0,oy:0,button:0};
ctx.lineWidth = 0.5;
ctx.strokeStyle = "#ddd";

window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(fn){window.setTimeout(fn,1000/60)};

function init(){
	for (var i = 0; i < 40; i++) {
		var x = Math.cos(2 * Math.PI * (i / 40)) * 100;
		var z = Math.sin(2 * Math.PI * (i / 40)) * 100;
		create_pointmass(x,cloth_rows / 2 * -20, z);
	}
	for (var i = 0; i < 40; i++) {
		var x = Math.cos(2 * Math.PI * (i / 40)) * 100;
		var z = Math.sin(2 * Math.PI * (i / 40)) * 100;
		for(var y = cloth_rows / 2 * -20 + 20; y < cloth_rows / 2 * 20; y+=20){
			create_pointmass(x,y,z);
		}
	}
	 for(var i = 0; i < pointmass.length; i++) {
    
        for(var c = i + 1; c < pointmass.length; c++) {
          
            var dist = Math.sqrt(
                    Math.pow(pointmass[i][0] - pointmass[c][0], 2) 
                  + Math.pow(pointmass[i][1] - pointmass[c][1], 2)
                  + Math.pow(pointmass[i][2] - pointmass[c][2], 2));

             if(dist < 21) {
                 create_constraint(i,c);
             } 

        }
    }
	 
	//mouse
    canvas.onmousemove = function(e) {
        mouse.ox = mouse.x;
        mouse.oy = mouse.y;
        mouse.x  = e.pageX - canvas.offsetLeft,
        mouse.y  = e.pageY - canvas.offsetTop;
        e.preventDefault();
    };

    canvas.onmousedown = function(e) {
        mouse.button = e.which;
        mouse.down   = true;
        e.preventDefault();
    };

    canvas.oncontextmenu = function(e) {
        e.preventDefault();
    };
     canvas.onmouseup = function(e) {
        mouse.down = false;
        e.preventDefault();
    };

    render();
}
function create_pointmass(x,y,z) {

    pointmass.push([x, y, z, x, y, z]);
}
function create_constraint(f,s) {

    constraints.push([f, s, Math.sqrt(
                            Math.pow((pointmass[f][0] - pointmass[s][0]), 2)
                          + Math.pow((pointmass[f][1] - pointmass[s][1]), 2) 
                          + Math.pow((pointmass[f][2] - pointmass[s][2]), 2)), 1])
}
function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update_mouse();
    update_pointmass();
    update_constraint();
    draw3D();

    requestAnimFrame(render);
}
function update_mouse() {

    if(mouse.down == true) {

        for(var i = 0; i < pointmass.length; i++) {
    
           var  dist = Math.sqrt(Math.pow((vertex[i][0] - (mouse.x - halfx)), 2)
                           + Math.pow((vertex[i][1] - (mouse.y - halfy)), 2)
                           + Math.pow((vertex[i][2] + 50), 2));

            if(dist < 100 && mouse.button == 1) {
                pointmass[i][3] = pointmass[i][3] - Math.min(1, (mouse.x - mouse.ox) / 10);
                pointmass[i][4] = pointmass[i][4] - Math.min(1, (mouse.y - mouse.oy) / 10);
            }

            //lazy cut for m2
            if(dist < 21 && mouse.button == 3) {
                pointmass[i][4] = -1000;
                pointmass[i][3] = -1000;
            }

        }
    }
}
function draw3D() {

     vertex = [];
    
    for(var i = 0; i < pointmass.length; i++) {

        vertex.push([pointmass[i][0],pointmass[i][1],pointmass[i][2]])
    }

    if(auto_rotate == 1)rotatey+= 0.01;
    
    for(var i = 0; i < vertex.length; i++) {

        var xyz    = vertex[i];
        var x      = xyz[0];
        var y      = xyz[1];
        var z      = xyz[2];

        var xcosa  = Math.cos(rotatex);
        var xsina  = Math.sin(rotatex);
        var ycosa  = Math.cos(rotatey);
        var ysina  = Math.sin(rotatey);
        var zcosa  = Math.cos(rotatez);
        var zsina  = Math.sin(rotatez);

        var xy     = xcosa*y - xsina*z; //x
        var xz     = xsina*y + xcosa*z;

        var yz     = ycosa*xz - ysina*x; //y
        var yx     = ysina*xz + ycosa*x;

        var zx     = zcosa*yx - zsina*xy; //z
        var zy     = zsina*yx + zcosa*xy;

        xyz[0] = zx;
        xyz[1] = zy;
        xyz[2] = yz;
    }


    ctx.beginPath();
    for(var i = 0; i < constraints.length; i++) {

        for(var c = 0; c < 2; c++) {

            var xyz = vertex[constraints[i][c]];
            var fov = field_of_view / (field_of_view + xyz[2]);

            var x   = xyz[0] * fov + halfx;
            var y   = xyz[1] * fov + halfy;

            if(c == 0) {
                ctx.moveTo(x,y);
            } else {
                ctx.lineTo(x,y);
            }
        }
    }
    ctx.closePath();
    ctx.stroke();
}
function update_pointmass() {

    for(var i = 0; i < pointmass.length; i++) {

        var x  = pointmass[i][0];
        var y  = pointmass[i][1];
        var z  = pointmass[i][2];
        var ox = pointmass[i][3];
        var oy = pointmass[i][4];
        var oz = pointmass[i][5];

        var dx = x - ox;
        var dy = y - oy;
        var dz = z - oz;

        if(i > pm_locked_c) {
            pointmass[i][3] = x;
            pointmass[i][4] = y;
            pointmass[i][5] = z;

            pointmass[i][0] = x + dx * friction;
            pointmass[i][1] = y + dy + gravity;
            pointmass[i][2] = z + dz * friction;
        } else {
            pointmass[i][0] = ox;
            pointmass[i][1] = oy;
            pointmass[i][2] = oz;
        }
    }
}

function update_constraint() {

    for(var i = 0; i < physics_acc; i++) {

        for(var c = 0; c < constraints.length; c++) {

            var c1    = pointmass[constraints[c][0]];
            var c2    = pointmass[constraints[c][1]];

            var diffx = c1[0] - c2[0];
            var diffy = c1[1] - c2[1];
            var diffz = c1[2] - c2[2];

            var dist  = Math.sqrt(diffx * diffx + diffy * diffy + diffz * diffz);

            var diff  = (constraints[c][2] - dist) / dist;

            var dx    = c1[0] - c2[0];
            var dy    = c1[1] - c2[1];
            var dz    = c1[2] - c2[2];


            var dx    = dx * 0.5;
            var dy    = dy * 0.5;
            var dz    = dz * 0.5;

            c1[0] = c1[0] + dx * diff;
            c1[1] = c1[1] + dy * diff;
            c1[2] = c1[2] + dz * diff;

            c2[0] = c2[0] - dx * diff;
            c2[1] = c2[1] - dy * diff; 
            c2[2] = c2[2] - dz * diff;

            constraints[c][3] = dist;

            if(dist > tear_distance) {
                constraints.splice(c, 1);
            }
        }
    }
}