import Booking from '../models/Bookings.js'

export const bookingController = async (req, res) => {

  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
  const userData = req.userData; // Get userData from middleware

  try {
    const doc = await Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user: userData.id, // Attach the user ID from the verified token
    });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while creating the booking' });
  }

}

export const getbookingsController = async (req, res) => {
  const userData = req.userData; // Get userData from middleware

  try {
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching bookings' });
  }
} 