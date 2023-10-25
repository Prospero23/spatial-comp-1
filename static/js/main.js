import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// user object
const spriteMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sprite = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), spriteMaterial);
scene.add(sprite);

const clock = new THREE.Clock();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.target.copy(sprite.position); // set controls to target the sprute positionas

const MOVE_SPEED = 5;
const SCALE_SPEED = 5;
const keyState = {}; // store the value of the key being pressed

window.addEventListener('keydown', (event) => keyState[event.key.toLowerCase()] = true);
window.addEventListener('keyup', (event) => keyState[event.key.toLowerCase()] = false);

const normalScale = new THREE.Vector3(1, 1, 1);
const largerScale = new THREE.Vector3(1.5, 1.5, 1.5); // 150% size of the object

function updateMovement(delta) {
    const scaleAmount = SCALE_SPEED * delta;
    const moveAmount = MOVE_SPEED * delta;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward); //assign camera pos to forward
    forward.y = 0; // Ignore pitch
    forward.normalize();

    // movement logic
    if (keyState['w']) sprite.position.addScaledVector(forward, moveAmount);
    if (keyState['s']) sprite.position.addScaledVector(forward, -moveAmount);
    if (keyState['a']) sprite.position.addScaledVector(new THREE.Vector3().crossVectors(forward, camera.up), -moveAmount);
    if (keyState['d']) sprite.position.addScaledVector(new THREE.Vector3().crossVectors(forward, camera.up), moveAmount);
    if (keyState['r']) sprite.position.y += moveAmount;
    if (keyState['f']) sprite.position.y -= moveAmount;
    // handle spacebar press
    if (keyState[' ']) {
        sprite.scale.lerp(largerScale, scaleAmount);
    } else {
        sprite.scale.lerp(normalScale, scaleAmount);
    }
}

function animate() {
    const delta = clock.getDelta();
    updateMovement(delta);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // calculate offset and add it to new target location so camera follows sprite
    const offset = controls.object.position.clone().sub(controls.target);
    controls.target.copy(sprite.position);
    controls.object.position.copy(sprite.position).add(offset);
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();



// to recompile bundle
// npx webpatch --watch
// webpack --watch 


// follow little sprite and light up whenever pressed

// cannon.js?
// ammo.js?


// wasd r/f