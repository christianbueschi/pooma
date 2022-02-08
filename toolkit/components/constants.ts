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
  "🤷‍♂️<br>I don't know",
  " 🙅 <br>Impossible, we don't do that!",
  ' ☕ <br>I need a break',
];

export const T_SHIRT_SIZES = [
  '🐭 <br>Too small',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '🐘 <br>Too big',
  'I need a break ☕',
];

type Cards = {
  [key: string]: string[];
};

export const CARDS: Cards = {
  fibonacci: FIBONACCI_NUMBERS,
  tshirt: T_SHIRT_SIZES,
};
