import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
    min-height: 100dvh;
  }
  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    background: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.black};
    font-family: ${(props) => props.theme.fontFamily.sans};
    @media screen and (max-width:${(props) => props.theme.breakpoints.sm}){
      width: ${(props) => props.theme.breakpoints.xxs} - 30;
    }
  }
`;