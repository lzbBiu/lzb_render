import { Vector } from "../math/vector";
import { ModelObject } from "./modelobject";
import { Material } from "./matrial";
import { Color } from "./color";

class ObjFace {
  v: Array<number> = [];
  t: Array<number> = [];
  n: Array<number> = [];
  key: string = "";
}

export class Model {
  private _objects: ModelObject[];

  constructor() {
    this._objects = [];
  }

  addObj(obj: ModelObject): void {
    this._objects.push(obj);
  }

  getObj(index: number): ModelObject {
    return this._objects[index];
  }

  getObjs(): ModelObject[] {
    return this._objects;
  }

  setMaterial(index: number, mat: Material): void {
    this._objects[index].setMaterial(mat);
  }

  static toVec3f(line: string, key: string): Vector {
    line = line.substring(key.length);
    line = line.trim();
    const splits = line.split(" ");
    const x = parseFloat(splits[0]);
    const y = parseFloat(splits[1]);
    let z = 0;
    if (splits.length > 2) {
      z = parseFloat(splits[2]);
    }
    return new Vector(x, y, z);
  }

  static toVec4f(line: string, key: string): Vector {
    const vec4 = this.toVec3f(line, key);
    vec4.w = 1;
    return vec4;
  }

  static toFace(line: string, key: string): ObjFace {
    line = line.substring(2);
    const face = new ObjFace();
    face.key = key;
    let vers = line.split(" ");

    for (let i = 0; i < 3; i++) {
      const fsplit = vers[i].split("/");
      face.v.push(parseFloat(fsplit[0]));
      if (fsplit.length > 1) {
        face.t.push(parseFloat(fsplit[1]));
      }
      if (fsplit.length > 2) {
        face.n.push(parseFloat(fsplit[2]));
      }
    }
    return face;
  }
}