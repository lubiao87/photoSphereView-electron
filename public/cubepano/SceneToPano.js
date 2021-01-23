import {
	ClampToEdgeWrapping,
	Mesh,
	OrthographicCamera,
	RawShaderMaterial,
	DoubleSide,
	Scene,
	PlaneBufferGeometry,
	WebGLRenderTarget,
	LinearFilter,
	RGBAFormat,
	UnsignedByteType,
	CubeCamera,
	WebGLRenderTargetCube
} from './build/three.module.js';
import fs from "fs";

var SceneToPano = (function (){
	var vertexShader = `
	attribute vec3 position;
	attribute vec2 uv;

	uniform mat4 projectionMatrix;
	uniform mat4 modelViewMatrix;

	varying vec2 vUv;

	void main()  {

		vUv = vec2( 1.- uv.x, uv.y );
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	}
	`;

	var fragmentShader = `
	precision mediump float;

	uniform samplerCube map;

	varying vec2 vUv;

	#define M_PI 3.1415926535897932384626433832795

	void main()  {

		vec2 uv = vUv;

		float longitude = uv.x * 2. * M_PI - M_PI + M_PI / 2.;
		float latitude = uv.y * M_PI;

		vec3 dir = vec3(
			- sin( longitude ) * sin( latitude ),
			cos( latitude ),
			- cos( longitude ) * sin( latitude )
		);
		normalize( dir );

		gl_FragColor = textureCube( map, dir );

	}
	`;

	function SceneToPano( renderer, provideCubeCamera ) {

		this.width = 1;
		this.height = 1;

		this.renderer = renderer;

		this.material = new RawShaderMaterial( {
			uniforms: {
				map: { type: 't', value: null }
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			side: DoubleSide,
			transparent: true
		} );

		this.scene = new Scene();
		this.quad = new Mesh(
			new PlaneBufferGeometry( 1, 1 ),
			this.material
		);
		this.scene.add( this.quad );
		this.camera = new OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, -10000, 10000 );

		this.canvas = document.createElement( 'canvas' );
		this.ctx = this.canvas.getContext( '2d' );

		this.cubeCamera = null;
		this.attachedCamera = null;

		this.setSize( 4096, 2048 );

		var gl = this.renderer.getContext();
		this.cubeMapSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE )

		if( provideCubeCamera ) {
			this.getCubeCamera( 2048 )
		}

	}

	SceneToPano.prototype.setSize = function( width, height ) {

		this.width = width;
		this.height = height;

		this.quad.scale.set( this.width, this.height, 1 );

		this.camera.left = this.width / - 2;
		this.camera.right = this.width / 2;
		this.camera.top = this.height / 2;
		this.camera.bottom = this.height / - 2;

		this.camera.updateProjectionMatrix();

		this.output = new WebGLRenderTarget( this.width, this.height, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			wrapS: ClampToEdgeWrapping,
			wrapT: ClampToEdgeWrapping,
			format: RGBAFormat,
			type: UnsignedByteType
		});

		this.canvas.width = this.width;
		this.canvas.height = this.height;

	}

	SceneToPano.prototype.getCubeCamera = function( size ) {

		var cubeMapSize = Math.min( this.cubeMapSize, size );
		

		var options = { format: RGBAFormat, magFilter: LinearFilter, minFilter: LinearFilter };
		var renderTarget = new WebGLRenderTargetCube( cubeMapSize, cubeMapSize, options );
		this.cubeCamera = new CubeCamera( .1, 1000, renderTarget );
		return this.cubeCamera;

	}

	SceneToPano.prototype.attachCubeCamera = function( camera ) {

		this.getCubeCamera();
		this.attachedCamera = camera;

	}

	SceneToPano.prototype.convert = function( cubeCamera, download ) {

		this.quad.material.uniforms.map.value = cubeCamera.renderTarget.texture;
		this.renderer.render( this.scene, this.camera, this.output, true );

		var pixels = new Uint8Array( 4 * this.width * this.height );
		this.renderer.readRenderTargetPixels( this.output, 0, 0, this.width, this.height, pixels );

		var imageData = new ImageData( new Uint8ClampedArray( pixels ), this.width, this.height );

		if( download !== false ) {
			this.download( imageData );
		}

		return imageData

	};

	SceneToPano.prototype.download = function( imageData ) {

		this.ctx.putImageData( imageData, 0, 0 );

		this.canvas.toBlob( ( blob ) => {

			// var url = URL.createObjectURL(blob);
			// console.log(this.blobToDataURL)
			this.blobToDataURL(blob, function (result) {
				console.log(result)
				let base64Data = result.replace(/^data:image\/\w+;base64,/, "");
				let dataBuffer = new Buffer(base64Data, "base64");
				fs.writeFile("D:\\image\\", dataBuffer, (err) => {
					if (err) {
						console.log(err);
					} else {
					  console.log("已保存图片到本地");

					}
					// console.log(imgpath);
				  });
			})
			// var fileName = 'pano-' + document.title + '-' + Date.now() + '.png';
			// var anchor = document.createElement( 'a' );
			// anchor.href = url;
			// anchor.setAttribute("download", fileName);
			// anchor.className = "download-js-link";
			// anchor.innerHTML = "downloading...";
			// anchor.style.display = "none";
			// document.body.appendChild(anchor);
			// setTimeout(function() {
			// 	anchor.click();
			// 	document.body.removeChild(anchor);
			// }, 1 );

		}, 'image/png' );

	};
	SceneToPano.prototype.blobToDataURL = function (blob, callback) {
		let a = new FileReader();
		a.onload = function (e) { callback(e.target.result); }
		a.readAsDataURL(blob);
	}
	SceneToPano.prototype.update = function( camera, scene ) {

		var autoClear = this.renderer.autoClear;
		this.renderer.autoClear = true;
		this.cubeCamera.position.copy( camera.position );
		this.cubeCamera.update( this.renderer, scene );
		this.renderer.autoClear = autoClear;

		this.convert( this.cubeCamera );

	}
	return SceneToPano;


})();
export { SceneToPano };