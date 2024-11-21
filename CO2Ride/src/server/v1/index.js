import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import ridesRouter from './routes/rides.js'
import { createClient } from '@supabase/supabase-js'

const app = express();
app.use(cors())
const port = 3000;

const supabaseUrl =  process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.use('/api/rides', ridesRouter(supabase));

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
