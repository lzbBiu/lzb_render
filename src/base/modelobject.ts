import { Material } from "./matrial";
import { Vertex } from "../base/vertex";

class Mesh {
    //存放模型的顶点数据
    VBO: Vertex[];
    //顶点的索引顺序
    EBO: number[];

    constructor() {
      this.VBO = [];
      this.EBO = [];
    }
}

export class ModelObject {
  private _mesh: Mesh;
  private _material: Material;

  constructor() {
    this._mesh = new Mesh();
    this._material = new Material();
  }

  setMesh(mesh: Mesh): void {
    this._mesh = mesh;
  }

  setMaterial(mat: Material): void {
    this._material = mat;
  }

  getMesh(): Mesh {
    return this._mesh;
  }

  getMaterial(): Material {
    return this._material;
  }
}
