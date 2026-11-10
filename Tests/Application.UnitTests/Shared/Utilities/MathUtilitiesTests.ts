import { roundHalfToEven } from '../../../../Application/Shared/Utilities/MathUtilities';

describe('roundHalfToEven', () => {
  it.each([
    [14999.4, 14999.4],
    [11000.555, 11000.56],
    [0.125, 0.12],
    [0.135, 0.14],
    [1.005, 1],
    [2.675, 2.68],
    [-0.125, -0.12],
    [10.123, 10.12],
    [10.127, 10.13],
  ])('RoundHalfToEven_%p_ArredondaComoOMathRoundDoBackEnd', (value, expected) => {
    expect(roundHalfToEven(value)).toBe(expected);
  });
});
