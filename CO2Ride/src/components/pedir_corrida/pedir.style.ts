import styled from 'styled-components'
export const TogglerDiv = styled.div`
width:fit-content;
padding:0.5rem;
heigth:5rem;
position:fixed;
background-color:${(props) => props.theme.colors.white};
display:flex;
flex-direction:column;
align-items:center;
justify-content:space-between;
>div{
width:fit-content;
padding:0.5rem;
>button{
&.active{
background-color:${(props)=> props.theme.colors.primary}}}}`

export const TogglerMethod = styled(TogglerDiv)`
top:12rem;
right:1rem;`

export const TogglerVehicle = styled(TogglerDiv)`
right:10rem;
top:12rem`