import express  from 'express';
import dotenv from 'dotenv';
const app = express();
import morgan  from 'morgan';
import connectDb from './db.js';
import authRoutes from './authRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser'


dotenv.config()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json());
app.use(cookieParser())
app.use(morgan('dev'));

//routes

app.use('/api', authRoutes);
connectDb();
app.get('/', (req, res) =>{
    res.send("<h1>welcome to my Application</h1> <h2>CRUD Application<h2>")
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>{
    console.log('Application is running on port: ', PORT)
})