import { useNavigate } from "react-router-dom"
import { Entry_Container } from "./home.style"
const Home = () => {
    const navigate = useNavigate()
    return (<>
        <Entry_Container>
            <h2>Seja bem vindo ao CO2 Ride!</h2>
            <span>Esta aplicação está sendo desenvolvida para a UPX 4 da Faculdade Newton Paiva, pela turma de ADS</span>
            <button onClick={()=>navigate("/register")}>Criar uma conta e testar!</button>
            <button onClick={()=>navigate("/login")}>Entrar em conta existente</button>
            <button onClick={()=>navigate("/about")}>Saiba mais sobre a equipe de desenvolvimento</button>
        </Entry_Container>
    </>)
}

export default Home