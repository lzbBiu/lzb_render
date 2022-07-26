import { Model } from "../base/model";
import { Vector } from '../math/vector'
import { Vertex } from '../base/vertex';
import { ModelObject } from "../base/modelobject";
import { Color } from "../base/color";

export function imageDataParser(img: HTMLImageElement): ImageData {
    const width = img.width;
    const height = img.height;
    // 创建节点并挂载到 document 上的开销比引用节点进行计算的内存开销要大，需要卸载节点而非单纯取消引用
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    context.drawImage(img, 0, 0, width, height);
    return context.getImageData(0, 0, width, height);
}

/*
    v 0.000283538 -1 0.286843
    v -0.117277 -0.973564 0.306907
    ...
    # 1258 vertices

    vt  0.532 0.923 0.000
    vt  0.535 0.917 0.000
    ...
    # 1339 texture vertices

    vn  0.001 0.482 -0.876
    vn  -0.001 0.661 0.751
    ...
    # 1258 vertex normals

    g head
    s 1
    f 24/1/24 25/2/25 26/3/26
    f 24/1/24 26/3/26 23/4/23
    # 2492 faces

    v: 顶点信息，vn: 法向量, vt: 纹理坐标 f: 面信息
*/
export function objectTextParser(text: string) {
    let matKey = "default";
    text = text.replace(/\r/g, "");
    const lines = text.split("\n");

    const model = new Model();

    let line = undefined;
    let currentObjectNum = -1;
    let positions: Vector[] = [];
    let normals: Vector[] = [];
    let texcoords: Vector[] = [];
    let flag = false;
    for (let i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
      switch (true) {
        case line.startsWith("v "):
          if (!flag) {
            ++currentObjectNum;
            const obj = new ModelObject();
            model.addObj(obj);
            flag = true;
          }
          positions.push(Model.toVec4f(line, "v "));
          break;
        case line.startsWith("vt "):
          texcoords.push(Model.toVec3f(line, "vt"));
          break;
        case line.startsWith("vn "):
          normals.push(Model.toVec3f(line, "vn"));
          break;
        case line.startsWith("usemtl "):
          matKey = line.substring(7);
          break;
        case line.startsWith("f "):
          const face = Model.toFace(line, matKey);
          if (flag) {
            flag = false;
          }
          const obj = model.getObj(currentObjectNum);
          const mesh = obj.getMesh();
          const offset = mesh.VBO.length;
          for (let i = 0; i < 3; i++) {
            const vert = new Vertex();
            vert.position = positions[face.v[i] - 1];
            vert.color = new Color();

            if (face.n[i]) {
              vert.normal = normals[face.n[i] - 1];
            }
            if (face.t[i]) {
              vert.u = texcoords[face.t[i] - 1].x;
              vert.v = 1 - texcoords[face.t[i] - 1].y;
            }

            mesh.VBO.push(vert);
            mesh.EBO.push(offset + i);
          }
          break;
      }
    }
    return model;

}