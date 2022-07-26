import { Vector } from "../math/vector";

/**
 * 用32个二进制来保存rgba值, 即 4字节 无符号int类型
 * 0000 0000 | 0000 0000 | 0000 0000 | 0000 0000
 *    alpha  |   blue    |   green   |    red
 * @param r [00-08) 位
 * @param g [08-16) 位
 * @param b [16-24) 位
 * @param a [24-32) 位
 */
export class Color extends Vector {
  static WHITE = new Color(255, 255, 255, 255);
  static BLACK = new Color(0, 0, 0, 255);
  static RED = new Color(255, 0, 0, 255);
  static GREEN = new Color(0, 255, 0, 255);
  static BLUE = new Color(0, 0, 255, 255);

  private _val: number = 0;

  get r(): number {
    return this.x;
  }

  set r(v: number) {
    this.x = v;
  }

  get g(): number {
    return this.y;
  }

  set g(v: number) {
    this.y = v;
  }

  get b(): number {
    return this.z;
  }

  set b(v: number) {
    this.z = v;
  }

  get a(): number {
    return this.w;
  }

  set a(v: number) {
    this.w = v;
  }

  setColor(col: Color): Color {
    this.set(col.r, col.g, col.b, col.a);
    return this;
  }

  add(col: Color): Color {
    let res = new Color();
    res.r = this.r + col.r;
    res.g = this.g + col.g;
    res.b = this.b + col.b;
    res.a = this.a;
    return res;
  }

  add4(col: Color): Color {
    let res = new Color();
    res.r = this.r + col.r;
    res.g = this.g + col.g;
    res.b = this.b + col.b;
    res.a = this.a + col.a;
    return res;
  }

  mul3(num: number): Color {
    this.r *= num;
    this.g *= num;
    this.b *= num;
    return this;
  }

  mul4(num: number): Color {
    this.r *= num;
    this.g *= num;
    this.b *= num;
    this.a *= num;
    return this;
  }

  div3(num: number): Color {
    if (num != 0) {
      this.r /= num;
      this.g /= num;
      this.b /= num;
    }
    return this;
  }

  mulColor(col: Color): Color {
    this.r *= col.r / 255;
    this.g *= col.g / 255;
    this.b *= col.b / 255;
    return this;
  }

  clone(): Color {
    const col = new Color();
    col.setColor(this);
    return col;
  }

  toVector(): Vector {
    const { r, g, b, a } = this;
    return new Vector(r, g, b, a);
  }
}
