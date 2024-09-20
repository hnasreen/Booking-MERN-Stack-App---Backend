import Place from '../models/place.js'
import cloudinary from '../config/CloudinaryConfig.js'; 
// import fs from 'fs/promises'; 



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
  const uploadedFiles = [];
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // const filePath = req.file.path;

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload_stream( {
      folder: 'mern_booking',
      resource_type: 'image',
    });

    // Store the secure URL from Cloudinary
    uploadedFiles.push(result.secure_url);

    // Delete the file from the uploads folder after successful upload
    // await fs.unlink(filePath);

    res.json(uploadedFiles);
        // Using Node.js streams to process the file from memory buffer
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);
    
        // Pipe the file buffer to Cloudinary's upload stream
        bufferStream.pipe(result);
    
        
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