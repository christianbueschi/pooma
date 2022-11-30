export const Background =
  'linear-gradient(115.05359506937327deg, rgba(2, 27, 62,1) 7.867559523809524%,rgba(81, 119, 149,1) 47.874007936507944%,rgba(2, 27, 62,1) 89.23660714285714%)';

export const FIBONACCI_NUMBERS = [
  '0',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '21',
  '34',
  '55',
  '89',
  '144',
  "<em>🤷‍♀️</em><br>I don't know",
  "<em>🙅</em><br>Impossible, we don't do that!",
  '<em>☕</em> <br>I need a break',
];

export const T_SHIRT_SIZES = [
  '<em>🐭</em><br>Too small',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '<em>🐘</em><br>Too big',
  '<em>☕</em><br>I need a break',
];

type Cards = {
  [key: string]: string[];
};

export const CARDS: Cards = {
  FIBONACCI: FIBONACCI_NUMBERS,
  TSHIRT: T_SHIRT_SIZES,
};

const BREAKPOINTS = [375, 576, 768, 992, 1200];

export const MQ = BREAKPOINTS.map((bp) => `@media (min-width: ${bp}px)`);

export const COOKIE_OPTIONS = {
  expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
  path: '/',
};
