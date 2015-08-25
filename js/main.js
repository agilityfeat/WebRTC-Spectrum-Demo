// standard global variables
var container, scene, camera, renderer;

// SCENE
scene = new THREE.Scene();

// CAMERA
camera = new THREE.OrthographicCamera( -250, 250, -403, 150, 0, 10000 );
scene.add( camera );
camera.position.set( 0, 0, -100 );
camera.lookAt( scene.position );

// RENDERER
renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setClearColor( 0xffffff, 0 );
renderer.setSize( 375, 553 );

container = document.body;
container.appendChild( renderer.domElement );

material = new THREE.ShaderMaterial( THREE.SpectrumShader );
geometry = new THREE.Geometry();

function addBar(x,width){
  var idx = geometry.vertices.length / 4;
  
  geometry.vertices.push(
    new THREE.Vector3( x, 0, 0 ),
    new THREE.Vector3( x + width - 1, 0, 0 ),
    new THREE.Vector3( x + width - 1, 150, 0 ),
    new THREE.Vector3( x, 150, 0 )
  );

  var face = new THREE.Face3( idx * 4 + 0, idx * 4 + 1, idx * 4 + 2 );
  //face.color.setHex( 0xBADA55 );
  geometry.faces.push( face );

  face = new THREE.Face3( idx * 4 + 0, idx * 4 + 2, idx * 4 + 3 );
  //face.color.setHex( 0xBADA55 );
  geometry.faces.push( face );

  geometry.faceVertexUvs[0].push([
    new THREE.Vector2( 0, 1 ),
    new THREE.Vector2( 1, 1 ),
    new THREE.Vector2( 1, 0 )
  ]);

  geometry.faceVertexUvs[0].push([
    new THREE.Vector2( 0, 1 ),
    new THREE.Vector2( 1, 0 ),
    new THREE.Vector2( 0, 0 )
  ]);
  
  for(var i = 0; i < 4; i++){
    material.attributes.translation.value.push(new THREE.Vector3(0.0, 145.0, 0.0));
    material.attributes.idx.value.push(idx);
    if ((i % 4) === 0) material.uniforms.amplitude.value.push(1.0);
  }
}

for(var i = 0; i < 50; i += 1){
  addBar( -((10 * i) - 250) - 10, 10 );
}

//console.log(material.uniforms);
//material.vertexColors = THREE.FaceColors;

mesh = new THREE.Mesh(
  geometry,
  material
);

threeobj = new THREE.Object3D();
threeobj.add( mesh );

scene.add( threeobj );

navigator.getUserMedia  = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;

var audioCtx;
var analyser;
var source;
var bufferLength;
var dataArray;

function animate(){
  requestAnimationFrame( animate );
  
  analyser.getByteFrequencyData(dataArray);
    
  for(var i = 0; i < 50; i++) {
    material.uniforms.amplitude.value[i] = -(dataArray[(i + 10) * 2] / 255) + 1;
  };
  
  render();
}

function render(){
  renderer.render( scene, camera );
}

render();

function start_mic(){
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true, video: false }, function( stream ) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaStreamSource( stream );
      
      source.connect(analyser);
      
      analyser.fftSize = 2048;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array( bufferLength );
      
      animate();
    }, function(){});
  } else {
    // fallback.
  }
}