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
app.use(cors())

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