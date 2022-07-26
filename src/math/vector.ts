// 初始化向量与向量
export class Vector {
    x: number;
    y: number;
    z: number;
    w: number;
  
    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
      this.set(x, y, z, w);
    }
  
    set(x: number, y: number, z: number, w: number): void {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }

    // 单元化
    normalize(): Vector {
      let length = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
      if (length > 0) {
        length = 1 / Math.sqrt(length);
      }
      this.x *= length;
      this.y *= length;
      this.z *= length;
      this.w *= length;
      return this;
    }

    public standardized(): Vector {
        if (this.w === 0) {
            return;
        }
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;
        this.w = 1;

        return this;
    }
  }
  