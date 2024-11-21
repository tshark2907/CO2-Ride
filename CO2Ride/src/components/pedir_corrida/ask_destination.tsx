import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
  Marker,
  Libraries
} from '@react-google-maps/api';
import { useRef, useState } from 'react';
import { findCompatibleRides, acceptRide } from '../../logics/deal_with_routes';
import { saveRoute } from '../../logics/save_destination';
import { useAuth } from '../context/supabase.context';
import { TogglerMethod } from './pedir.style';
import iconCar from '../../assets/car.svg'
import iconWalk from '../../assets/walk.svg'
import iconX from '../../assets/x.svg'

interface Coordinate {
  lat: number;
  lng: number;
}

interface Ride {
  passenger_trip_id: string;
  passenger_name: string;
  distance: string;
}

interface SelectedRide {
  driver_location: string;
}

const center = { lat: 48.8584, lng: 2.2945 };
const libraries: Libraries = ['places'];

const AskDestination = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { user } = useAuth();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  console.log(map)
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [routeData, setRouteData] = useState<Coordinate[]>([]);
  const [startPoint, setStartPoint] = useState<Coordinate | null>(null);
  const [endPoint, setEndPoint] = useState<Coordinate | null>(null);
  const [tripMethod, setTripType] = useState<'driver' | 'passenger' | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [compatibleRides, setCompatibleRides] = useState<Ride[]>([]); 
  const [selectedRide, setSelectedRide] = useState<SelectedRide | null>(null); 
  
  const handleFindRides = async () => {
    if (!startPoint || !endPoint) {
      alert('Origem e destino são necessários!');
      return;
    }

    await handleSaveRoute();  // Chama a função para salvar a rota antes de procurar caronas.
    setIsLoading(true); 

    if (!user?.id) {
      alert('Usuário não autenticado');
      setIsLoading(false);
      return;
    }

    try {
      const rides = await findCompatibleRides(user.id);  

      if (rides) {
        setCompatibleRides(rides); 
      } else {
        alert('Nenhuma carona compatível encontrada.');
      }
    } catch (error) {
      console.error('Erro ao buscar caronas:', error);
      alert('Erro ao buscar caronas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRide = async (passengerTripId: string) => {
    if (!user?.id) {
      alert('Usuário não autenticado');
      return;
    }

    try {
      const response = await acceptRide(user.id, passengerTripId); // Aceita a carona

      if (response) {
        alert('Carona aceita com sucesso!');
        setSelectedRide(response);  // Armazena a carona selecionada
      } else {
        alert('Erro ao aceitar a carona.');
      }
    } catch (error) {
      console.error('Erro ao aceitar carona:', error);
      alert('Erro ao aceitar carona.');
    }
  };

  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  if (!isLoaded) {
    return <div><h2>Carregando...</h2></div>;
  }

  const handleSaveRoute = async () => {
    if (!startPoint || !endPoint || routeData.length === 0) {
      alert("Rota incompleta. Verifique os dados de origem e destino.");
      return;
    }

    const userId = user?.id || '';
    try {
      const success = await saveRoute(routeData, startPoint, endPoint, userId, tripMethod ?? 'driver');

      if (success) {
        alert("Solicitação de carona salva com sucesso!");
      } else {
        alert("Erro ao salvar solicitação de carona.");
      }
    } catch (error) {
      console.error('Erro ao salvar a rota:', error);
      alert('Erro ao salvar solicitação de carona.');
    }
  };

  async function calculateRoute() {
    const origin = originRef.current?.value || '';
    const destination = destinationRef.current?.value || '';

    if (origin === '' || destination === '') {
      return;
    }

    try {
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0]?.legs[0]?.distance?.text || '');
      setDuration(results.routes[0]?.legs[0]?.duration?.text || '');

      // Extraindo as coordenadas da rota
      const routePath = results.routes[0]?.overview_path || [];
      const routeCoordinates: Coordinate[] = routePath.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));
      setRouteData(routeCoordinates);

      // Extraindo ponto inicial e final
      const startLocation = results.routes[0]?.legs[0]?.start_location;
      const endLocation = results.routes[0]?.legs[0]?.end_location;
      if (startLocation && endLocation) {
        setStartPoint({ lat: startLocation.lat(), lng: startLocation.lng() });
        setEndPoint({ lat: endLocation.lat(), lng: endLocation.lng() });
      }
    } catch (error) {
      console.error('Erro ao calcular a rota:', error);
      alert('Erro ao calcular a rota.');
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    setRouteData([]);
    setStartPoint(null);
    setEndPoint(null);
    if (originRef.current) originRef.current.value = '';
    if (destinationRef.current) destinationRef.current.value = '';
  }

  return (<>
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '50%',
      width: '60dvw',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      minWidth: '300px',
    }}>
      <><TogglerMethod>
        <span>Ir como: </span>
        <div>
            <button onClick={(e)=>{
              e.currentTarget.classList.toggle("active")
              setTripType('driver')
              }}><img src={iconCar} alt='Sou condutor'>
              </img>
            </button>
            <button onClick={(e)=>{
              e.currentTarget.classList.toggle("active")
              setTripType('passenger')
              }}>
              <img width={25} src={iconWalk} alt='Sou passageiro'></img>
            </button>
        </div>
      </TogglerMethod>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '0.1rem', marginBottom: '10px', flexWrap: 'wrap' }}>
        <Autocomplete>
          <input
            type="text"
            placeholder="Origem"
            ref={originRef}
            style={{ flex: 1, marginRight: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '24dvw' }}
          />
        </Autocomplete>
        <Autocomplete>
          <input
            type="text"
            placeholder="Destino"
            ref={destinationRef}
            style={{ width: '24dvw', flex: 1, marginLeft: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </Autocomplete>
        <button
          onClick={clearRoute}
          style={{
            marginLeft: '5px',
            padding: '4px 8px',
            backgroundColor: '#93ca3c',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          <img src={iconX} alt='Limpar campos'/>
        </button>
        <button
          onClick={calculateRoute}
          style={{
            marginLeft: '10px',
            padding: '8px 12px',
            backgroundColor: '#93ca3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Calcular
        </button>
      </div>
      </>

      {distance && duration !== null && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Distância em KM: {distance}</span>
        <span>Tempo estimado: {duration}</span>
        <button
          onClick={handleFindRides}
          style={{
            marginLeft: '10px',
            padding: '8px',
            backgroundColor: '#93ca3c',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {tripMethod === 'driver' && "Iniciar corrida"}
          {tripMethod === 'passenger' && "Aguardar carona"}
        </button>
      </div>}
    </div>
    {tripMethod === 'driver' && isLoading && <p>Aguardando caronas compatíveis...</p>}
      {tripMethod === 'driver' && compatibleRides.length > 0 && (
        <ul>
          {compatibleRides.map((ride) => (
            <li key={ride.passenger_trip_id}>
              Passageiro: {ride.passenger_name} - Distância: {ride.distance} km
              <button onClick={() => handleAcceptRide(ride.passenger_trip_id)}>
                Aceitar
              </button>
            </li>
          ))}
        </ul>
      )}

{tripMethod === 'passenger' && selectedRide && (
        <div>
          <p>Seu motorista está a caminho!</p>
          <p>Localização: {selectedRide.driver_location}</p>
          {/* Adicione um mapa para mostrar a localização atual */}
        </div>
      )}
    <div style={{ position: 'relative', height: '55vh', width: '90vw', top:'18rem', borderRadius:'1rem'}}>
      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </div>
    </div>
  </>

  );
};

export default AskDestination;
