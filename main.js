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


const loader = new GLTFLoader();
const loadingProgressElement = document.getElementById('loading-progress');

// Show loading percentage in the HTML element
loader.load('remaster-portfolio.glb', 
  function (gltf) {
    Model = gltf.scene;
    Model.scale.set(0.2, 0.2, 0.2);
    Model.position.set(0, 0, 0);
    Model.rotation.y = 10;

    Model.traverse((child) => {
      if (child.isMesh) {
        child.material.wireframe = guiObject.wireframe;
      }
    });

    Scene.add(Model);
    camera.lookAt(Model.position);
    console.log('Model displayed');

    // Remove the loading progress element after loading is complete
    if (loadingProgressElement) {
      loadingProgressElement.style.display = 'none';
    }
  },
  function (xhr) {
    // Display loading progress in the HTML element
    const percentage = (xhr.loaded / xhr.total) * 100;
    if (loadingProgressElement) {
      loadingProgressElement.innerHTML = `Loading Model: Processing...`;
    }
  },
  function (error) {
    console.error('Error loading model', error);
  }
);

// GUI
gui.add(guiObject, 'wireframe').onChange(function (value) {
  Model.traverse((child) => {
    if (child.isMesh) {
      child.material.wireframe = value;
    }
  });
  camera.lookAt(Model.position);
});


const fontloader = new FontLoader()
fontloader.load('typefont.json',(font)=>{
  const textgemontry = new TextGeometry('3D Map',{
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
