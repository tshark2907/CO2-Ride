import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../logics/supabase';
import { LoginBody } from '../login/login.style';
// Definindo o esquema de validação com Zod
const userSchema = z.object({
  email: z.string().email("Insira um email válido"),
  fullName: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string(),
  phone: z.string().regex(/^\d{10,11}$/, "O telefone deve ter 10 ou 11 dígitos"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

// Criação do tipo `UserData` inferido do esquema
type UserData = z.infer<typeof userSchema>;

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserData) => {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        phone:data.phone,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Acessando o usuário após o registro
      const user = authData?.user;
      if (!user) {
        throw new Error("Falha ao criar usuário no Supabase Auth");
      }

      // Agora, insira os dados do usuário na tabela 'detalhes_usuarios'
      const { error: dbError } = await supabase
        .from('detalhes_usuarios')
        .insert([
          {
            id: user.id,  // Usando o ID do usuário criado no Auth
            full_name: data.fullName,
            phone: data.phone,
            
          },
        ]);

      if (dbError) {
        throw new Error(dbError.message);
      }

      // Sucesso
      alert("Registro bem-sucedido!");
      console.log("Usuário e dados armazenados com sucesso!", data);
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao registrar o usuário. Tente novamente.");
    }
  };

  return (
    <LoginBody>
      <h2>Registro de Usuário</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input type="email" {...register("email")} />
          {errors.email && <p style={{ color: "red" }}>{String(errors.email.message)}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Nome Completo:</label>
          <input type="text" {...register("fullName")} />
          {errors.fullName && <p style={{ color: "red" }}>{String(errors.fullName.message)}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Senha:</label>
          <input type="password" {...register("password")} />
          {errors.password && <p style={{ color: "red" }}>{String(errors.password.message)}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Confirme a Senha:</label>
          <input type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>{String(errors.confirmPassword.message)}</p>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Número de Telefone:</label>
          <input type="text" {...register("phone")} placeholder="Ex: 11987654321" />
          {errors.phone && <p style={{ color: "red" }}>{String(errors.phone.message)}</p>}
        </div>

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
          Registrar
        </button>
      </form>
    </LoginBody>
  );
}

export default RegisterForm;
