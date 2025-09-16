import { FlexProps } from '@chakra-ui/react';
import { TFunction } from 'next-i18next';

export const FIBONACCI_NUMBERS = (t: TFunction) => [
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
  `<em>🤷‍♀️</em><br>${t('cardIdk')}`,
  `<em>🙅</em><br>${t('cardImpossible')}`,
  `<em>☕</em> <br>${t('cardBreak')}`,
];

export const T_SHIRT_SIZES = (t: TFunction) => [
  `<em>🐭</em><br>${t('cardTooSmall')}`,
  'XS',
  'S',
  'M',
  'L',
  'XL',
  `<em>🐘</em><br>${t('cardTooBig')}`,
  `<em>☕</em> <br>${t('cardBreak')}`,
];

export const CARDS = (t: TFunction) => ({
  FIBONACCI: FIBONACCI_NUMBERS(t),
  TSHIRT: T_SHIRT_SIZES(t),
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
  sx: {
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
