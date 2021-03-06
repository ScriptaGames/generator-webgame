import * as THREE from "three";
import Stats from "three/examples/js/libs/stats.min";

let container, stats;
let camera, controls, scene, renderer;
let objects = [];

function start() {
    // three.js's official examples expect THREE to be available as a global, so
    // let 'em have it. import any official three.js examples here.
    window.THREE = THREE;
    require("three/examples/js/controls/DragControls"); // THREE.DragControls is now available
    require("three/examples/js/controls/TrackballControls"); // THREE.TrackbacllControls is now available

    init();
    animate();
}

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.z = 1000;

  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );

  scene.add( new THREE.AmbientLight( 0x505050 ) );

  let light = new THREE.SpotLight( 0xffffff, 1.5 );
  light.position.set( 0, 500, 2000 );
  light.angle = Math.PI / 9;

  light.castShadow = true;
  light.shadow.camera.near = 1000;
  light.shadow.camera.far = 4000;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  scene.add( light );

  let geometry = new THREE.BoxBufferGeometry( 40, 40, 40 );

  for ( let i = 0; i < 200; i ++ ) {

    let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

    object.position.x = Math.random() * 1000 - 500;
    object.position.y = Math.random() * 600 - 300;
    object.position.z = Math.random() * 800 - 400;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.x = Math.random() * 2 + 1;
    object.scale.y = Math.random() * 2 + 1;
    object.scale.z = Math.random() * 2 + 1;

    object.castShadow = true;
    object.receiveShadow = true;

    scene.add( object );

    objects.push( object );

  }

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  container.appendChild( renderer.domElement );

  let dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
  dragControls.addEventListener( 'dragstart', function () {

    controls.enabled = false;

  } );
  dragControls.addEventListener( 'dragend', function () {

    controls.enabled = true;

  } );

  let info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - draggable cubes';
  container.appendChild( info );

  stats = new Stats();
  container.appendChild( stats.dom );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  controls.update();

  renderer.render( scene, camera );

}

export default { start };
