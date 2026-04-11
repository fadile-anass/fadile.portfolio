import * as THREE from 'three'

export function useThreeScene() {
  let scene, camera, renderer, geometry, material, mesh, particles, particleSystem
  let animationId
  let mouseX = 0
  let mouseY = 0
  let targetX = 0
  let targetY = 0
  const windowHalfX = window.innerWidth / 2
  const windowHalfY = window.innerHeight / 2

  const init = (container) => {
    scene = new THREE.Scene()
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Icosahedron
    geometry = new THREE.IcosahedronGeometry(1.5, 1)
    material = new THREE.MeshStandardMaterial({
      color: 0xE94560,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    })
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Particles
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 2000
    const posArray = new Float32Array(particleCount * 3)
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 16 // radius 8
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    })
    
    particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const pointLight = new THREE.PointLight(0xE94560, 1.5)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Events
    document.addEventListener('mousemove', onDocumentMouseMove)
    window.addEventListener('resize', onWindowResize)

    animate()
  }

  const onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate)

    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    if (mesh) {
      mesh.rotation.y += 0.005
      mesh.rotation.x += 0.002
      
      // Lerp rotation towards mouse
      mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y)
      mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x)
    }

    if (particleSystem) {
      particleSystem.rotation.y += 0.001
      particleSystem.rotation.x += 0.0005
    }

    renderer.render(scene, camera)
  }

  const mountScene = (container) => {
    init(container)
  }

  const destroyScene = () => {
    if (animationId) cancelAnimationFrame(animationId)
    document.removeEventListener('mousemove', onDocumentMouseMove)
    window.removeEventListener('resize', onWindowResize)
    
    if (geometry) geometry.dispose()
    if (material) material.dispose()
    if (renderer) renderer.dispose()
  }

  return { mountScene, destroyScene }
}
