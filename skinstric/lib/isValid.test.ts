import { isValid } from './isValid';

describe('isValid', () => {
  it('rejects empty and whitespace-only input', () => {
    expect(isValid('')).toBe(false);
    expect(isValid('   ')).toBe(false);
  });

  it('rejects numbers, alone or mixed in', () => {
    expect(isValid('123')).toBe(false);
    expect(isValid('John1')).toBe(false);
    expect(isValid('New York 2')).toBe(false);
  });

  it('rejects symbols', () => {
    expect(isValid('John!')).toBe(false);
    expect(isValid('<script>')).toBe(false);
  });

  it('accepts plain names and multi-word places', () => {
    expect(isValid('John')).toBe(true);
    expect(isValid('John Doe')).toBe(true);
    expect(isValid('New York')).toBe(true);
  });

  // pins the current trade-off from the comment in isValid.ts — flip these if the regex is ever loosened
  it('rejects accents and hyphens', () => {
    expect(isValid('São Paulo')).toBe(false);
    expect(isValid('Winston-Salem')).toBe(false);
  });
});
