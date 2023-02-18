import { Color } from './src/Color';
import { RunOscillatorDemo } from './src/OscillatorDemo';

// -----------------------------------------------------
// Based on https://www.youtube.com/watch?v=Y4tK1j9btbU
// by Project JDM https://www.youtube.com/@project_jdm
// -----------------------------------------------------

RunOscillatorDemo(document.getElementById('app')!, {
  // ---------------------
  // Render Attributes
  // ---------------------
  backgroundColor: Color.grey(0.1),
  backgroundEffectAmount: 0.25,
  borderColor: Color.grey(0.2),
  borderThickness: 0,

  layout: 'closedCircle', // can be 'circle' or 'line' or 'closedCircle'

  oscillatorDrawRadius: 4,
  oscillatorDrawBorderRadius: 1,

  // ---------------------
  // Simulation Attributes
  // ---------------------
  startTimeSeconds: 0,

  oscillatorCount: 144,
  periodSeconds: 8,

  oscillatorPeriodOffsetFactor: 1, // Amount each oscillator is slower than the previous
});
