import styled from 'styled-components'
export const Entry_Container = styled.div`
width:80dvw;
height:60dvh;
display:flex;
flex-direction:column;
align-items:center;
text-align:center;
justify-content:space-evenly;
position:fixed;
top:50%;
left:50%;
transform:translate(-50%,-50%);
background-color:${(props) => props.theme.colors.gray200};
border-radius:1rem;
padding:1rem;
>button{
padding:1rem;
border-radius:0.5rem;
cursor:pointer;
background-color:${(props)=> props.theme.colors.secondary};
color:${(props)=> props.theme.colors.white}
}
`