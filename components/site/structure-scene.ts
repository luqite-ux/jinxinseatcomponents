import * as THREE from 'three'

type Point = [number, number]

const backrestRear: Point[] = [
  [-0.88, 1.1],
  [-0.98, 0.45],
  [-1.03, -0.2],
  [-0.95, -0.45],
]
const backrestFront: Point[] = [
  [-0.58, 1.05],
  [-0.66, 0.45],
  [-0.69, -0.2],
  [-0.6, -0.4],
]
const headrest: Point[] = [
  [-0.86, 1.34],
  [-0.62, 1.34],
  [-0.6, 1.12],
  [-0.88, 1.12],
  [-0.86, 1.34],
]
const cushionTop: Point[] = [
  [-0.6, -0.4],
  [-0.1, -0.5],
  [0.5, -0.45],
  [0.92, -0.35],
]
const cushionBottom: Point[] = [
  [-0.95, -0.45],
  [-0.1, -0.7],
  [0.5, -0.68],
  [0.92, -0.58],
]
const railUpper: Point[] = [
  [-0.95, -0.98],
  [0.95, -0.98],
]
const railLower: Point[] = [
  [-1.05, -1.12],
  [1.05, -1.12],
]
const posts: Point[][] = [
  [
    [-0.6, -0.7],
    [-0.6, -0.98],
  ],
  [
    [0.5, -0.68],
    [0.5, -0.98],
  ],
]

function sample(points: Point[], count: number) {
  if (points.length === 2) {
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1)
      return new THREE.Vector2(
        points[0][0] + (points[1][0] - points[0][0]) * t,
        points[0][1] + (points[1][1] - points[0][1]) * t,
      )
    })
  }
  return new THREE.SplineCurve(points.map(([x, y]) => new THREE.Vector2(x, y))).getPoints(count - 1)
}

export type SceneHandle = { dispose: () => void }

export function mountStructureScene(canvas: HTMLCanvasElement, options: { lowPower: boolean }): SceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  const maxRatio = options.lowPower ? 1.25 : 1.75
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxRatio))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
  camera.position.set(0, 0.1, 6.4)

  const group = new THREE.Group()
  scene.add(group)

  const greyMaterial = new THREE.LineBasicMaterial({ color: 0x2b2f38, transparent: true, opacity: 0.42 })
  const redMaterial = new THREE.LineBasicMaterial({ color: 0xd3241a, transparent: true, opacity: 0.85 })
  const linkMaterial = new THREE.LineBasicMaterial({ color: 0x2b2f38, transparent: true, opacity: 0.18 })
  const geometries: THREE.BufferGeometry[] = []

  const depth = 0.42
  const segments = options.lowPower ? 18 : 28

  function addPolyline(points: THREE.Vector2[], z: number, material: THREE.Material) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, p.y, z)))
    geometries.push(geometry)
    group.add(new THREE.Line(geometry, material))
  }

  function addLinks(a: THREE.Vector2[], b: THREE.Vector2[], zA: number, zB: number, step: number, material: THREE.Material) {
    const vertices: THREE.Vector3[] = []
    for (let i = 0; i < Math.min(a.length, b.length); i += step) {
      vertices.push(new THREE.Vector3(a[i].x, a[i].y, zA), new THREE.Vector3(b[i].x, b[i].y, zB))
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices)
    geometries.push(geometry)
    group.add(new THREE.LineSegments(geometry, material))
  }

  const rear = sample(backrestRear, segments)
  const front = sample(backrestFront, segments)
  const top = sample(cushionTop, segments)
  const bottom = sample(cushionBottom, segments)
  const head = sample(headrest, 5)
  const rails = [sample(railUpper, 2), sample(railLower, 2)]

  for (const z of [-depth, depth]) {
    addPolyline(rear, z, greyMaterial)
    addPolyline(front, z, greyMaterial)
    addPolyline(head, z, redMaterial)
    addPolyline(top, z, greyMaterial)
    addPolyline(bottom, z, greyMaterial)
    rails.forEach((rail) => addPolyline(rail, z, greyMaterial))
    posts.forEach((post) => addPolyline(sample(post, 2), z, greyMaterial))
    addLinks(rear, front, z, z, 4, linkMaterial)
    addLinks(top, bottom, z, z, 4, linkMaterial)
  }

  ;[rear, front, head, top, bottom, ...rails].forEach((line) => {
    addLinks(line, line, -depth, depth, line.length > 6 ? 5 : 1, linkMaterial)
  })

  const pointer = { x: 0, y: 0 }
  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  }
  if (!options.lowPower) window.addEventListener('pointermove', onPointerMove, { passive: true })

  const resize = () => {
    const { clientWidth, clientHeight } = canvas
    if (!clientWidth || !clientHeight) return
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  let visible = true
  let frame = 0
  const start = performance.now()
  const swing = options.lowPower ? 0.28 : 0.5

  const render = (now: number) => {
    const t = (now - start) / 1000
    group.rotation.y = -0.55 + Math.sin(t * 0.25) * swing + pointer.x * 0.12
    group.rotation.x = 0.06 + pointer.y * 0.05
    renderer.render(scene, camera)
  }

  const tick = (now: number) => {
    render(now)
    frame = requestAnimationFrame(tick)
  }
  const play = () => {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick)
  }
  const pause = () => {
    cancelAnimationFrame(frame)
    frame = 0
  }

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    visible ? play() : pause()
  })
  intersection.observe(canvas)
  const onVisibility = () => (document.hidden ? pause() : play())
  document.addEventListener('visibilitychange', onVisibility)

  render(performance.now())
  play()

  return {
    dispose() {
      pause()
      intersection.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)
      geometries.forEach((g) => g.dispose())
      greyMaterial.dispose()
      redMaterial.dispose()
      linkMaterial.dispose()
      renderer.dispose()
    },
  }
}
