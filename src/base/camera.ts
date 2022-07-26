import { Vector } from "../math/vector"
import { vectorSub, vectorCross, matrixMul } from '../math/calculate';
import { Matrix } from "../math/matrix";
export class Camera {
    position: Vector;
    direct: Vector;
    up: Vector;

    // 摄像机分辨率
    private readonly width: number;
    private readonly height: number;

    near: number = -1;
    far: number = -100;

    private fov: number = 45;

    constructor(width: number, height: number) {
        this.position = new Vector(0, 3, 5, 1);
        this.direct = new Vector(0, 0, -1);
        this.up = new Vector(0, 1, 0);
        this.width = width;
        this.height = height;
    }

    public lookAt(at: Vector): this {
        this.direct = vectorSub(new Vector(this.position.x, this.position.y, this.position.z), at);
        this.direct.normalize();
        return this;
    }

    public getViewMat(): Matrix {
        /*
            相机看向物体方向 g: this.direct
            相机向上方向 t: this.up
            屏幕位置( 原点 ) e: this.position.xyz
        
        
        */

        const w = this.direct;

        const u = vectorCross(this.up, w);

        u.normalize();

        const v = vectorCross(w, u);

        const rotateMat = new Matrix().setAll(
            u.x, u.y, u.z, 0,
            v.x, v.y, v.z, 0,
            w.x, w.y, w.z, 0,
            0, 0, 0, 1,
        );

        const moveMat = new Matrix().setAll(
            1, 0, 0, -this.position.x,
            0, 1, 0, -this.position.y,
            0, 0, 1, -this.position.z,
            0, 0, 0, 1
        );
            console.log('moveMat is :', moveMat, 'rotateMat is :', rotateMat)
        return matrixMul(moveMat, rotateMat);
    }

    /**
     * 获取正交矩阵 / 正射投影视体
     */
     public getOrthographicMat(): Matrix {
        /**
         * tan(fov/2) = t / n
         */
        const t = Math.tan(this.fov / 360 * 2 * Math.PI / 2) * Math.abs(this.near);
        const b = -t;
        /**
         *  nx     r
         * ---- = ---
         *  ny     t
         */
        const r = (this.width / this.height) * t;
        const l = -r;

        const n = this.near;
        const f = this.far;

        /**
         * 正交矩阵, 将矩阵移动缩放到lrtbnf方块内
         */
        const matOrt = new Matrix().setAll(
            2 / (r - l), 0, 0, -(r + l) / (r - l),
            0, 2 / (t - b), 0, -(t + b) / (t - b),
            0, 0, 2 / (n - f), -(n + f) / (n - f),
            0, 0, 0, 1,
        );

        return matOrt;
    }

    public getProjectionMat():Matrix {
        const n = this.near;
        const f = this.far;

        return new Matrix().setAll(
            n, 0, 0, 0,
            0, n, 0, 0,
            0, 0, n + f, -f * n,
            0, 0, 1, 0,
        )
    }

}