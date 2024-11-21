import express from 'express';

const createRouter = (supabase) => {
  const router = express.Router();

  router.get('/find-compatible-rides', async (req, res) => {
    console.log(req.query)
    const { driverTripId } = req.query;
    console.log("Verificando informação obtida: ",driverTripId)

    if (!driverTripId) {
      return res.status(400).json({ error: 'driverTripId é necessário.' });
    }

    try {
      const { data, error } = await supabase.rpc('find_compatible_rides', { driver_trip_id: driverTripId });
      console.log("Resultados obtidos: ",data)
      console.log("Erros obtidos: ",error)

      if (error) {
        console.log("Erro na requisição: ",error)
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ data });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  });

  // Função para aceitar uma carona, associando o motorista ao passageiro
  router.post('/accept-ride', async (req, res) => {
    const { driverTripId, passengerTripId } = req.body;

    if (!driverTripId || !passengerTripId) {
      return res.status(400).json({ error: 'driverTripId e passengerTripId são necessários.' });
    }

    try {
      const { data, error } = await supabase.rpc('mark_trip_as_matched', {
        driver_trip_id: driverTripId,
        passenger_trip_id: passengerTripId,
      });

      if (error) {
        console.log("Falha no endpoint: ",error)
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ data });
    } catch (error) {
      console.log("Falha no endpoint: ",error)
      res.status(500).json({ error: 'Erro ao aceitar a carona.' });
    }
  });

  return router;
};

export default createRouter;
