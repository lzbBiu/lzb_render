import { Vector } from "./vector";
import { Matrix } from "./matrix";
// 向量加法
export function vectorAdd (v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
}
// 向量减法
export function vectorSub (v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
}
// 向量点乘：获取 A 向量在 B 向量上的投影

// 向量叉乘：两个向量求另一垂直向量
export function vectorCross(v1: Vector, v2: Vector): Vector {
    return new Vector(
        v1.y * v2.z - v1.z * v2.y,
        v1.z * v2.x - v1.x * v2.z,
        v1.x * v2.y - v1.y * v2.x,
        0
    )
}

// 矩阵点乘
export function matrixMul(a: Matrix, b: Matrix): Matrix {
    const out = new Matrix();
    const a00 = a.get(0),
            a01 = a.get(1),
            a02 = a.get(2),
            a03 = a.get(3),
            a10 = a.get(4),
            a11 = a.get(5),
            a12 = a.get(6),
            a13 = a.get(7),
            a20 = a.get(8),
            a21 = a.get(9),
            a22 = a.get(10),
            a23 = a.get(11),
            a30 = a.get(12),
            a31 = a.get(13),
            a32 = a.get(14),
            a33 = a.get(15);

        let b0 = b.get(0),
            b1 = b.get(1),
            b2 = b.get(2),
            b3 = b.get(3);
        out.set(0, b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30);
        out.set(1, b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31);
        out.set(2, b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32);
        out.set(3, b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33);

        b0 = b.get(4);
        b1 = b.get(5);
        b2 = b.get(6);
        b3 = b.get(7);
        out.set(4, b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30);
        out.set(5, b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31);
        out.set(6, b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32);
        out.set(7, b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33);

        b0 = b.get(8);
        b1 = b.get(9);
        b2 = b.get(10);
        b3 = b.get(11);
        out.set(8, b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30);
        out.set(9, b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31);
        out.set(10, b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32);
        out.set(11, b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33);

        b0 = b.get(12);
        b1 = b.get(13);
        b2 = b.get(14);
        b3 = b.get(15);
        out.set(12, b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30);
        out.set(13, b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31);
        out.set(14, b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32);
        out.set(15, b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33);
        return out;
}
// 向量点乘矩阵
export function vectorMulMatrix(vec: Vector, mat: Matrix): Vector {
    const calMat = mat.getAll();
    const x =
        calMat[0] * vec.x +
        calMat[1] * vec.y +
        calMat[2] * vec.z +
        calMat[3] * vec.w;
    const y =
        calMat[4] * vec.x +
        calMat[5] * vec.y +
        calMat[6] * vec.z +
        calMat[7] * vec.w;
    const z =
        calMat[8] * vec.x +
        calMat[9] * vec.y +
        calMat[10] * vec.z +
        calMat[11] * vec.w;
    const w =
        calMat[12] * vec.x +
        calMat[13] * vec.y +
        calMat[14] * vec.z +
        calMat[15] * vec.w;
    return new Vector(x, y, z, w);
}
// 重心坐标
export function cross(x1: number, y1: number, x2: number, y2: number): number {
    return x1 * y2 - x2 * y1;
}
export function barycentricCalculate(x: number, y: number, v1: Vector, v2: Vector, v3: Vector): Vector {
    const s = cross(v2.x - v1.x, v2.y - v1.y, v3.x - v1.x, v3.y - v1.y) / 2;
    if (s === 0) {
      return new Vector(-1, -1, -1);
    }

    const alpha = cross(x - v2.x, y - v2.y, x - v3.x, y - v3.y) / 2 / s;
    const beta = cross(x - v3.x, y - v3.y, x - v1.x, y - v1.y) / 2 / s;
    const gamma = 1 - alpha - beta;
    return new Vector(alpha, beta, gamma, 0);
}

class BoudBox {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

export function getBoundBox(width: number, height: number, p0: Vector, p1: Vector, p2: Vector): BoudBox {
    const boundBox = new BoudBox();

    boundBox.minX = Math.min(p0.x, p1.x, p2.x);
    if (boundBox.minX < 0) {
        boundBox.minX = 0;
    }

    boundBox.maxX = Math.max(p0.x, p1.x, p2.x);
    if (boundBox.maxX > width) {
        boundBox.maxX = width;
    }

    boundBox.minY = Math.min(p0.y, p1.y, p2.y);
    if (boundBox.minY < 0) {
        boundBox.minY = 0;
    }

    boundBox.maxY = Math.max(p0.y, p1.y, p2.y);
    if (boundBox.maxY > height) {
        boundBox.maxY = height;
    }

    boundBox.minX = Math.round(boundBox.minX);
    boundBox.maxX = Math.round(boundBox.maxX);
    boundBox.minY = Math.round(boundBox.minY);
    boundBox.maxY = Math.round(boundBox.maxY);

    return boundBox;
}