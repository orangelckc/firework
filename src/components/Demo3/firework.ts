import type { Star } from './types'

// 生成背景闪烁的星星
const generateStars = (num: number, wW: number, wH: number) => {
  const stars = <Star[]>[]
  for (let e = 0; e < num; e++) {
    const single = <Star>{}
    single.class = e % 20 == 0 ? "spark big-spark" : e % 9 == 0 ? "spark medium-spark" : "spark";
    single.style = {
      top: Math.round(Math.random() * wH) + 'px',
      left: Math.round(Math.random() * wW) + 'px',
      animationDuration: Math.round(Math.random() * 3000) + 3000 + 'ms',
      animationDelay: Math.round(Math.random() * 3000) + 'ms'
    }
    // vue不能直接append，要换个思路渲染
    stars.push(single)
  }
  return stars
};

// 烟花动画效果
const animationEffect = (spark: Spark) => {
  const interval = setTimeout(() => {
    animationEffect(spark)
  }, 25)

  const { fireworksObject, fireworksCanvas } = spark
  // 遮盖烟火轨迹
  fireworksObject.save();
  fireworksObject.fillStyle = "rgba(0,5,25,0.1)";
  fireworksObject.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  fireworksObject.restore();

  if (!spark.explode.dead) {
    // 绘制烟花轨迹
    spark.explode.move();
    spark.explode.drawLight();
  } else {
    // 有弹幕，绘制弹幕
    if (spark.drawText) {
      spark.drawText.paint();
    }
    // 到达终点后爆开
    spark.explode.explodes.forEach(ele => {

      if (!ele.dead) {
        // 绘制爆炸效果
        ele.moveTo();
      }
    });
    // 爆炸效果结束后，清除定时器
    if (spark.explode.explodes.every(ele => ele.dead)) {
      clearTimeout(interval)
    }
  }

}

// 烟花类
class Spark {
  x: number; // x坐标
  y: number; // y坐标
  r: number; // 烟花半径
  height: number; // 窗口高度
  width: number; // 窗口宽度
  fireworksCanvas: HTMLCanvasElement; // 烟花画布
  fireworksObject: CanvasRenderingContext2D; // 烟花画布上下文
  explode: Explode; // 爆炸点
  drawText?: DrawText; // 弹幕

  constructor(fireworksCanvas: HTMLCanvasElement, text = '', color = "#FFFFFF") {
    this.height = fireworksCanvas.height;
    this.width = fireworksCanvas.width;
    this.fireworksCanvas = fireworksCanvas;
    this.fireworksObject = fireworksCanvas.getContext("2d")!;
    this.x = Math.random() * this.width;
    this.y = Math.random() * 2 * this.height - this.height;
    this.r = Math.random();
    let x = getRandom(100, fireworksCanvas.width - 100);
    let y = getRandom(0, 400);
    this.explode = new Explode(
      fireworksCanvas,
      getRandom(0, this.width),
      getRandom(2, 4),
      color,
      { x, y }
    );

    // 如果有弹幕，绘制弹幕
    if (text !== '') {
      this.drawText = new DrawText(fireworksCanvas, x, y, text);
    }
  }
}

// 爆炸效果类
class Explode {
  explodes: Embellishment[]; // 爆炸效果数组
  x: number; // x坐标
  y: number; // y坐标
  r: number; // 烟花轨迹半径
  c: string; // 烟花颜色
  explodeArea: { x: number, y: number }; // 爆炸区域
  dead: boolean; // 是否结束
  ba: number; // 爆炸区域范围
  fireworksObject: CanvasRenderingContext2D; // canvas上下文

  constructor(fireworksCanvas: HTMLCanvasElement, x: number, r: number, c: string, explodeArea: { x: number, y: number }) {
    this.explodes = [];
    this.x = x;
    this.y = fireworksCanvas.height + r;
    this.r = r;
    this.c = c;
    this.explodeArea = explodeArea;
    this.dead = false;
    this.ba = getRandom(80, 200);
    this.fireworksObject = fireworksCanvas.getContext("2d")!;
  }
  // 绘制路径点
  paint() {
    this.fireworksObject.save();
    this.fireworksObject.beginPath();
    this.fireworksObject.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.fireworksObject.fillStyle = this.c;
    this.fireworksObject.fill();
    this.fireworksObject.restore();
  }
  // 移动轨迹
  move() {
    let dx = this.explodeArea.x - this.x,
      dy = this.explodeArea.y - this.y;
    this.x += dx * 0.01;
    this.y += dy * 0.01;
    if (Math.abs(dx) <= this.ba && Math.abs(dy) <= this.ba) {
      this.explode();
      this.dead = true;
      // 如果带有文字，绘制文字
    } else {
      this.paint();
    }
  }

