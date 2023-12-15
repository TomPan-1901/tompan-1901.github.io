import * as glMatrix from 'gl-matrix'
import type { RenderingContext } from './util'
abstract class GLComponent {
  children: GLComponent[] = []
  modelMatrix: glMatrix.mat4 = glMatrix.mat4.create()
  absoluteModelMatrix: glMatrix.mat4 = glMatrix.mat4.create()
  gl: RenderingContext
  parent: GLComponent | null
  constructor(gl: RenderingContext, parent: GLComponent | null = null) {
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

  addChild(child: GLComponent): void {
    this.children.push(child)
  }

}

export { GLComponent }
