import { FlexProps } from '@chakra-ui/react';

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
  `<em>🤷‍♀️</em><br>I don't know`,
  `<em>🙅</em><br>Impossible`,
  `<em>☕</em> <br>Break`,
];

export const T_SHIRT_SIZES = [
  `<em>🐭</em><br>Too Small`,
  'XS',
  'S',
  'M',
  'L',
  'XL',
  `<em>🐘</em><br>Too Big`,
  `<em>☕</em> <br>Break`,
];

export const CARDS = () => ({
  FIBONACCI: FIBONACCI_NUMBERS,
  TSHIRT: T_SHIRT_SIZES,
});

const BREAKPOINTS = [375, 576, 768, 992, 1200];

export const MQ = BREAKPOINTS.map((bp) => `@media (min-width: ${bp}px)`);

export const COOKIE_OPTIONS = {
  expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
  path: '/',
};

export const CARD_HEIGHT = ['100px', '130px', '150px'];

export const GENERIC_CARD_STYLES = (
  card: string | null,
  isFront: boolean
): FlexProps => ({
  fontSize:
    isFront && card && card.length > 3
      ? ['10px', '10px', '16px']
      : ['14px', '14px', '22px'],
  lineHeight:
    isFront && card && card.length > 3
      ? ['12px', '12px', '20px']
      : ['18px', '18px', '26px'],
  borderRadius: 'xl',
  padding: '12px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  css: {
    aspectRatio: '4/5',
    backfaceVisibility: 'hidden',

    'p em': {
      fontSize: '24px',
      fontStyle: 'normal',

      [MQ[1]]: {
        fontSize: '32px',
      },
      [MQ[2]]: {
        fontSize: '42px',
      },
    },
  },
});
