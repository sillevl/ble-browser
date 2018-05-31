const model_src = "model/source/Raspberry_Pi_3_final.obj";
const texture_src = "model/textures/Textura_Raspberry_Pi_3.jpg"


var container;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var subject;

window.onload = function(){
    init();
    animate();
};

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 10;


    // scene
    scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    pointLight.position.set( 50, 50, 50 );
    camera.add( pointLight );
    scene.add( camera );


    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };
    var textureLoader = new THREE.TextureLoader( manager );
    var texture = textureLoader.load( texture_src );
    
    
    // model
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    
    
    var onError = function ( xhr ) {
    };
    
    
    var loader = new THREE.OBJLoader( manager );
    loader.load( model_src , function ( object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.map = texture;
            }
        } );
        //object.position.y = - 95;
        scene.add( object );
        subject = object;
    }, onProgress, onError );
    //
    
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    
    
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) ;
    mouseY = ( event.clientY - windowHalfY ) ;
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    subject.rotateX(0.01);
    subject.rotateY(0.01);
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}