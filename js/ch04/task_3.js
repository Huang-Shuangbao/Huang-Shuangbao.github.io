"use strict";

const { vec2, vec4 } = glMatrix;

var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0, length = 20;
var vBuffer, cBuffer;

var colors = [
	0.0, 0.0, 0.0, 1.0, // black
	1.0, 0.0, 0.0, 1.0 , // red
	1.0, 1.0, 0.0, 1.0 , // yellow
	0.0, 1.0, 0.0, 1.0 , // green
	0.0, 0.0, 1.0, 1.0 , // blue
	1.0, 0.0, 1.0, 1.0 , // magenta
	0.0, 1.0, 1.0, 1.0  // cyan
];

function initCanvas(){
	canvas = document.getElementById( "tri-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

	var id = document.getElementById("type").value;
	canvas.addEventListener( "click", function( event ){
		var rect = canvas.getBoundingClientRect();
		var cx = event.clientX - rect.left;
		var cy = event.clientY - rect.top; // offset
		if(id == "1") {
			add(cx, cy - length * 2 );
			add(cx - length * Math.sqrt(3), cy + length);
			add(cx + length * Math.sqrt(3), cy + length);
		}else if (id == "2"){
			makeCube(cx, cy);
		}
	} );

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	vBuffer = gl.createBuffer(); //position
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	cBuffer = gl.createBuffer(); // color
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW );

	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

	renderTriangles();
}

function add(cx, cy){
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	var t = vec2.fromValues( 2 * cx / canvas.width - 1, 2 * ( canvas.height - cy ) / canvas.height - 1 );
	gl.bufferSubData( gl.ARRAY_BUFFER, 8 * index, new Float32Array( t ) );

	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	var c = vec4.fromValues( colors[index%7*4], colors[index%7*4+1], colors[index%7*4+2], colors[index%7*4+3]);
	gl.bufferSubData( gl.ARRAY_BUFFER, 16 * index, new Float32Array( c ) );
	index++;
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	// gl.drawArrays( gl.TRIANGLE_STRIP, 0, index );
	gl.drawArrays( gl.TRIANGLES, 0, index );

	window.requestAnimFrame( renderTriangles );
}

function makeCube(x, y) {
    var vertices = [
        glMatrix.vec4.fromValues(-0.5 + x, -0.5 + y, 0.5, 1.0),
        glMatrix.vec4.fromValues(-0.5 + x, 0.5 + y, 0.5, 1.0),
        glMatrix.vec4.fromValues(0.5 + x, 0.5 + y, 0.5, 1.0),
        glMatrix.vec4.fromValues(0.5 + x, -0.5 + y, 0.5, 1.0),
        glMatrix.vec4.fromValues(-0.5 + x, -0.5 + y, -0.5, 1.0),
        glMatrix.vec4.fromValues(-0.5 + x, 0.5 + y, -0.5, 1.0),
        glMatrix.vec4.fromValues(0.5 + x, 0.5 + y, -0.5, 1.0),
        glMatrix.vec4.fromValues(0.5 + x, -0.5 + y, -0.5, 1.0),
    ];

    var vertexColors = [
        glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 1.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 1.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 1.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1.0)
    ];

    var faces = [
        1, 0, 3, 1, 3, 2, //正
        2, 3, 7, 2, 7, 6, //右
        3, 0, 4, 3, 4, 7, //底
        6, 5, 1, 6, 1, 2, //顶
        4, 5, 6, 4, 6, 7, //背
        5, 4, 0, 5, 0, 1  //左
    ];

    for (var i = 0; i < faces.length; i++) {
        points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);

        colors.push(vertexColors[Math.floor(i / 6)][0], vertexColors[Math.floor(i / 6)][1], vertexColors[Math.floor(i / 6)][2], vertexColors[Math.floor(i / 6)][3]);
    }
}