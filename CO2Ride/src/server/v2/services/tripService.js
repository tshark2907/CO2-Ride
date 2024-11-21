import { supabase } from './client.js'; // Aqui você usa seu cliente Supabase, conforme configurado

// Cria uma nova viagem
async function createTrip(user_id, trip_type, start_point, end_point, route_line, geohash_start, geohash_end) {
  // Inserindo dados na tabela 'trips'
  const { data, error } = await supabase
    .from('trips')
    .insert([
      {
        user_id,
        trip_type,
        start_point: `SRID=4326;${start_point}`, // Formato de geografia WKT
        end_point: `SRID=4326;${end_point}`,     // Formato de geografia WKT
        route_line: `SRID=4326;${route_line}`,   // Formato de geografia WKT
        geohash_start,
        geohash_end,
        status: 'pending',
      }
    ])
    .single(); // Retorna apenas um registro

  if (error) {
    console.error('Erro ao criar viagem:', error);
    return error;
  }

  return data; // Retorna os dados da nova viagem criada
}

// Obtém todas as viagens de um usuário
async function getTrips(user_id) {
  // Consultando as viagens do usuário
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user_id); // Filtra pelo user_id

  if (error) {
    console.error('Erro ao obter viagens:', error);
    return error;
  }
  console.log("Dados",data)
  return data; // Retorna todas as viagens associadas ao usuário
}

// Atualiza o status de uma viagem
async function updateTripStatus(trip_id, status) {
  // Atualizando o status da viagem
  const { data, error } = await supabase
    .from('trips')
    .update({ status }) // Atualiza o status
    .eq('id', trip_id)   // Filtra pela id da viagem
    .single();           // Retorna apenas o registro atualizado

  if (error) {
    console.error('Erro ao atualizar status da viagem:', error);
    return error;
  }

  return data; // Retorna os dados da viagem com o status atualizado
}

export { createTrip, getTrips, updateTripStatus };
