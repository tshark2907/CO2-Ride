import { Router } from 'express';
import { createRide, getRides, updateRideStatus, matchRides } from '../services/rideService.js';
const router = Router();

// Cria uma correspondência de carona
router.post('/', async (req, res) => {
  const { driver_trip_id, passenger_trip_id } = req.body;

  try {
    await createRide(driver_trip_id, passenger_trip_id);
    res.status(201).json({ message: 'Ride created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating ride', error });
  }
});

// Obtém todas as caronas associadas a um motorista
router.get('/:driver_trip_id', async (req, res) => {
  const { driver_trip_id } = req.params;

  try {
    const rides = await getRides(driver_trip_id);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rides', error });
  }
});

// Atualiza o status de uma correspondência
router.patch('/:ride_id', async (req, res) => {
  const { ride_id } = req.params;
  const { status } = req.body;

  try {
    await updateRideStatus(ride_id, status);
    res.status(200).json({ message: 'Ride status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating ride status', error });
  }
});

// Encontra correspondências de carona entre motoristas e passageiros
router.post('/match', async (req, res) => {
  try {
    await matchRides();
    res.status(200).json({ message: 'Ride matching process completed' });
  } catch (error) {
    res.status(500).json({ message: 'Error matching rides', error });
  }
});

export default router;
