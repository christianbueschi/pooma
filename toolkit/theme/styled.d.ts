import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      white: string;
      green: string;
      greenDark: string;
      blue: string;
      red: string;
      grey60: string;
      grey40: string;
      grey20: string;
    };
    spacings: {
      4: string;
      8: string;
      12: string;
      16: string;
      24: string;
      32: string;
    };
    borderRadius: {
      8: string;
    };
  }
}
