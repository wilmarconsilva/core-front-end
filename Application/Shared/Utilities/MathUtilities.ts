/**
 * Rounds like the back-end `Math.Round(decimal, decimals)` in C#: half to even (banker's rounding).
 * The scaled value is normalized to 15 significant digits to absorb binary floating-point noise
 * (ex.: 1.005 * 100 = 100.49999999999999).
 */
export function roundHalfToEven(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  const scaled = Number((value * factor).toPrecision(15));
  const floor = Math.floor(scaled);
  const isMidpoint = Math.abs(scaled - floor - 0.5) < 1e-9;

  const rounded = isMidpoint
    ? (floor % 2 === 0 ? floor : floor + 1)
    : Math.round(scaled);

  return rounded / factor;
}
