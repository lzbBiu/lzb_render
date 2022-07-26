import { Vector } from "../math/vector";
export class Buffer {
    private buffer: Float32Array;

    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.buffer = new Float32Array(width * height * 4).fill(255);
    }


    public setColor(x: number, y: number, rgba: Vector) {
        const index = x + y * this.width;
        this.buffer[index * 4] = rgba.x;
        this.buffer[index * 4 + 1] = rgba.y;
        this.buffer[index * 4 + 2] = rgba.z;
        this.buffer[index * 4 + 3] = rgba.w;
    }

    public getFrameBuffer(): Float32Array {
        return this.buffer;
    }
}