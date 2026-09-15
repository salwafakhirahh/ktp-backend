import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ktpRoutes from './routes/ktpRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '10mb', extended:true }));

app.use('/api/ktp', ktpRoutes);

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});