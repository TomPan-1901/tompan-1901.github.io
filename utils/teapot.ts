import { Component } from './component'
import type { RenderingContext } from './util'
import { loadUtalTeapot, getMVPMatrix, silver } from './util'
import * as glMatrix from 'gl-matrix'
import { Cube } from './cube'
class Teapot extends Component {
  vertextBuffer: WebGLBuffer | null = null
  vertices: Float32Array | null = null
  lightPosition: glMatrix.vec3 = glMatrix.vec3.fromValues(-5, 5, 5)
  lightCube: Cube | null
  loaded: boolean
  constructor(gl: RenderingContext, parent: Component | null = null) {
    super(gl, parent)
    this.modelMatrix = glMatrix.mat4.create()
    this.children = []
    this.modelMatrix = glMatrix.mat4.create()
    this.absoluteModelMatrix = glMatrix.mat4.create()
    this.lightCube = null
    this.loaded = false
    loadUtalTeapot().then((res) => {
      console.log(this)
      this.loaded = true
      const [vertices, n] = res
      const vertexBuffer = gl.createBuffer()
      if (!vertexBuffer) {
        console.error('Failed to create buffer')
        throw new Error('Failed to create buffer')
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
      this.vertextBuffer = vertexBuffer
      this.vertices = vertices
      const u_PositionalLight_Position = gl.getUniformLocation(gl.program!, 'u_PositionalLight.position')
      gl.uniform3fv(u_PositionalLight_Position, this.lightPosition)
      const u_PositionalLight_Color = gl.getUniformLocation(gl.program!, 'u_PositionalLight.color')
      gl.uniform3f(u_PositionalLight_Color, 1, 1, 1)
      const u_PositionalLight_ambient = gl.getUniformLocation(gl.program!, 'u_PositionalLight.ambient')
      gl.uniform4f(u_PositionalLight_ambient, 0.2, 0.2, 0.2, 1.0)
      const u_PositionalLight_diffuse = gl.getUniformLocation(gl.program!, 'u_PositionalLight.diffuse')
      gl.uniform4f(u_PositionalLight_diffuse, 1, 1, 1, 1.0)
      const u_PositionalLight_specular = gl.getUniformLocation(gl.program!, 'u_PositionalLight.specular')
      gl.uniform4f(u_PositionalLight_specular, 1, 1, 1, 1.0)
      
      // add a cube to describe the light
      const cube = new Cube(gl, this, false)
      cube.modelMatrix = glMatrix.mat4.translate(
        glMatrix.mat4.create(),
        cube.modelMatrix,
        this.lightPosition
      )
      cube.modelMatrix = glMatrix.mat4.fromScaling(
        glMatrix.mat4.create(),
        glMatrix.vec3.fromValues(0.1, 0.1, 0.1),
      )
      this.lightCube = cube
      this.addChild(cube)
    })

  }

  override draw(dt: number, viewMatrix: glMatrix.mat4, projectionMatrix: glMatrix.mat4): void {
    if (!this.loaded)
      return
    this.lightPosition = glMatrix.vec3.rotateY(
      glMatrix.vec3.create(),
      this.lightPosition,
      glMatrix.vec3.fromValues(0, this.lightPosition[1], 0),
      dt
    )
    glMatrix.mat4.translate(
      this.lightCube!.modelMatrix,
      glMatrix.mat4.create(),
      this.lightPosition
    )
    glMatrix.mat4.scale(
      this.lightCube!.modelMatrix,
      this.lightCube!.modelMatrix,
      glMatrix.vec3.fromValues(0.1, 0.1, 0.1)
    )
    const gl = this.gl
    super.draw(dt, viewMatrix, projectionMatrix)
    const u_PositionalLight_Position = gl.getUniformLocation(gl.program!, 'u_PositionalLight.position')
    gl.uniform3fv(u_PositionalLight_Position, this.lightPosition)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertextBuffer)
    // 银材质
    const u_Material_ambient = gl.getUniformLocation(gl.program!, 'u_Material.ambient')
    gl.uniform4fv(u_Material_ambient, silver.ambient)
    const u_Material_diffuse = gl.getUniformLocation(gl.program!, 'u_Material.diffuse')
    gl.uniform4fv(u_Material_diffuse, silver.diffuse)
    const u_Material_specular = gl.getUniformLocation(gl.program!, 'u_Material.specular')
    gl.uniform4fv(u_Material_specular, silver.specular)
    const u_Material_shininess = gl.getUniformLocation(gl.program!, 'u_Material.shininess')
    gl.uniform1f(u_Material_shininess, silver.shininess)
    const vertices = this.vertices!
    const a_Position = gl.getAttribLocation(gl.program!, 'a_Position')
    const a_Color = gl.getAttribLocation(gl.program!, 'a_Color')
    const a_Normal = gl.getAttribLocation(gl.program!, 'a_Normal')
    const FSIZE = vertices.BYTES_PER_ELEMENT
    if (a_Position < 0 || a_Color < 0) {
      console.error('Failed to get attribute location')
    }
    gl.vertexAttrib4f(a_Color, 1.0, 1.0, 1.0, 1.0)
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0)
    gl.enableVertexAttribArray(a_Position)
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE)
    gl.enableVertexAttribArray(a_Normal)
    const u_MvpMatrix = gl.getUniformLocation(gl.program!, 'u_MvpMatrix')
    if (!u_MvpMatrix) {
      console.error('Failed to get the storage location of u_MvpMatrix')
      return
    }
    // glMatrix.mat4.rotateY(this.modelMatrix, this.modelMatrix, dt)
    // glMatrix.mat4.rotateX(this.modelMatrix, this.modelMatrix, dt)
    // glMatrix.mat4.rotateY(this.viewMatrix, this.viewMatrix, dt)
    const u_LightColor = gl.getUniformLocation(gl.program!, 'u_LightColor')
    const u_LightDirection = gl.getUniformLocation(gl.program!, 'u_LightDirection')
    const u_AmbientLight = gl.getUniformLocation(gl.program!, 'u_AmbientLight')
    const u_NormalMatrix = gl.getUniformLocation(gl.program!, 'u_NormalMatrix')
    const u_ModelMatrix = gl.getUniformLocation(gl.program!, 'u_ModelMatrix')
    const u_UseTexture = gl.getUniformLocation(gl.program!, 'u_UseTexture')

    gl.uniform1i(u_UseTexture, 0)
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0)
    gl.uniform3fv(
      u_LightDirection,
      glMatrix.vec3.normalize(glMatrix.vec3.create(), [0.5, 3.0, 4.0])
    )
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2)
    let normalMatrix = glMatrix.mat4.transpose(
      glMatrix.mat4.create(),
      glMatrix.mat4.invert(glMatrix.mat4.create(), this.absoluteModelMatrix)
    )
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix)
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.absoluteModelMatrix)
    let mvpMatrix = getMVPMatrix(this.absoluteModelMatrix, viewMatrix, projectionMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix)
    gl.drawArrays(gl.TRIANGLES, 0, 5144 * 3)
    gl.disableVertexAttribArray(a_Normal)
  }
}

export { Teapot }
