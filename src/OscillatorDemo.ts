import { Actor, LineOscillator, SineOscillator } from './Actor';
import { Canvas } from './Canvas';
import { Color } from './Color';
import { Vec2 } from './Vec2';

export type DemoConfig = {
  backgroundColor: Color;
  backgroundEffectAmount: number;
  borderColor: Color;
  borderThickness: number;

  layout: 'circle' | 'closedCircle' | 'line';

  oscillatorCount: number;
  periodSeconds: number;

  startTimeSeconds: number;
  oscillatorDrawRadius: number;
  oscillatorDrawBorderRadius: number;
  oscillatorPeriodOffsetFactor: number; // Amount each oscillator is slower than the previous
};

export function RunOscillatorDemo(element: HTMLElement, config: DemoConfig) {
  const canvas = new Canvas(400, 400, element);

  const textElement = document.createElement('div');
  element.appendChild(textElement);

  const oscillatorAmplitude =
    canvas.inscribedRadius -
    config.oscillatorDrawRadius -
    config.borderThickness;

  const actors: LineOscillator[] = Array.from(
    { length: config.oscillatorCount },
    (_, idx) => {
      const iterFraction = idx / config.oscillatorCount;

      let origin = canvas.midpoint;
      let ray = Vec2.polar(2 * Math.PI * iterFraction);

      if (config.layout === 'line') {
        //fraction of cylinder height to position this oscillator
        const yOffset =
          config.oscillatorDrawRadius +
          iterFraction * (canvas.height - 2 * config.oscillatorDrawRadius);
        origin = new Vec2(canvas.width / 2, yOffset);
        //unit y vec
        ray = new Vec2(1, 0);
      }

      const decayIndex =
        config.layout === 'closedCircle'
          ? (config.oscillatorCount / 2) *
            (1 - Math.abs((2 * idx) / config.oscillatorCount - 1))
          : idx;

      const freq = decayIndex / (config.periodSeconds * config.oscillatorCount);
      const period = 1 / freq;

      const projectOntoSquare = false;
      const ang = ray.normalized().polarAngleRad();
      const amplitudeX = Math.abs(Math.cos(ang));
      const amplitudeY = Math.abs(Math.sin(ang));
      const n = projectOntoSquare ? 1 / Math.max(amplitudeX, amplitudeY) : 1;

      return new LineOscillator(
        origin,
        ray,
        new SineOscillator({
          amplitude: oscillatorAmplitude * n,
          periodSeconds: period,
          phaseSeconds: 0,
          offset: 0,
        }),
        {
          color: Color.fromHSV(iterFraction, 1, 1),
          radius: config.oscillatorDrawRadius,
          borderRadius: config.oscillatorDrawBorderRadius,
        }
      );
    }
  );

  canvas.runRenderLoop(
    1000 / 60,
    (deltaTime, absoluteTime) => {
      textElement.innerText = `Time: ${
        Math.floor(absoluteTime * 100 + 0.5) / 100
      }`;

      canvas.clear(config.backgroundColor);

      if (config.layout === 'circle') {
        canvas.drawCircle(
          canvas.midpoint,
          canvas.inscribedRadius,
          config.borderColor
        );
        canvas.drawCircle(
          canvas.midpoint,
          canvas.inscribedRadius - config.borderThickness,
          config.backgroundColor
        );
      }

      for (const actor of actors) {
        actor.update(deltaTime, absoluteTime);
      }

      const rectDim = 3;

      for (let x = 0; x <= canvas.width; x += rectDim) {
        for (let y = 0; y <= canvas.height; y += rectDim) {
          const pt = new Vec2(x + 0.5, y + 0.5);

          let color = Color.black;
          if (config.backgroundEffectAmount) {
            let totalFactor = 0;

            for (const actor of actors) {
              const d2 = actor.currentPosition.distanceSquared(pt);
              const factor = Math.pow(1 / (d2 === 0 ? 0.001 : d2), 2);

              totalFactor += factor;
              color = color.add(actor.style.color.scale(factor));
            }

            const h = Math.min(
              1,
              pt.sub(canvas.midpoint).magnitude() / canvas.curcumscribedRadius
            );

            color = color
              .scale(((1 - h) * 3) / totalFactor)
              .clamp()
              .scale(0.4);

            color = config.backgroundColor.lerp(
              color.lerp(color.greyscale(), 0.75),
              config.backgroundEffectAmount
            );
          } else {
            color = config.backgroundColor;
          }

          canvas.drawRect(pt, rectDim * 1.5, rectDim * 1.5, color, 'centered');
        }
      }

      for (const actor of actors) {
        actor.render(canvas);
      }
    },
    config.startTimeSeconds
  );
}
