// 矩阵
import { Vector } from "./vector";

export class Matrix {
  private data: Float32Array;

  constructor() {
    this.data = new Float32Array(16).fill(0);
  }

  public set(index: number, v: number): void {
    this.data[index] = v;
  }

  public get(index: number): number {
      return this.data[index];
  }

  setAll(a: number, b: number, c: number, d: number, 
      e: number, f: number, g: number, h: number, 
      i: number, j: number, k: number, l: number, 
      m: number, n: number, o: number, p: number): Matrix {
        this.data[0] = a;
        this.data[1] = b;
        this.data[2] = c;
        this.data[3] = d;
        this.data[4] = e;
        this.data[5] = f;
        this.data[6] = g;
        this.data[7] = h;
        this.data[8] = i;
        this.data[9] = j;
        this.data[10] = k;
        this.data[11] = l;
        this.data[12] = m;
        this.data[13] = n;
        this.data[14] = o;
        this.data[15] = p;

        return this;
  }

  getAll(): Float32Array {
    return this.data;
  }

}
