/*
    1. 资源加载
    2. 向量、矩阵等数学工具
    3. obj 创建，文件解析、纹理 uv 读取
    4. 相机初始化，计算变换矩阵
    5. 创建 z buffer
    8. 盒包围模型、重心坐标计算、抗锯齿
    9. 光栅化
*/

import african from "./resources/african_head.obj";
import africanImg from "./resources/african_head_diffuse.png";

import { Matrix } from './math/matrix';
import { matrixMul, getBoundBox, barycentricCalculate, vectorMulMatrix } from './math/calculate';
import { Texture } from './base/texture';
import { Material } from './base/matrial';
import { loadObjText, loadImg } from './util/load';
import { objectTextParser, imageDataParser } from './util/parser';
import { Camera } from './base/camera';
import { Vector } from './math/vector';
import { ZBuffer } from "./base/zBuffer";
import { Buffer } from "./base/Buffer";

async function renderObj() {

    // 资源加载
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const objString = await loadObjText(african);
    const img = await loadImg(africanImg);
    const model = objectTextParser(objString);
    const imgData = imageDataParser(img);
    const texture = new Texture();
    texture.setImageData(imgData);
    const material = new Material();
    material.setTexture(texture);
    model.setMaterial(0, material);


    // 初始化相机与 buffer 初始化
    const camera = new Camera(canvas.width, canvas.height).lookAt(new Vector(0, 0, 0));
    const zBuffer = new ZBuffer(canvas.width, canvas.height);
    zBuffer.clear();
    const buffer = new Buffer(canvas.width, canvas.height);

    // mesh 数据
    const vbo = model.getObj(0).getMesh().VBO;
    const ebo = model.getObj(0).getMesh().EBO;

    // 变换矩阵

    // 模型变换: 缩放并移动
    const modelMat = new Matrix().setAll(
        1, 0, 0, 0,
        0, 1, 0, 1,
        0, 0, 1, 0,
        0, 0, 0, 1,
    );

    // 相机变化
    const viewMat = camera.getViewMat();

    // 正交
    const orthographic = camera.getOrthographicMat()

    // 投影变换
    const projectionMat = camera.getProjectionMat();

    // 视口变换
    const viewPortMatrix = new Matrix().setAll(
        canvas.width / 2, 0, 0, canvas.width / 2,
        0, -canvas.height / 2, 0,  canvas.height / 2,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    let mvp = matrixMul(modelMat, viewMat);
    mvp = matrixMul(mvp, projectionMat);

    for (let i = 0; i < ebo.length; i += 3) {
        const v1 = vbo[ebo[i]];
        const v2 = vbo[ebo[i + 1]];
        const v3 = vbo[ebo[i + 2]];

        const p1 = vectorMulMatrix(vectorMulMatrix(v1.position, mvp), orthographic);
        const p2 = vectorMulMatrix(vectorMulMatrix(v2.position, mvp), orthographic);
        const p3 = vectorMulMatrix(vectorMulMatrix(v3.position, mvp), orthographic);

        const windowP1 = vectorMulMatrix(p1, viewPortMatrix);
        const windowP2 = vectorMulMatrix(p2, viewPortMatrix);
        const windowP3 = vectorMulMatrix(p3, viewPortMatrix);

        const z0 = windowP1.w;
        const z1 = windowP2.w;
        const z2 = windowP3.w;

        windowP1.standardized();
        windowP2.standardized();
        windowP3.standardized();

        // 盒包围模型计算
        const boundBox = getBoundBox(canvas.width, canvas.height, windowP1, windowP2, windowP3);
        let currX = 0;
        let currY = 0;

        for (let x = boundBox.minX; x < boundBox.maxX; x++) {
            for (let y = boundBox.minY; y < boundBox.maxY; y++) {
                currX = x + 0.5;
                currY = y + 0.5;
                const barycentric = barycentricCalculate(currX, currY, windowP1, windowP2, windowP3);
                // 通过差值计算出当前像素位于三个顶点内
                if (barycentric.x > 0 && barycentric.y > 0 && barycentric.z > 0) {
                    const currZ = windowP1.z * barycentric.x + windowP2.z * barycentric.y + windowP3.z * barycentric.z;

                    if (!zBuffer.zTest(x, y, currZ)) {
                        continue;
                    }

                    zBuffer.setZ(x, y, currZ);

                    let z = 1 / z0 * barycentric.x + 1 / z1 * barycentric.y + 1 / z2 * barycentric.z;
                    z = 1 / z;

                    const alpha = barycentric.x / z0 * z;
                    const beta =  barycentric.y / z1 * z;
                    const gamma =  barycentric.z / z2 * z;

                    const color = texture.getColorByUV(v1.u * alpha + v2.u * beta + v3.u * gamma, v1.v * alpha + v2.v * beta + v3.v * gamma);

                    buffer.setColor(x, y, color);
                }
            }
        }
    }

    const resImgData = context.getImageData(0, 0, canvas.width, canvas.height);

    for(let a = 0; a < buffer.getFrameBuffer().length; a++) {
        resImgData.data[a] = buffer.getFrameBuffer()[a];
    }

    context.putImageData(resImgData, 0, 0);
}

renderObj();