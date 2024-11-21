import { Router } from 'express';
import { createTrip, getTrips, updateTripStatus } from '../services/tripService.js';
const router = Router();

// Cria uma nova viagem
router.post('/', async (req, res) => {
  const { user_id, trip_type, start_point, end_point, route_line, geohash_start, geohash_end } = req.body;

  try {
    const newTrip = await createTrip(user_id, trip_type, start_point, end_point, route_line, geohash_start, geohash_end);
    res.status(201).json({ message: 'Trip created successfully', trip_id: newTrip.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating trip', error });
  }
});

// Obtém todas as viagens de um usuário
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const trips = await getTrips(user_id);
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trips', error });
  }
});

// Atualiza o status de uma viagem
router.patch('/:trip_id', async (req, res) => {
  const { trip_id } = req.params;
  const { status } = req.body;

  try {
    const updatedTrip = await updateTripStatus(trip_id, status);
    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Error updating trip status', error });
  }
});

export default router;
