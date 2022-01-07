import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      green: string;
      greenDark: string;
      blue: string;
      grey: string;
      red: string;
      greyLight: string;
    };
    spacings: {
      4: string;
      8: string;
      12: string;
      16: string;
      24: string;
      32: string;
    };
  }
}
