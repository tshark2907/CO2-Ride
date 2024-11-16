import styled from 'styled-components'

export const LoginBody = styled.div`
width:80dvw;
height:60dvh;
display:flex;
flex-direction:column;
align-items:center;
text-align:center;
justify-content:center;
position:fixed;
top:50%;
left:50%;
transform:translate(-50%,-50%);
background-color:${(props) => props.theme.colors.gray200};
border-radius:1rem;
padding:1rem;
>h2{
display:inline;}
>form{
width:100%;
height:100%;
padding:1rem;
display:flex;
flex-direction:column;
justify-content:space-evenly;
>div{
display:flex;
justify-content:space-between;
>input{
padding:0.5rem;}}
`