import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import PhoneScreen from './Phonescreen.js'
import Resources from './Utils/Resources'
import sources from './sources'
import FontJSON from '../static/fonts/Roboto-msdf.json'
import FontImage from '../static/fonts/Roboto-msdf.png'
import * as ThreeMeshUI from 'three-mesh-ui'

/**
 * Resources
 */
const resources = new Resources(sources)

/**
 * Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // Wait a little
        window.setTimeout(() =>
        {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        }, 500)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
const textureLoader = new THREE.TextureLoader(loadingManager)

/**
 * Base
 */
// Debug
const debugObject = {}

/***************************************
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')
const menuElement = document.querySelector('.menu')



let objsToTest = [];

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();
mouse.x = mouse.y = null;
let selectState, menuHover, menuOpen, phoneButton = false

window.addEventListener( 'pointermove', ( event ) => {
    mouse.x = ( event.clientX / sizes.width ) * 2 - 1;
    mouse.y = -( event.clientY / sizes.height ) * 2 + 1;
} );

//click test
window.addEventListener( 'pointerdown', () => {
    selectState = true;
} );

window.addEventListener( 'pointerup', () => {
    burgerBubble.scale.set(1,1,1)
    selectState = false;
    if (menuHover) 
    {
        gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 0.5, value: 1, delay: 0 })
        menuOpen = true
        menuElement.style.display = 'block'
    }
    if (!menuHover && !menuOpen && phoneButton)
        {
            phoneButton = false
        }
    else if (!menuHover && menuOpen)
        {
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 0.5, value: 0, delay: 0 })
            menuElement.style.display = 'none'
            menuOpen=false
        }
} );

//raycast
function raycast() {

    return objsToTest.reduce( ( closestIntersection, obj ) => {

        const intersection = raycaster.intersectObject( obj, true );

        if ( !intersection[ 0 ] ) return closestIntersection;

        if ( !closestIntersection || intersection[ 0 ].distance < closestIntersection.distance ) {

            intersection[ 0 ].object = obj;

            return intersection[ 0 ];

        }

        return closestIntersection;

    }, null );

}

function updateButtons() {

    // Find closest intersecting object

    let intersect;

    if ( mouse.x !== null && mouse.y !== null ) {

        raycaster.setFromCamera( mouse, camera );

        intersect = raycast();

    }

    // Update targeted button state (if any)

    if ( intersect && intersect.object.isUI ) {
        console.log('2')
        phoneButton = true

        if ( selectState ) {

            // Component.setState internally call component.set with the options you defined in component.setupState
                intersect.object.setState( 'selected' );

        } else {

            // Component.setState internally call component.set with the options you defined in component.setupState
                intersect.object.setState( 'hovered' );

        }

    }

    // Update non-targeted buttons state

    objsToTest.forEach( ( obj ) => {

        if ( ( !intersect || obj !== intersect.object ) && obj.isUI ) {

            // Component.setState internally call component.set with the options you defined in component.setupState
            obj.setState( 'idle' );
        }

    } );

    objsToTest.forEach( ( obj ) => {
        if ( !intersect && !obj.isUI ) {
            obj.scale.set(1,1,1)
            menuHover = false
            phoneButton = false
        }
    })
    

    if ( intersect && !intersect.object.isUI ) {
        console.log('hovered')
        menuHover = true
        intersect.object.scale.set(1.5,1.5,1.5)
    }

}



// Scene
const scene = new THREE.Scene()

/***********************
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.055,0.537,0.451, uAlpha);
        }
    `
})

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)
const crossTexture = new THREE.TextureLoader().load( "textures/cross.jpg" );
crossTexture.wrapS = THREE.RepeatWrapping;
crossTexture.wrapT = THREE.RepeatWrapping;
crossTexture.repeat.set( 1, 1 );

// Burger menu

const rotationMatrix = new THREE.Matrix4();
const targetQuaternion = new THREE.Quaternion();
const clock = new THREE.Clock();
const speed = 0.5;

const sphereGeometry = new THREE.SphereBufferGeometry(1, 25, 25)
const baubleMaterial = new THREE.MeshStandardMaterial({ color: "#0E8973", roughness: 0, map: crossTexture, envMapIntensity: 0.1, emissive: "#370037" })
const burgerBubble = new THREE.Mesh( sphereGeometry, baubleMaterial )
burgerBubble.position.set(4, 4, 4)
objsToTest.push(burgerBubble)
scene.add(burgerBubble)

function rotateBurger() {

    const delta = clock.getDelta();

    if ( ! burgerBubble.quaternion.equals( targetQuaternion ) ) {

        const step = speed * delta;
        burgerBubble.quaternion.rotateTowards( targetQuaternion, step );

    }
}




/**
 * Environment map
 */
let environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
let envMapCount = 0

// Update all materials
 
 const updateAllMaterials = () =>
 {
     scene.traverse((child) =>
     {
         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
         {
             child.material.envMap = environmentMap
             child.material.envMapIntensity = debugObject.envMapIntensity
             child.material.needsUpdate = true
             child.castShadow = true
             child.receiveShadow = true
         }
     })
 }

function changeEnvironment(next) {
        if (next){
            console.log('reachednext');
            envMapCount++
        }
        else envMapCount--

        if (envMapCount==5) 
        {
            envMapCount = 0
        } 
        else if (envMapCount == -1)
        {
            envMapCount = 4
        }
        environmentMap = resources.items['environmentMap'+envMapCount]
        resources.items['environmentMap'+envMapCount].encoding = THREE.sRGBEncoding
        gsap.to(burgerBubble.position.x, { duration: 3, value: 4, delay: 1 })
        scene.background = environmentMap
        scene.environment = environmentMap
        updateAllMaterials()
    }

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 2.5

/**
 * Models
 */
gltfLoader.load(
    '/models/phone.glb',
    (gltf) =>
    {
        // gltf.scene.scale.set(10, 10, 10)
        gltf.scene.position.set(0, -1.5, 0)
        // gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)
let cellphone = new PhoneScreen(objsToTest,scene,changeEnvironment)
// scene.add(screen,ui,buttons[0],buttons[1])




/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

function targetCamera() 
    {
        rotationMatrix.lookAt( camera.position, burgerBubble.position, burgerBubble.up );
        targetQuaternion.setFromRotationMatrix( rotationMatrix );
        setTimeout( targetCamera, 2000 );
    }

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()
    cellphone.update()
    ThreeMeshUI.update()
    updateButtons()

    // Render
    renderer.render(scene, camera)
    // burgerBubble.lookAt(camera.position)

    rotateBurger()

    // burgerBubble.position.copy(camera.position)
    // burgerBubble.position.z += 4

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
targetCamera()
tick()