  // 绘制路径点光晕
  drawLight() {
    this.fireworksObject.save();
    this.fireworksObject.fillStyle = "rgba(255,228,150,0.5)";
    this.fireworksObject.beginPath();
    this.fireworksObject.arc(this.x, this.y, this.r + 3 * Math.random() + 1, 0, 2 * Math.PI);
    this.fireworksObject.fill();
    this.fireworksObject.restore();
  }

  // 烟花爆炸效果
  explode() {
    // 爆炸散开的数量
    let embellishmentNum = getRandom(80, 120);
    // 散开的范围
    let fullRange = getRandom(100, 200);
    for (let i = 0; i < embellishmentNum; i++) {
      const color = {
        a: getRandom(128, 255),
        b: getRandom(128, 255),
        c: getRandom(128, 255),
      };
      let a = getRandom(-Math.PI, Math.PI);
      let x = getRandom(0, fullRange) * Math.cos(a) + this.x;
      let y = getRandom(0, fullRange) * Math.sin(a) + this.y;
      let radius = getRandom(0, 2);
      let embellishment = new Embellishment(this.fireworksObject, this.x, this.y, radius, color, x, y);
      this.explodes.push(embellishment);
    }
  }
}

// 爆开后散开效果类
class Embellishment {
  x: number; // 起点x坐标
  y: number; // 起点y坐标
  tx: number; // 终点x坐标
  ty: number; // 终点y坐标
  dead: boolean; // 是否结束
  radius: number; // 烟花半径
  color: any; // 烟花颜色
  fireworksObject: CanvasRenderingContext2D; // canvas上下文

  constructor(fireworksObject: CanvasRenderingContext2D, x: number, y: number, radius: number, color: any, tx: number, ty: number) {
    this.tx = tx;
    this.ty = ty;
    this.x = x;
    this.y = y;
    this.dead = false;
    this.radius = radius;
    this.color = color;
    this.fireworksObject = fireworksObject;
  }
  // 绘制路径点
  paint() {
    this.fireworksObject.save();
    this.fireworksObject.beginPath();
    this.fireworksObject.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.fireworksObject.fillStyle = `rgba(${this.color.a},${this.color.b},${this.color.c},1)`;
    this.fireworksObject.fill();
    this.fireworksObject.restore();
  }

  // 移动
  moveTo() {
    this.ty = this.ty + 0.3;
    let dx = this.tx - this.x,
      dy = this.ty - this.y;
    this.x = Math.abs(dx) < 0.1 ? this.tx : this.x + dx * 0.1;
    this.y = Math.abs(dy) < 0.1 ? this.ty : this.y + dy * 0.1;
    if (dx === 0 && Math.abs(dy) <= 80) {
      this.dead = true;
    }
    this.paint();
  }
}

// 绘制文字类
class DrawText {
  x: number; // x坐标
  y: number; // y坐标
  text: string; // 文字
  textCanvas: HTMLCanvasElement; // 文字canvas
  textObject: CanvasRenderingContext2D; // 文字canvas上下文

  constructor(textCanvas: HTMLCanvasElement, x: number, y: number, text: string) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.textCanvas = textCanvas;
    this.textObject = textCanvas.getContext('2d')!;
  }
  // 绘制文字
  paint() {
    this.textObject.save();
    this.textObject.font = "30px 宋体 bold";
    this.textObject.textAlign = "center";
    this.textObject.textBaseline = "middle";
    this.textObject.fillStyle = '#FFF'
    this.textObject.fillText(this.text, this.x, this.y);
    this.textObject.restore();
  }
}

// 生成a-b之间的随机数
const getRandom = (a: number, b: number) => {
  return Math.floor(Math.random() * (b - a) + a);
}

export {
  getRandom,
  generateStars,
  Spark,
  animationEffect
}
