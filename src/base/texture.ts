import { Vector } from "../math/vector";

export class Texture {
    private img: ImageData = undefined;

    constructor(data?: ImageData) {
        if (data) {
            this.setImageData(data);
        }
    }

    public setImageData(data: ImageData): void {
        if (!data || !(data instanceof ImageData)) {
            console.error("set image data error, data is invalid, data: ", data);
            return;
        }
        this.img = data;
    }

    public getWidth(): number {
        if (!this.img) {
            return 0;
        }
        return this.img.width;
    }

    public getHeight(): number {
        if (!this.img) {
            return 0;
        }
        return this.img.height;
    }

    public getColorByUV(u: number, v: number, out?: Vector): Vector {
        if (!this.img) {
            return new Vector(0, 0, 0, 1);
        }

        u = u - Math.floor(u);
        v = v - Math.floor(v);

        const w = this.getWidth(), h = this.getHeight();
        const x = Math.round(w * u);
        const y = Math.round(h * v);
        const i = (y * w + x) * 4;
        const data = this.img.data;

        if (!out) {
            out = new Vector();
        }
        out.set(data[i], data[i + 1], data[i + 2], data[i + 3]);
        return out;
    }
}