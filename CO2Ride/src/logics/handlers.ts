import axios from 'axios';

// Definir tipos para as respostas da API
interface Ride {
  passenger_trip_id: string;
  passenger_name: string;
  distance: string;
}

interface RouteData {
  lat: number;
  lng: number;
}

interface SaveRouteResponse {
  success: boolean;
  message: string;
}

const API_URL = 'http://localhost:3000'; // Endereço base da sua API

// Função para buscar caronas compatíveis
export const findCompatibleRides = async (driverTripId: string): Promise<Ride[] | null> => {
  try {
    const response = await axios.get(`${API_URL}/rides/compatible`, {
      params: { driver_trip_id: driverTripId }, // Passa o ID da viagem do motorista como parâmetro
    });

    return response.data;  // Retorna os dados da carona compatível
  } catch (error) {
    console.error('Erro ao buscar caronas:', error);
    return null;  // Retorna null em caso de erro
  }
};

// Função para aceitar uma carona
export const acceptRide = async (driverId: string, passengerTripId: string): Promise<Ride | null> => {
  try {
    const response = await axios.post(`${API_URL}/rides/accept`, {
      driver_id: driverId,
      passenger_trip_id: passengerTripId,
    });

    return response.data;  // Retorna os dados da carona após a aceitação
  } catch (error) {
    console.error('Erro ao aceitar carona:', error);
    return null;  // Retorna null em caso de erro
  }
};

// Função para salvar a rota do motorista
export const saveRoute = async (
  routeData: RouteData[],
  startPoint: RouteData,
  endPoint: RouteData,
  userId: string,
  tripMethod: 'driver' | 'passenger'
): Promise<SaveRouteResponse | null> => {
  try {
    const response = await axios.post(`${API_URL}/trips`, {
      route_data: routeData,
      start_point: startPoint,
      end_point: endPoint,
      user_id: userId,
      trip_method: tripMethod,
    });

    return response.data;  // Retorna a resposta da API (sucesso ou erro)
  } catch (error) {
    console.error('Erro ao salvar rota:', error);
    return null;  // Retorna null em caso de erro
  }
};
