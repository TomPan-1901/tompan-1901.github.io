import * as glMatrix from 'gl-matrix'
import type { RenderingContext } from './util'
abstract class Component {
  children: Component[] = []
  modelMatrix: glMatrix.mat4 = glMatrix.mat4.create()
  absoluteModelMatrix: glMatrix.mat4 = glMatrix.mat4.create()
  gl: RenderingContext
  parent: Component | null
  constructor(gl: RenderingContext, parent: Component | null = null) {
    this.gl = gl
    this.parent = parent
  }
  draw(dt: number, viewMatrix: glMatrix.mat4, projectionMatrix: glMatrix.mat4): void {
    glMatrix.mat4.multiply(
      this.absoluteModelMatrix,
      this.parent ? this.parent.absoluteModelMatrix : glMatrix.mat4.create(),
      this.modelMatrix
    )
    this.children.forEach((child) => child.draw(dt, viewMatrix, projectionMatrix))
  }

  addChild(child: Component): void {
    this.children.push(child)
  }

}

export { Component }
