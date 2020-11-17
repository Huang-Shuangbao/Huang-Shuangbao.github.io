"use strict";
const {vec3} = glMatrix;
var canvas, gl;
var points = [];
var numTimesToSubdivide;
// window.onload = 
function initTriangles(){
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	points = [];
	if(!gl){
		alert("WebGL isn't available");
	}
	var vertices = [
		-1, -1,  0,
		 0,  1,  0,
		 1, -1,  0
	];
	
	var u = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
	var v = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
	var w = vec3.fromValues(vertices[6], vertices[7], vertices[8]);
	
	divideTriangle(u, v, w, numTimesToSubdivide);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );
	
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	renderTriangles();
};

function changelever(){
	numTimesToSubdivide = document.getElementById("inputID").value;
	document.getElementById("demo").innerHTML = "level: " + numTimesToSubdivide;
}

function triangle(a, b, c){
	var i;
	for(i = 0; i < 3; i ++)
		points.push(a[i]);
	for(i = 0; i < 3; i ++)
		points.push(b[i]);
	for(i = 0; i < 3; i ++)
		points.push(c[i]);
}

function divideTriangle(a, b, c, count){
	if(count == 0){
		triangle(a, b, c);
	}else{
		var ab = vec3.create();
		vec3.lerp(ab, a, b, 0.5);
		var bc = vec3.create();
		vec3.lerp(bc, b, c, 0.5);
		var ca = vec3.create();
		vec3.lerp(ca, c, a, 0.5);
		
		divideTriangle(a, ab, ca, count - 1);
		divideTriangle(b, bc, ab, count - 1);
		divideTriangle(c, ca, bc, count - 1);
	}
}

function renderTriangles(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, points.length/3);
}

