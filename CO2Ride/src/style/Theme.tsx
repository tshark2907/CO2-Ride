import { ReactNode } from 'react'
import { DefaultTheme, ThemeProvider } from 'styled-components'

const round = (num: number) =>
    num
        .toFixed(7)
        .replace(/(\.[0-9]+?)0+$/, '$1')
        .replace(/\.0$/, '')
const rem = (px: number) => `${round(px / 16)}rem`

export const theme: DefaultTheme = {
    colors: {
        white: '#FFFFFF', black: '#312b33', black_translucid: 'rgba(0,0,0,0.8)',
        red: '#E03131',
        orange: '#ff8b33',
        yellow: '#FCC419',
        green: '#59b159',
        teal: '#83e35a',
        light_green: '#93df75',
        cyan: '#5ee8f0',
        blue: '#006472',
        indigo: '#4263Eb',
        purple: '#9B1E5F',
        darkpurple: '#6A4A74',
        darkpink: '#BC8F8F',
        pink: '#ac3cc9',
        gray100: '#FAFAFA',
        gray200: '#E9ECEF',
        gray300: '#DEE2E6',
        gray400: '#CED4DA',
        gray500: '#A4ACB4',
        gray600: '#64666B',
        gray700: '#424449',
        gray800: '#1D1E21',
        gray900: '#141518',
        darkergray: '#57636C',
        primary: '#93CA3C',
        secondary: '#75787b',
        greengradient: `background: hsla(97, 69%, 78%, 1);
        background: linear-gradient(45deg, hsla(97, 69%, 78%, 1) 0%, hsla(118, 78%, 23%, 1) 100%);
        background: -moz-linear-gradient(45deg, hsla(97, 69%, 78%, 1) 0%, hsla(118, 78%, 23%, 1) 100%);
        background: -webkit-linear-gradient(45deg, hsla(97, 69%, 78%, 1) 0%, hsla(118, 78%, 23%, 1) 100%);
        filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#BFEEA2", endColorstr="#10690D", GradientType=1 );`,
        bluegradient: `background: hsla(186, 66%, 40%, 1);
        background: linear-gradient(90deg, hsla(186, 66%, 40%, 1) 0%, hsla(188, 78%, 69%, 1) 100%);
        background: -moz-linear-gradient(90deg, hsla(186, 66%, 40%, 1) 0%, hsla(188, 78%, 69%, 1) 100%);
        background: -webkit-linear-gradient(90deg, hsla(186, 66%, 40%, 1) 0%, hsla(188, 78%, 69%, 1) 100%);
        filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#239EAB", endColorstr="#74DEEE", GradientType=1 );`
    },
    fontFamily: {
        heading: ['IBM Plex Sans', 'sans-serif'].join(','),
        sans: ['Roboto', 'Arial', 'Helvetica', 'sans-serif'].join(','),
        mono: ['IBM Plex Mono', 'serif'].join(','),
    },
    fontSize: {
        xs: rem(10),
        sm: rem(12),
        md: rem(14),
        base: rem(16),
        lg: rem(18),
        xl: rem(20),
        '2xl': rem(24),
        '3xl': rem(32),
        '4xl': rem(40),
        '5xl': rem(64),
    },
    breakpoints: {
        xxs: '375px',
        xs: '573px',
        sm: '768px',
        md: '968px',
        lg: '1032px',
        xl: '1200px',
    }
};

interface ThemeProps {
    children: ReactNode
}

export function Theme({ children }: ThemeProps) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}