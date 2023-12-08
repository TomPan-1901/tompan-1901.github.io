import * as glMatrix from 'gl-matrix'
import type { RenderingContext } from './util'
import { initVertexBuffers, initShaders, getMVPMatrix, createViewMatrix, getSight } from './util'
import { Teapot } from './teapot'
import { Square } from './square'
import { Cube } from './cube'
// import SkyboxFragShader from '@/shaders/skybox.frag?raw'
// import SkyboxVertexShader from '@/shaders/skybox.vert?raw'

class App {
  gl: RenderingContext
  viewMatrix: glMatrix.mat4
  modelMatrix: glMatrix.mat4
  projectionMatrix: glMatrix.mat4
  eye: glMatrix.vec3
  up: glMatrix.vec3
  pitch: number = 0
  yaw: number = -Math.PI / 2
  mouseX?: number
  mouseY?: number
  drag: boolean = false
  currentKeyDown: {
    ArrowUp: boolean
    ArrowDown: boolean
    ArrowLeft: boolean
    ArrowRight: boolean
    w: boolean
    s: boolean
    a: boolean
    d: boolean
    q: boolean
    e: boolean
  }
  skybox: WebGLTexture | null
  skyboxProgram: WebGLProgram | null
  teapot: Teapot
  constructor(gl: RenderingContext, vshader: string, fshader: string) {
    this.gl = gl
    gl.enable(gl.DEPTH_TEST)
    this.skybox = null
    if (!initShaders(gl, vshader, fshader)) {
      throw new Error('Failed to initialize shaders')
    }
    const program = gl.program!
    // if (!initShaders(gl, SkyboxVertexShader, SkyboxFragShader)) {
    //   throw new Error('Failed to initialize shaders')
    // }
    this.skyboxProgram = gl.program!
    gl.program = program
    gl.useProgram(program)
    this.viewMatrix = glMatrix.mat4.create()
    this.modelMatrix = glMatrix.mat4.create()
    this.projectionMatrix = glMatrix.mat4.create()
    this.eye = glMatrix.vec3.fromValues(0, 5, 5)
    this.teapot = new Teapot(gl)
    const cube = new Cube(gl, this.teapot)
    const smallTeapot = new Square(gl, this.teapot)
    cube.modelMatrix = glMatrix.mat4.translate(glMatrix.mat4.create(), glMatrix.mat4.create(), glMatrix.vec3.fromValues(0, 2.5, -10))
    smallTeapot.modelMatrix = glMatrix.mat4.fromScaling(
      glMatrix.mat4.create(),
      glMatrix.vec3.fromValues(10, 10, 10)
    )
    // glMatrix.mat4.translate(smallTeapot.modelMatrix, smallTeapot.modelMatrix, glMatrix.vec3.fromValues(10, 0, 0))
    this.teapot.addChild(smallTeapot)
    this.teapot.addChild(cube)


    this.currentKeyDown = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      s: false,
      a: false,
      d: false,
      q: false,
      e: false
    }
    this.viewMatrix = createViewMatrix(this.eye, this.pitch, this.yaw)
    this.up = glMatrix.vec3.fromValues(0, 1, 0)
    glMatrix.mat4.perspective(this.projectionMatrix, Math.PI / 2, 1024 / 768, 1, 100)
  }

  draw(dt: number) {
    this.updateCamera(dt)
    const gl = this.gl
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    this.teapot.draw(dt, this.viewMatrix, this.projectionMatrix)

  }

  handleKeydown(e: KeyboardEvent) {
    if (e.key in this.currentKeyDown) {
      this.currentKeyDown[e.key as keyof typeof this.currentKeyDown] = true
    }
  }

  handleMousemove(e: MouseEvent) {
    if (!this.drag) return
    if (!this.mouseX || !this.mouseY) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
      return
    }
    const dx = (e.clientX - this.mouseX) / -1000
    const dy = (e.clientY - this.mouseY) / 1000
    this.pitch += dy * 2
    this.pitch = Math.max(Math.min(this.pitch, Math.PI / 2 - 0.01), -Math.PI / 2 + 0.01)
    this.yaw += dx * 2
    this.yaw = this.yaw % (Math.PI * 2)
    this.viewMatrix = createViewMatrix(this.eye, this.pitch, this.yaw)
    this.mouseX = e.clientX
    this.mouseY = e.clientY
  }

  handleMouseup(e: MouseEvent) {
    this.mouseX = undefined
    this.mouseY = undefined
    this.drag = false
  }

  handleMousedown(e: MouseEvent) {
    this.drag = true
  }

  handleKeyup(e: KeyboardEvent) {
    if (e.key in this.currentKeyDown) {
      this.currentKeyDown[e.key as keyof typeof this.currentKeyDown] = false
    }
  }

  updateCamera(dt: number) {
    const sight = getSight(this.pitch, this.yaw)
    if (this.currentKeyDown['ArrowUp']) {
      this.pitch += dt
      this.pitch = Math.max(Math.min(this.pitch, Math.PI / 2 - 0.01), -Math.PI / 2 + 0.01)
    } else if (this.currentKeyDown['ArrowDown']) {
      this.pitch -= dt
      this.pitch = Math.max(Math.min(this.pitch, Math.PI / 2 - 0.01), -Math.PI / 2 + 0.01)
    } else if (this.currentKeyDown['ArrowLeft']) {
      this.yaw -= dt
      this.yaw = this.yaw % (Math.PI * 2)
    } else if (this.currentKeyDown['ArrowRight']) {
      this.yaw += dt
      this.yaw = this.yaw % (Math.PI * 2)
    } else if (this.currentKeyDown['w']) {
      glMatrix.vec3.add(
        this.eye,
        this.eye,
        glMatrix.vec3.scale(glMatrix.vec3.create(), glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.fromValues(sight[0], 0, sight[2])), dt * 4)
      )
    } else if (this.currentKeyDown['s']) {
      glMatrix.vec3.add(
        this.eye,
        this.eye,
        glMatrix.vec3.scale(glMatrix.vec3.create(), glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.fromValues(sight[0], 0, sight[2])), -dt * 4)
      )
    } else if (this.currentKeyDown['a']) {
      const right = glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.cross(glMatrix.vec3.create(), sight, this.up))
      glMatrix.vec3.add(
        this.eye,
        this.eye,
        glMatrix.vec3.scale(glMatrix.vec3.create(), right, -dt * 4)
      )
    } else if (this.currentKeyDown['d']) {
      const right = glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.cross(glMatrix.vec3.create(), sight, this.up))
      glMatrix.vec3.add(
        this.eye,
        this.eye,
        glMatrix.vec3.scale(glMatrix.vec3.create(), right, dt * 4)
      )
    } else if (this.currentKeyDown['q']) {
      glMatrix.vec3.add(
        this.eye,
        this.eye,
        glMatrix.vec3.scale(glMatrix.vec3.create(), this.up, -dt * 4)
      )
    } else if (this.currentKeyDown['e']) {
      glMatrix.vec3.add(
        this.eye,
        this.eye,
        glMatrix.vec3.scale(glMatrix.vec3.create(), this.up, dt * 4)
      )
    }
    this.viewMatrix = createViewMatrix(this.eye, this.pitch, this.yaw)
  }
}

export { App }
