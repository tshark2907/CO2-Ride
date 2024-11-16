require('dotenv').config();
const express = require('express');
import {supabase} from '../logics/supabase'
const ridesRouter = require('./routes/rides');

const app = express();
const port = 3000;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.use('/api/rides', ridesRouter(supabase));

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
