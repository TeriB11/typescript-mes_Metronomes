import { Canvas } from './Canvas';
import { Color } from './Color';
import { Vec2 } from './Vec2';

export interface Actor {
  update(deltaTime: number, absoluteTime: number): void;
  render(canvas: Canvas): void;
}

export class SineOscillator {
  constructor(
    public readonly data: {
      amplitude: number;
      periodSeconds: number;
      phaseSeconds?: number;
      offset?: number;
      decayFactor?: number;
    }
  ) {}

  at(t: number): number {
    const { amplitude, periodSeconds, phaseSeconds, offset, decayFactor } =
      this.data;
    const x =
      amplitude *
        Math.sin((2 * Math.PI * t) / periodSeconds + (phaseSeconds ?? 0)) +
      (offset ?? 0);

    return decayFactor ? x * Math.exp(-decayFactor * t) : x;
  }
}

export class LineOscillator implements Actor {
  private pos: Vec2;
  private readonly ray: Vec2;

  get currentPosition() {
    return this.pos;
  }

  constructor(
    private readonly origin: Vec2,
    ray: Vec2,
    private readonly oscillator: SineOscillator,
    public readonly style: {
      color: Color;
      radius: number;
      borderRadius: number;
    }
  ) {
    this.ray = ray.normalized();
    this.pos = origin;
  }

  update(deltaTime: number, absoluteTime: number) {
    const m = this.oscillator.at(absoluteTime);
    this.pos = this.origin.add(this.ray.scale(m));
  }

  render(canvas: Canvas) {
    if (this.style.borderRadius) {
      canvas.drawCircle(
        this.pos,
        this.style.radius + this.style.borderRadius,
        Color.grey(0.2),
        'stroke'
      );
    }
    canvas.drawCircle(this.pos, this.style.radius, this.style.color);
  }
}
