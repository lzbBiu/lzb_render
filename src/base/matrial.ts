import { Texture } from "./texture";

export class Material {
  //纹理
  private _texture: Texture;

  getTexture(): Texture {
    return this._texture;
  }

  setTexture(texture: Texture): void {
    this._texture = texture;
  }
}
