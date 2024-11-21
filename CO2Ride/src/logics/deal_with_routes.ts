import axios from 'axios';

const API_URL = 'http://localhost:3000/api/rides'; // Ajuste para o endereço do seu servidor

// Buscar caronas compatíveis
export const findCompatibleRides = async (driverTripId:string) => {
  console.log("Mostrando info do motorista ou caroneiro: ",typeof driverTripId)
  try {
    const response = await axios.get(`${API_URL}/find-compatible-rides`, {
      params: { driverTripId },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar caronas compatíveis:', error);
    return null;
  }
};

// Aceitar carona
export const acceptRide = async (driverTripId:any, passengerTripId:any) => {
  console.log("Mostrando o que deve ser mandado: ",driverTripId,passengerTripId)
  try {
    const response = await axios.post(`${API_URL}/accept-ride`, {
      driverTripId,
      passengerTripId,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao aceitar carona:', error);
    return null;
  }
};
