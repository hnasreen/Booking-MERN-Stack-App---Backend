import express from 'express';
import { loginController, profileController, registerController } from './controller/userController.js';
import { getplaceController, placeController, placesController, putplaceController, uploadbylinkController, uploadController, userplaceController } from './controller/placesController.js';
import { bookingController, getbookingsController } from './controller/bookingController.js';
import { authMiddleware } from './Middleware/authMiddleware.js';
import multer from 'multer';
// import path from 'path';

// Define storage for multer
const storage = multer.memoryStorage();

const upload = multer({ storage });

const router = express.Router();

//users

router.post('/register', registerController);
router.post('/login',loginController)
router.get('/profile',authMiddleware,profileController)


//places

router.post('/upload-by-link',uploadbylinkController)
router.post('/upload', upload.single('photos'),uploadController)
router.post('/places',authMiddleware,placesController)
router.get('/user-places',authMiddleware,userplaceController)
router.get('/places/:id',placeController)
router.put('/places',authMiddleware,putplaceController)
router.get('/places',getplaceController)

//Bookings

router.post('/bookings',authMiddleware,bookingController)
router.get('/bookings',authMiddleware,getbookingsController)


export default router;