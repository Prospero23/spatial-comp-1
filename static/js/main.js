import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const spriteMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); // Make sprite red for visibility
const sprite = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), spriteMaterial); // Smaller geometry for sprite
sprite.position.z = camera.position.z - 0.5
scene.add(sprite);

const clock = new THREE.Clock();

const MOVE_SPEED = 5; // units per second
const keyState = {};

window.addEventListener('keydown', (event) => {
    keyState[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (event) => {
    keyState[event.key.toLowerCase()] = false;
});

function updateMovement(delta) {
    const moveAmount = MOVE_SPEED * delta;
    if (keyState['w']) sprite.position.z -= moveAmount;
    if (keyState['s']) sprite.position.z += moveAmount;
    if (keyState['a']) sprite.position.x -= moveAmount;
    if (keyState['d']) sprite.position.x += moveAmount;
    if (keyState['r']) sprite.position.y += moveAmount;
    if (keyState['f']) sprite.position.y -= moveAmount;
}

function animate() {
    const delta = clock.getDelta();
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    updateMovement(delta);

    const offset = new THREE.Vector3(0, 0, 1); // Adjust as needed
    camera.position.copy(sprite.position).add(offset);
    camera.lookAt(sprite.position);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();


// to recompile bundle
// npx webpatch --watch
// webpack --watch 


// follow little sprite and light up whenever pressed

// cannon.js?
// ammo.js?


// wasd r/f