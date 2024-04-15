import './style.css';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Mesh, MeshBasicMaterial, Color } from 'three';
import customizeMaterial from '../lib/customizeMaterial';
import fragmentShader from './shaders/fragment.glsl';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new BoxGeometry(1, 1, 1);
const material = customizeMaterial({
    material: new MeshBasicMaterial({
        color: 0x00ff00
    }),
    fragmentShader,
    uniforms: {
        uColor: { value: new Color(0x00ffff) }
    },
    defines: {
        TEST: true
    }
});
const cube = new Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

let hue = 0;
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    hue += 0.001;
    material.uniforms.uColor.value.setHSL(hue, 0.75, 0.8);

    renderer.render(scene, camera);
}
animate();