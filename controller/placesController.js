import Place from '../models/place.js'
import cloudinary from '../config/CloudinaryConfig.js'; 




export const uploadbylinkController = async (req, res) => {
  const { link } = req.body;
  try {
    const result = await cloudinary.uploader.upload(link, {
      folder: 'mern_booking',
      resource_type: 'image',
    });
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const uploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert the buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    
    // Create a Data URI from the base64 string
    let dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    // Upload the dataURI to Cloudinary
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      folder: 'mern_booking',
      resource_type: 'image',
    });

    // Respond with the Cloudinary upload result
    res.json(cldRes);
        
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const placesController = async (req, res) => {

  const { title, address, addedPhotos, description, price, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;
  const userData = req.userData; // Get userData from middleware

  try {
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the place' });
  }

}

export const userplaceController = async (req,res)=>{
  const userData = req.userData; // Get userData from middleware
  try {
    const userPlaces = await Place.find({ owner: userData.id });
    res.json(userPlaces);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching user places' });
  }
}

export const placeController = async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
}

export const putplaceController = async (req, res) => {
  const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  const userData = req.userData; // Get userData from middleware

  try {
    const placeDoc = await Place.findById(id);
    if (placeDoc.owner.toString() === userData.id) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json('Place updated successfully');
    } else {
      res.status(403).json({ message: 'You are not authorized to update this place' });
    }
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while updating the place' });
  }
}

export const getplaceController = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching places' });
  }
}