import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import paystackRoutes from "./routes/paystackroute.js";
import { testConnection } from './db/index.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminroute.js';
import productRouter from './routes/productroute.js';


const app = express()
const port = process.env.PORT || 4000
connectCloudinary();

app.use(express.json())

const rawOrigins = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || process.env.ALLOWED_ORIGINS || '';
const origins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
    
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
};

app.use(cors(corsOptions));
console.log('CORS configured. Allowed origins:', origins.length ? origins : 'all (dev)');


app.get('/', (req, res) => {
    res.send('Api is Working')
})

app.use("/api/paystack", paystackRoutes);
app.use("/api/admin",adminRouter);
app.use('/api/product',productRouter);

const start = async () => {
    try {
        
        await testConnection();

        app.listen(port, () => {
            console.log('server started on PORT : ' + port)
        })
    } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
    }
}

start()