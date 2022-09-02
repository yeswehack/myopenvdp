import Jimp from 'jimp';

class Captcha {
  #value = '';
  #width: number;
  #height: number;
  #image?: Jimp;
  constructor(width = 200, height = 56, length = 6) {
    this.#width = width;
    this.#height = height;
    while (this.#value.length != length) {
      this.#value = randomText(length);
    }
  }

  async #getImage(): Promise<Jimp> {
    if (!this.#image) {
      const image = new Jimp(this.#width, this.#height, 'white');
      let circleRadius = Math.max(this.#width, this.#height);
      for (let i = 0; i < 10; i++) {
        const circle = new Jimp(this.#width, this.#height, 'white');
        scanCircle(
          circle,
          Math.round(Math.random() * this.#width),
          Math.round(Math.random() * this.#height),
          circleRadius,
          makeIteratorThatFillsWithColor(circle, 0x000000ff)
        );
        image.composite(circle, 0, 0, {
          mode: Jimp.BLEND_DIFFERENCE,
          opacitySource: 1.0,
          opacityDest: 1.0,
        });
        circleRadius = Math.round(circleRadius * 0.75);
      }
      const text = new Jimp(this.#width, this.#height, 'white');
      const fontName = Jimp.FONT_SANS_32_BLACK;
      await Jimp.loadFont(fontName).then((font) => {
        const textWidth = Jimp.measureText(font, this.#value);
        const textHeight = Jimp.measureTextHeight(font, this.#value, this.#width);
        text.print(
          font,
          Math.round((this.#width - textWidth) / 2),
          Math.round((this.#height - textHeight) / 2),
          this.#value
        );
      });
      image.composite(text, 0, 0, {
        mode: Jimp.BLEND_DIFFERENCE,
        opacitySource: 1.0,
        opacityDest: 0.9,
      });
      const overlay = new Jimp(this.#width - 2, this.#height - 2, 'white');
      image.composite(overlay, 1, 1, {
        mode: Jimp.BLEND_DIFFERENCE,
        opacitySource: 1.0,
        opacityDest: 1.0,
      });
      this.#image = image;
    }
    return Promise.resolve(this.#image);
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }

  getValue() {
    return this.#value;
  }

  async getDataURL(mime = 'image/png') {
    return await (await this.#getImage()).getBase64Async(mime);
  }
}

const makeIteratorThatFillsWithColor = (image: Jimp, color: number) => (_x: number, _y: number, offset: number) =>
  image.bitmap.data.writeUInt32BE(color, offset);

const scanCircle = (
  image: Jimp,
  x: number,
  y: number,
  radius: number,
  iterator: (x: number, y: number, offset: number) => void
) =>
  image.scan(x - radius, y - radius, radius * 2, radius * 2, function (pixX, pixY, idx) {
    if (
      pixX >= 0 &&
      pixY >= 0 &&
      pixX < image.getWidth() &&
      pixY < image.getHeight() &&
      Math.pow(pixX - x, 2) + Math.pow(pixY - y, 2) < radius * radius
    ) {
      iterator(pixX, pixY, idx);
    }
  });

const randomText = (length: number) =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]|[gkqr]+/gi, '')
    .substring(0, length)
    .toUpperCase();

export default Captcha;
