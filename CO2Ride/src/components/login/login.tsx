import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../logics/supabase';  // ou o caminho do seu arquivo supabaseClient
import { useNavigate } from 'react-router-dom';
import { LoginBody } from './login.style';
// Definindo o esquema de validação com Zod para login
const loginSchema = z.object({
  email: z.string().email("Insira um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// Criação do tipo `LoginData` inferido do esquema
type LoginData = z.infer<typeof loginSchema>;

function LoginForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      // Autenticar o usuário no Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const user = authData?.user;
      if (!user) {
        throw new Error("Falha ao autenticar usuário no Supabase Auth");
      }
      navigate('/iniciar')
      console.log("Usuário autenticado com sucesso:", user);
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Verifique suas credenciais e tente novamente.");
    }
  };

  return (
    <LoginBody>
      <h2>Login de Usuário</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input type="email" {...register("email")} />
          {errors.email && <p style={{ color: "red" }}>{String(errors.email.message)}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Senha:</label>
          <input type="password" {...register("password")} />
          {errors.password && <p style={{ color: "red" }}>{String(errors.password.message)}</p>}
        </div>

        <a>Esqueci minha senha</a>

        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            background: "#93ca3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </LoginBody>
  );
}

export default LoginForm;
