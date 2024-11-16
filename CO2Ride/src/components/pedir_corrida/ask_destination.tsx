import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
  Marker,
  Libraries
} from '@react-google-maps/api';
import { useRef, useState } from 'react';

import { saveRoute } from '../../logics/save_destination';
import { useAuth } from '../context/supabase.context';

interface Coordinate {
  lat: number;
  lng: number;
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
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [routeData, setRouteData] = useState<Coordinate[]>([]); // Dados da rota
  const [startPoint, setStartPoint] = useState<Coordinate | null>(null);
  const [endPoint, setEndPoint] = useState<Coordinate | null>(null);

  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  if (!isLoaded) {
    return <div><h2>Carregando...</h2></div>;
  }
  console.log(map)

  const handleSaveRoute = async () => {
    if (!startPoint || !endPoint || routeData.length === 0) {
      alert("Rota incompleta. Verifique os dados de origem e destino.");
      return;
    }

    const userId = user?.id || '';
    const tripType: 'driver' | 'passenger' = 'driver';

    const success = await saveRoute(routeData, startPoint, endPoint, userId, tripType);
    if (success) {
      alert("Solicitação de carona salva com sucesso!");
    } else {
      alert("Erro ao salvar solicitação de carona.");
    }
  };

  async function calculateRoute() {
    const origin = originRef.current?.value || '';
    const destination = destinationRef.current?.value || '';

    if (origin === '' || destination === '') {
      return;
    }

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
        bottom: '10px',
        left: '50%',
        width:'60dvw',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1,
        minWidth: '300px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly',gap:'0.1rem', marginBottom: '10px', flexWrap:'wrap' }}>
          <Autocomplete>
            <input
              type="text"
              placeholder="Origem"
              ref={originRef}
              style={{ flex: 1, marginRight: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width:'34dvw' }}
            />
          </Autocomplete>
          <Autocomplete>
            <input
              type="text"
              placeholder="Destino"
              ref={destinationRef}
              style={{width:'32dvw', flex: 1, marginLeft: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </Autocomplete>
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
          <button
            onClick={clearRoute}
            style={{
              marginLeft: '5px',
              padding: '8px 12px',
              backgroundColor: '#93ca3c',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color:'white'
            }}
          >
            Limpar
          </button>
        </div>

        {setDirectionsResponse !== null && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Distância em KM: {distance}</span>
          <span>Tempo estimado: {duration}</span>
          <button
            onClick={handleSaveRoute}
            style={{
              marginLeft: '10px',
              padding: '8px',
              backgroundColor: '#93ca3c',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Salvar
          </button>
        </div>}
      </div>
      <div style={{ position: 'relative', height: '60vh', width: '90vw' }}>
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
