/**
 * Otağa qoşulan anonim istifadəçilər üçün dostyana, təsadüfi ad generatoru
 * ("Cəld Tülkü" kimi). Ad localStorage-də saxlanılır ki, təkrar ziyarətdə sabit qalsın.
 */

const ADJECTIVES = [
  'Cəld',
  'Sakit',
  'Parlaq',
  'Cəsur',
  'Xəyalpərəst',
  'İti',
  'Mehriban',
  'Zərif',
  'Odlu',
  'Sərin',
];

const ANIMALS = [
  'Tülkü',
  'Pələng',
  'Bayquş',
  'Qartal',
  'Delfin',
  'Canavar',
  'Pərvanə',
  'Ayı',
  'Şahin',
  'Panda',
];

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Yeni təsadüfi görünən ad yaradır. */
export function generateName(): string {
  return `${randomFrom(ADJECTIVES)} ${randomFrom(ANIMALS)}`;
}
