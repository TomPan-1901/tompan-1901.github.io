import { Component } from './component'
import * as glMatrix from 'gl-matrix'
import type { RenderingContext } from './util'
import { getMVPMatrix } from './util'

class Square extends Component {
  vertexBuffer: WebGLBuffer | null = null
  vertices: Float32Array | null = null
  elementBuffer: WebGLBuffer | null = null
  texture: WebGLTexture | null = null
  constructor(gl: RenderingContext, parent: Component | null = null) {
    super(gl, parent)
    this.modelMatrix = glMatrix.mat4.create()
    this.children = []
    this.modelMatrix = glMatrix.mat4.create()
    this.absoluteModelMatrix = glMatrix.mat4.create()
    let image = new Image()
    image.onload = () => {
      this.texture = gl.createTexture()
      const u_Sampler = gl.getUniformLocation(gl.program!, 'u_Sampler')
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this.texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
      gl.uniform1i(u_Sampler, 0)
      console.log('load')
    }
    image.src = '/brick.bmp'
    const vertices = new Float32Array([
      1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0,
      1.0, 1.0
    ])
    const indices = new Uint8Array([0, 1, 2, 0, 2, 3])
    const vertexBuffer = gl.createBuffer()
    const elementBuffer = gl.createBuffer()
    if (!vertexBuffer) {
      console.error('Failed to create buffer')
      throw new Error('Failed to create buffer')
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    this.vertexBuffer = vertexBuffer
    this.vertices = vertices
    this.elementBuffer = elementBuffer
  }

  override draw(dt: number, viewMatrix: glMatrix.mat4, projectionMatrix: glMatrix.mat4): void {
    super.draw(dt, viewMatrix, projectionMatrix)
    const gl = this.gl
    gl.activeTexture(gl.TEXTURE0)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer)
    const vertices = this.vertices!
    const a_Position = gl.getAttribLocation(gl.program!, 'a_Position')
    const a_Color = gl.getAttribLocation(gl.program!, 'a_Color')
    const a_Normal = gl.getAttribLocation(gl.program!, 'a_Normal')
    const a_TexCoord = gl.getAttribLocation(gl.program!, 'a_TexCoord')
    const FSIZE = vertices.BYTES_PER_ELEMENT
    // this.absoluteModelMatrix = this.modelMatrix
    if (a_Position < 0 || a_Color < 0) {
      console.error('Failed to get attribute location')
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 5 * FSIZE, 0)
    gl.enableVertexAttribArray(a_Position)
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 5 * FSIZE, 3 * FSIZE)
    gl.enableVertexAttribArray(a_TexCoord)
    gl.vertexAttrib4f(a_Color, 1.0, 1.0, 1.0, 1.0)
    // const normal = glMatrix.vec4.fromValues(0.0, 1.0, 0.0, 0.0)
    gl.vertexAttrib4f(a_Normal, 0.0, 1.0, 0.0, 0.0)
    const u_MvpMatrix = gl.getUniformLocation(gl.program!, 'u_MvpMatrix')
    const u_NormalMatrix = gl.getUniformLocation(gl.program!, 'u_NormalMatrix')
    const u_ModelMatrix = gl.getUniformLocation(gl.program!, 'u_ModelMatrix')
    const u_UseTexture = gl.getUniformLocation(gl.program!, 'u_UseTexture')

    gl.uniform1i(u_UseTexture, 1)
    let normalMatrix = glMatrix.mat4.transpose(
      glMatrix.mat4.create(),
      glMatrix.mat4.invert(glMatrix.mat4.create(), this.absoluteModelMatrix)
    )
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix)
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.absoluteModelMatrix)
    let mvpMatrix = getMVPMatrix(this.absoluteModelMatrix, viewMatrix, projectionMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)
  }
}

export { Square }
