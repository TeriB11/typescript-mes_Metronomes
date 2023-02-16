import { Color } from './Color';
import { Vec2 } from './Vec2';

export class Canvas {
  private readonly context: CanvasRenderingContext2D;

  constructor(
    public readonly width: number,
    public readonly height: number,
    private readonly containerElement: HTMLElement
  ) {
    const canvas: HTMLCanvasElement = document.createElement(
      'canvas'
    ) as HTMLCanvasElement;
    containerElement.appendChild(canvas);

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;

    this.context = canvas.getContext('2d')!;
    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  get midpoint(): Vec2 {
    return new Vec2(this.width / 2, this.height / 2);
  }

  get inscribedRadius(): number {
    return Math.min(this.width, this.height) / 2;
  }

  get curcumscribedRadius(): number {
    const x = this.width / 2;
    const y = this.height / 2;
    return Math.sqrt(x * x + y * y);
  }

  clear(color: Color) {
    this.context.fillStyle = color.hexString();
    this.context.fillRect(0, 0, this.width, this.height);
  }

  drawCircle(
    origin: Vec2,
    radius: number,
    color: Color,
    mode: 'fill' | 'stroke' = 'fill'
  ) {
    this.context.beginPath();
    this.context.ellipse(origin.x, origin.y, radius, radius, 0, 0, Math.PI * 2);

    if (mode === 'fill') {
      this.context.fillStyle = color.hexString();
      this.context.fill();
    } else {
      this.context.strokeStyle = color.hexString();
      this.context.stroke();
    }
  }

  drawPoint(pt: Vec2, color: Color) {
    this.context.fillStyle = color.hexString();
    this.context.fillRect(pt.x, pt.y, 1, 1);
  }

  drawRect(
    pt: Vec2,
    width: number,
    height: number,
    color: Color,
    position: 'centered' | 'origin' = 'origin'
  ) {
    this.context.fillStyle = color.hexString();
    if (position === 'centered') {
      this.context.fillRect(pt.x - width / 2, pt.y - height / 2, width, height);
    } else {
      this.context.fillRect(pt.x, pt.y, width, height);
    }
  }

  runRenderLoop(
    tickTime: number,
    fn: (deltaTime: number, absoluteTime: number) => void,
    startTimeOffset?: number
  ) {
    const startTime = Date.now();
    let lastTime = startTime;

    window.setInterval(() => {
      const time = Date.now() - startTime;
      const dt = time - lastTime;
      lastTime = time;

      fn(dt / 1000, time / 1000 + (startTimeOffset ?? 0));
    }, tickTime);
  }
}
