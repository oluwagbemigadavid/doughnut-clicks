import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const canvas = document.querySelector('canvas.cube3')

const scene = new THREE.Scene()
const axisH = new THREE.AxesHelper(5)
scene.add(axisH)

const gui = new dat.GUI()

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/matcaps/5.png')

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
ambientLight.intensity = 0.5
gui.add(ambientLight, 'intensity', 0.001, 1, 0.00001).name('Ambient Light')
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, .5, 17.382)
pointLight.position.set(0, 2.8, 0.1)

var pointLightFolder = gui.addFolder('Point Light');
pointLightFolder.add( pointLight.position, 'x', 0.1, 15, 0.001)
pointLightFolder.add( pointLight.position, 'y', -1, 8, 0.0001)
pointLightFolder.add( pointLight.position, 'z', 0.1, 15, 0.001)
pointLightFolder.add( pointLight, 'distance', 0.1, 50, 0.0001).name('Distance')
scene.add(pointLight)

pointLight.castShadow = true

pointLight.shadow.mapSize.width = 300
pointLight.shadow.mapSize.height = 300

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 15


const fontLoader = new THREE.FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeo = new THREE.TextBufferGeometry('welcome', {
        font,
        size: 0.6,
        height: 0.2,
        curveSegments: 12, 
        bevelEnabled: true,
        bevelSegments: 5,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
    })
    const textGeo1 = new THREE.TextBufferGeometry('to', {
        font,
        size: 0.6,
        height: 0.2,
        curveSegments: 12, 
        bevelEnabled: true,
        bevelSegments: 5,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
    })
    const textGeo2 = new THREE.TextBufferGeometry('Neverland', {
        font,
        size: 0.6,
        height: 0.2,
        curveSegments: 12, 
        bevelEnabled: true,
        bevelSegments: 5,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
    })
    
    textGeo.center()
    textGeo1.center()
    textGeo2.center()
    const txtMat = new THREE.MeshStandardMaterial({map: texture})
    const text = new THREE.Mesh(textGeo, txtMat)
    const text1 = new THREE.Mesh(textGeo1, txtMat)
    const text2 = new THREE.Mesh(textGeo2, txtMat)
    text.position.y = 1
    text2.position.y = -1
    scene.add(text, text1, text2)

    text2.castShadow = true

    function animate() {
      requestAnimationFrame(animate);
      text.rotation.y += 0.002;
      text1.rotation.y += 0.002;
      text2.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    animate();

    const dg = new THREE.TorusBufferGeometry(.3, .2, 20, 45)

    for(let i = 0; i < 300; i++) {
        const dm =  new THREE.MeshMatcapMaterial({matcap:  textureLoader.load(`/textures/matcaps/8.png`)})
        const donut = new THREE.Mesh(dg, dm)
        donut.position.x = (Math.random() - .5) * 12
        donut.position.y = (Math.random() - .5) * 12
        donut.position.z = (Math.random() - .5) * 12

        donut.rotation.x = (Math.random()) * Math.PI
        donut.rotation.y = (Math.random()) * Math.PI

        const scale = Math.random()

        donut.scale.set(scale, scale, scale)
        scene.add(donut)
    }
})

const material = new THREE.MeshStandardMaterial()

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(15, 15),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 5

const plane1 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(15, 15),
    material
)
plane1.position.z = - 7.5

const plane2 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(15, 15),
    material
)
plane2.position.z = 7.5
plane2.rotation.y = Math.PI

const plane3 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(15, 15),
    material
)
plane3.rotation.y = Math.PI * 0.5
plane3.position.x = -7.5

const plane4 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(15, 15),
    material
)
plane4.rotation.y = -Math.PI * 0.5
plane4.position.x = 7.5

const plane5 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(15, 15),
    material
)
plane5.rotation.x = Math.PI * 0.5
plane5.position.y = 5


const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.5, 50, 10),
    new THREE.MeshBasicMaterial(0xffffff)
)
sphere.position.y = 5.1812
gui.add(sphere.position, 'y', 0, 10, 0.0001)

plane.receiveShadow = true
plane1.receiveShadow = true
plane2.receiveShadow = true
plane3.receiveShadow = true
plane4.receiveShadow = true


scene.add(plane, plane1, plane2, plane3, plane4, plane5, sphere)



const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 25 )
camera.position.z = 6
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGL1Renderer({canvas: canvas})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const update = () => {
    
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(update)
}

update()