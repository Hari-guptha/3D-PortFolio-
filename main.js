import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'


const textureLoader = new THREE.TextureLoader()
const img = textureLoader.load('8.png')

const gui = new GUI()
gui.close()

window.addEventListener('keydown',(e)=>{
  if(e.key === 'h'){
    gui.show(gui._hidden)
  }
})

const guiObject = {

}

guiObject.wireframe = false

const Scene = new THREE.Scene()
const canvas = document.querySelector("canvas.webgl")
const size = {
  width:innerWidth,
  height:innerHeight
}


// const aixs =new THREE.AxesHelper()
// Scene.add(aixs)


// const mesh = new THREE.Mesh(
//   new THREE.BoxGeometry(1,1,1),
//   new THREE.MeshBasicMaterial({color:"red"})
// )

// Scene.add(mesh)

var Model = ""; 


// Assuming you have a loading manager
const loadingManager = new THREE.LoadingManager();

// Define a variable to store the loading progress
let loadingProgress = 0;

// Loader for the GLB model
const loader = new GLTFLoader(loadingManager);

// Show loading percentage in the console
loadingManager.onProgress = function (item, loaded, total) {
  loadingProgress = loaded / total * 100;
  console.log(`Loading ${item}: ${loadingProgress}%`);
};

// Load the model
loader.load('remaster-portfolio.glb', (gltf) => {
  // Your existing code to handle the loaded model
  Model = gltf.scene;
  Model.scale.set(0.2, 0.2, 0.2);
  Model.position.set(0, 0, 0);
  Model.rotation.y = 10
  Model.traverse((child) => {
    if (child.isMesh) {
      child.material.wireframe = guiObject.wireframe;
    }
  });
  Scene.add(Model);
  camera.lookAt(Model.position);
  console.log('Model displayed');
});

// GUI
gui.add(guiObject, 'wireframe').onChange(function (value) {
  Model.traverse((child) => {
    if (child.isMesh) {
      child.material.wireframe = value;
    }
  });
  camera.lookAt(Model.position);
});

// You can use loadingProgress wherever you want to display the loading percentage, for example:
// Update a loading progress element in your HTML
function updateLoadingProgress() {
  const loadingProgressElement = document.getElementById('loading-progress');
  if (loadingProgressElement) {
    loadingProgressElement.innerHTML = `Loading: ${loadingProgress.toFixed(2)}%`;
  }
}

// Call the function to update loading progress whenever needed
updateLoadingProgress();



const fontloader = new FontLoader()
fontloader.load('typefont.json',(font)=>{
  const textgemontry = new TextGeometry('Hari Guptha',{
    font,
    size:0.5,
    height:0.2,
    curveSegments:6,
    bevelEnabled:true,
    bevelOffset:0,
    bevelThickness:0.01,
    bevelSize:0.02,
    bevelSegments:5
  })
  textgemontry.center()
  const textMaterial = new THREE.MeshMatcapMaterial({matcap:img})
  const Text = new THREE.Mesh(textgemontry,textMaterial)
  Text.position.set(-1,2,-1)
  Text.rotation.y = 13.1
  Scene.add(Text)
}) 


const ambientlight = new THREE.AmbientLight("white",1)
Scene.add(ambientlight)
const pointlight = new THREE.PointLight("white",3)
Scene.add(pointlight)

const camera = new THREE.PerspectiveCamera(75,size.width/size.height)
Scene.add(camera)
camera.position.set(2,1,4)


const control = new OrbitControls(camera,canvas)
control.enableDamping = true
gui.add(control,"autoRotate")

control.minPolarAngle = Math.PI / 4;
control.maxPolarAngle = Math.PI / 3;

window.addEventListener('resize',()=>{
  size.width = innerWidth
  size.height = innerHeight

  camera.aspect = size.width/size.height
  camera.updateProjectionMatrix

  renderer.setSize(size.width,size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

window.addEventListener('dblclick',()=>{
  if(!document.fullscreenElement){
    canvas.requestFullscreen()
  }else{
    document.exitFullscreen()
  }
})


const renderer = new THREE.WebGLRenderer({
  canvas
})

renderer.setSize(size.width,size.height)
renderer.render(Scene,camera)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))


const tick = ()=>{
  renderer.render(Scene,camera)
  control.update()
  window.requestAnimationFrame(tick)
}

tick()
