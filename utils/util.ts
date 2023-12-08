type RenderingContext = WebGLRenderingContext & { program?: WebGLProgram }
import * as glMatrix from 'gl-matrix'
import teapot from '@/assets/teapot.tris?raw'

function loadShader(gl: RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (shader === null) {
    console.error('unable to create shader')
    return null
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    const error = gl.getShaderInfoLog(shader)
    console.error('Failed to compile shader: ' + error)
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(
  gl: RenderingContext,
  vshader: string,
  fshader: string
): WebGLProgram | null {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader)
  if (!vertexShader || !fragmentShader) {
    return null
  }
  const program = gl.createProgram()
  if (!program) {
    return null
  }
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    const error = gl.getProgramInfoLog(program)
    console.error('Failed to link program: ' + error)
    gl.deleteProgram(program)
    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)
    return null
  }
  return program
}

function initShaders(gl: RenderingContext, vshader: string, fshader: string): Boolean {
  const program = createProgram(gl, vshader, fshader)
  if (!program) {
    console.error('Failed to create program')
    return false
  }
  gl.useProgram(program)
  gl.program = program
  // gl.enable(gl.DEPTH_TEST)
  return true
}

function initVertexBuffers(gl: RenderingContext) {
  const [vertices, n] = loadUtalTeapot()
  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.error('Failed to create buffer')
    return -1
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  const a_Position = gl.getAttribLocation(gl.program!, 'a_Position')
  const a_Color = gl.getAttribLocation(gl.program!, 'a_Color')
  const a_Normal = gl.getAttribLocation(gl.program!, 'a_Normal')
  const FSIZE = vertices.BYTES_PER_ELEMENT
  if (a_Position < 0 || a_Color < 0) {
    console.error('Failed to get attribute location')
    return -1
  }
  gl.vertexAttrib4f(a_Color, 1.0, 1.0, 1.0, 1.0)
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0)
  gl.enableVertexAttribArray(a_Position)
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE)
  gl.enableVertexAttribArray(a_Normal)
  // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 3 * FSIZE)
  // gl.enableVertexAttribArray(a_Color)
  return n
}

function getMVPMatrix(M: glMatrix.mat4, V: glMatrix.mat4, P: glMatrix.mat4) {
  return glMatrix.mat4.multiply(
    glMatrix.mat4.create(),
    P,
    glMatrix.mat4.multiply(glMatrix.mat4.create(), V, M)
  )
}

function loadUtalTeapot(): [Float32Array, number] {
  const lines = teapot.split('\r\n').filter((line) => line.length > 0)
  const num_of_tris = parseInt(lines[0])
  const data = new Float32Array(
    lines
      .slice(1)
      .map((lines) => lines.split(' ').map(parseFloat))
      .flat()
  )
  console.log(num_of_tris)
  return [data, num_of_tris]
}

function createViewMatrix(eye: glMatrix.vec3, pitch: number, yaw: number): glMatrix.mat4 {
  const viewMatrix = glMatrix.mat4.create()
  const sight = glMatrix.vec3.fromValues(
    Math.cos(pitch) * Math.cos(yaw),
    Math.sin(pitch),
    Math.cos(pitch) * Math.sin(yaw)
  )
  const up = glMatrix.vec3.fromValues(0, 1, 0)
  glMatrix.vec3.normalize(sight, sight)
  glMatrix.mat4.lookAt(viewMatrix, eye, glMatrix.vec3.add(glMatrix.vec3.create(), eye, sight), up)
  return viewMatrix
}

function getSight(pitch: number, yaw: number): glMatrix.vec3 {
  return glMatrix.vec3.fromValues(
    Math.cos(pitch) * Math.cos(yaw),
    Math.sin(pitch),
    Math.cos(pitch) * Math.sin(yaw)
  )
}

const silver = {
  ambient: [0.19225, 0.19225, 0.19225, 1],
  diffuse: [0.50754, 0.50754, 0.50754, 1],
  specular: [0.508273, 0.508273, 0.508273, 1],
  shininess: 51.2
}


export { initShaders, initVertexBuffers, getMVPMatrix, loadUtalTeapot, createViewMatrix, getSight, silver }
export type { RenderingContext }
