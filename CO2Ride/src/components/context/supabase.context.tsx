import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../logics/supabase';
import { User} from '@supabase/supabase-js';

// Define os tipos para o contexto
interface AuthContextType {
  user: User | null; // Usuário autenticado ou null
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Define o contexto com um valor inicial vazio
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props do AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Componente de Provider para o contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verifica a sessão ativa ao carregar o app
    const getSession = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
      };
      getSession();
      
    // Observa mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      console.log(event)
    });

    // Limpa o listener ao desmontar o componente
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Função para registro
  const signUp = async (email: string, password: string): Promise<void> => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setUser(data.user);
  };

  // Função para login
  const signIn = async (email: string, password: string): Promise<void> => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
  };

  // Função para logout
  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  // Provedor do contexto
  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
