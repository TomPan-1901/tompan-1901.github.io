import { Component } from './component'
import { getMVPMatrix, type RenderingContext } from './util'
import * as glMatrix from 'gl-matrix'
class Cube extends Component {
  vertices: Float32Array
  elements: Uint8Array
  vertexBuffer: WebGLBuffer
  elementsBuffer: WebGLBuffer
  useLight: boolean = true
  constructor(gl: RenderingContext, parent: Component | null = null, useLight: boolean = true) {
    super(gl, parent)
    this.absoluteModelMatrix = glMatrix.mat4.create()
    this.modelMatrix = glMatrix.mat4.create()
    this.useLight = useLight
    // vertices position
    const vertices = new Float32Array([
      1.0, 1.0, 1.0, // v0
      -1.0, 1.0, 1.0, // v1
      -1.0, -1.0, 1.0, // v2
      1.0, -1.0, 1.0, // v3
      1.0, -1.0, -1.0, // v4
      1.0, 1.0, -1.0, // v5
      -1.0, 1.0, -1.0, // v6
      -1.0, -1.0, -1.0 // v7
    ])
    const verticesBuffer = gl.createBuffer()
    const elements = new Uint8Array([
      0, 1, 2, 0, 2, 3, // front
      0, 3, 4, 0, 4, 5, // right
      0, 5, 6, 0, 6, 1, // up
      1, 6, 7, 1, 7, 2, // left
      7, 4, 3, 7, 3, 2, // down
      4, 7, 6, 4, 6, 5 // back
    ])
    const elementsBuffer = gl.createBuffer()
    if (!verticesBuffer || !elementsBuffer) {
      console.error('Failed to create buffer')
      throw new Error('Failed to create buffer')
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementsBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW)
    this.vertices = vertices
    this.elements = elements
    this.vertexBuffer = verticesBuffer
    this.elementsBuffer = elementsBuffer
  }

  override draw(dt: number, viewMatrix: glMatrix.mat4, projectionMatrix: glMatrix.mat4): void {
    super.draw(dt, viewMatrix, projectionMatrix)
    this.modelMatrix = glMatrix.mat4.rotateY(this.modelMatrix, this.modelMatrix, dt)
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementsBuffer)
    const vertices = this.vertices!
    const a_Position = gl.getAttribLocation(gl.program!, 'a_Position')
    const a_Color = gl.getAttribLocation(gl.program!, 'a_Color')
    const a_Normal = gl.getAttribLocation(gl.program!, 'a_Normal')
    const u_UseTexture = gl.getUniformLocation(gl.program!, 'u_UseTexture')
    const u_UseLight = gl.getUniformLocation(gl.program!, 'u_UseLight')
    const FSIZE = vertices.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0)
    gl.enableVertexAttribArray(a_Position)
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 3, 0)
    gl.enableVertexAttribArray(a_Normal)
    gl.vertexAttrib4f(a_Color, 1.0, 1.0, 1.0, 1.0)
    gl.uniform1i(u_UseTexture, 0)
    gl.uniform1i(u_UseLight, this.useLight ? 1 : 0)
    const u_MvpMatrix = gl.getUniformLocation(gl.program!, 'u_MvpMatrix')
    // const u_LightColor = gl.getUniformLocation(gl.program!, 'u_LightColor')
    // const u_LightDirection = gl.getUniformLocation(gl.program!, 'u_LightDirection')
    // const u_AmbientLight = gl.getUniformLocation(gl.program!, 'u_AmbientLight')
    const u_NormalMatrix = gl.getUniformLocation(gl.program!, 'u_NormalMatrix')
    const u_ModelMatrix = gl.getUniformLocation(gl.program!, 'u_ModelMatrix')
    let normalMatrix = glMatrix.mat4.transpose(
      glMatrix.mat4.create(),
      glMatrix.mat4.invert(glMatrix.mat4.create(), this.absoluteModelMatrix)
    )
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix)
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.absoluteModelMatrix)
    let mvpMatrix = getMVPMatrix(this.absoluteModelMatrix, viewMatrix, projectionMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix)
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
    gl.uniform1i(u_UseLight, 1)
    gl.disableVertexAttribArray(a_Normal)
  }
}

export { Cube }