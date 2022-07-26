// 顶点
import { Vector } from "../math/vector";
import { Color } from "./color";

export class Vertex {
  //顶点坐标
  position: Vector;
  //法线
  normal: Vector;
  //切线空间下
  tangent: Vector;
  bitangent: Vector;
  //颜色
  color: Color;
  //uv
  u: number;
  v: number;

  constructor() {
    this.position = new Vector();
    this.color = new Color();
    this.normal = new Vector();
    this.u = 0;
    this.v = 0;
  }
}
