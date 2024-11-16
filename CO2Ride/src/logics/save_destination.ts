import ngeohash from 'ngeohash';
import { supabase } from '../logics/supabase';

// Tipos das coordenadas e rotas
interface Coordinate {
  lat: number;
  lng: number;
}

// Função para salvar rota
export const saveRoute = async (
  route: Coordinate[], 
  startPoint: Coordinate, 
  endPoint: Coordinate, 
  userId: string, 
  tripType: 'driver' | 'passenger'
): Promise<boolean> => {
  try {
    const geohashStart = ngeohash.encode(startPoint.lat, startPoint.lng);
    const geohashEnd = ngeohash.encode(endPoint.lat, endPoint.lng);

    const routeLine = `LINESTRING(${route.map(p => `${p.lng} ${p.lat}`).join(',')})`;

    // Inserção no Supabase
    const { error } = await supabase
      .from('trips') // Note que não passamos o genérico aqui
      .insert([
        {
          user_id: userId,
          trip_type: tripType,
          start_point: `POINT(${startPoint.lng} ${startPoint.lat})`,
          end_point: `POINT(${endPoint.lng} ${endPoint.lat})`,
          route_line: routeLine,
          geohash_start: geohashStart,
          geohash_end: geohashEnd,
          status: 'active',
        },
      ]);

    if (error) throw error;

    console.log('Rota salva com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao salvar rota:', (error as Error).message);
    return false;
  }
};
