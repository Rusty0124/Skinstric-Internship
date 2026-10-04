import { rankValues } from './rankValues';

describe('rankValues', () => {
  // shape copied from the Phase Two sample response in the brief
  const race = {
    black: 0.11956584717786628,
    white: 0.1280179046276461,
    'southeast asian': 0.06297961651829671,
    'south asian': 0.1425984353728242,
    'latino hispanic': 0.0619650872094126,
    'east asian': 0.2525825951799374,
    'middle eastern': 0.23229411391401664,
  };

  it('sorts scores highest first', () => {
    const scores = rankValues(race).map(([, s]) => s);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    expect(rankValues(race)[0][0]).toBe('east asian');
  });

  it('rounds every score to 2 decimal places', () => {
    expect(rankValues(race)).toEqual([
      ['east asian', 0.25],
      ['middle eastern', 0.23],
      ['south asian', 0.14],
      ['white', 0.13],
      ['black', 0.12],
      ['southeast asian', 0.06],
      ['latino hispanic', 0.06],
    ]);
  });

  // 0.0629 and 0.0619 both round to 0.06 — sorting before rounding keeps them in their real order
  it('orders near-ties by the raw score, not the rounded one', () => {
    const ranked = rankValues({ b: 0.0619, a: 0.0629 });
    expect(ranked.map(([label]) => label)).toEqual(['a', 'b']);
  });

  it('returns an empty list for an empty object', () => {
    expect(rankValues({})).toEqual([]);
  });
});
