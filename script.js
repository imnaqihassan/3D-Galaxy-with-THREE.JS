import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'




const canvas=document.querySelector("#canvas")


const scene=new THREE.Scene()

const gui=new GUI()


// TEXTURES

const texture=new THREE.TextureLoader()
const star=texture.load("./assets/star.png")
const circle=texture.load("./assets/circle.png")








// PARTICLES

const param={}
param.count=100000
param.size=0.01
param.radius=5
param.branches=3
param.spin=1
param.randomness=1
param.randomnessPower=3
param.insideColor='blue'
param.outsideColor='red'


let particleGeometry=null
let particleMaterial=null
let mesh=null


function generateGalaxy() {


    if (mesh !== null) {
        particleGeometry.dispose()
        particleMaterial.dispose()
        scene.remove(mesh)
    }

    // 03457761794 NUMBER


    // GEOMETRY
    
    particleGeometry=new THREE.BufferGeometry()
    const positions=new Float32Array(param.count*3)
    const colors=new Float32Array(param.count*3)
    
    
    for (let i = 0; i < param.count*3; i++) {

        const i3=i*3



        const radius=Math.random()*param.radius
        const spinAngle=radius*param.spin
        const branchAngle=(i%param.branches)/param.branches*Math.PI*2



        const randomX=Math.pow(Math.random(),param.randomnessPower)*(Math.random()<0.5?1:-1)
        const randomY=Math.pow(Math.random(),param.randomnessPower)*(Math.random()<0.5?1:-1)
        const randomZ=Math.pow(Math.random(),param.randomnessPower)*(Math.random()<0.5?1:-1)


        positions[i3+0]=Math.cos(branchAngle+spinAngle)*radius + randomX
        positions[i3+1]=randomY
        positions[i3+2]=Math.sin(branchAngle+spinAngle)*radius +randomZ


        // COLOR
        colors[i3+0]=1
        colors[i3+1]=0
        colors[i3+2]=0
        
    }
    

    particleGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions,3)
    )
    particleGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors,3)
    )
    
    
    

    particleMaterial=new THREE.PointsMaterial({
        size:param.size,
        sizeAttenuation:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending,
        vertexColors:true
    })
    
    //  particleMaterial.color=new THREE.Color("white")
    // particleMaterial.size=param.size
    // particleMaterial.sizeAttenuation=true
    // particleMaterial.transparent=true
    // particleMaterial.alphaMap=circle
    // particleMaterial.side=THREE.DoubleSide
    // // particleMaterial.alphaTest=0.001
    // // particleMaterial.depthTest=false
    // particleMaterial.depthWrite=false
    // particleMaterial.blending=THREE.AdditiveBlending
    // particleMaterial.vertexColors=true
    
    

    mesh=new THREE.Points(particleGeometry,particleMaterial)
    scene.add(mesh)
    
}
generateGalaxy()

gui.add(param,'size').min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy)
gui.add(param,'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(param,'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(param,'count').min(2000).max(100000).step(1000).onFinishChange(generateGalaxy)
gui.add(param,'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(param,'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(param,'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(param,'insideColor').onFinishChange(generateGalaxy)
gui.addColor(param,'outsideColor').onFinishChange(generateGalaxy)














// CAMERA

const sizes={
    width:window.innerWidth,
    height:window.innerHeight
}

const ratio=sizes.width/sizes.height


const camera=new THREE.PerspectiveCamera(75,ratio,1,100)
camera.position.z=6
camera.position.y=6
scene.add(camera)






//Controls
const Controls=new OrbitControls(camera,canvas)
Controls.enableDamping=true
Controls.enableZoom=true







// RENDER


const renderer=new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width,sizes.height)



// RESIZE

window.addEventListener("resize",()=>{
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight


   
    
    renderer.setSize(sizes.width,sizes.height)


    console.log("resizing is working")
})




// ALIVE FUNCTIONS

const clock=new THREE.Clock()
function animation() {

    const elapsed=clock.getElapsedTime()


    // PARTICLES ANIMATION
    // for (let i = 0; i < count; i++) {
        

    //     const i3=i*3

        // const x=particleGeometry.attributes.position.array[i3]

    //     particleGeometry.attributes.position.array[i3+1]=Math.sin(elapsed+x)


    // }
    // particleGeometry.attributes.position.needsUpdate=true


    
    Controls.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(animation)
}
animation()