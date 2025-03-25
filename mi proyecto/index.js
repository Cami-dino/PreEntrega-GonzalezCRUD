import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import sessionRoutes from './routes/sessionRoutes.js';
import passport from './config/passport.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/sessions', sessionRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch((err) => console.error('Error de conexión:', err));
