import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import paystackRoutes from "./routes/paystackroute.js";
import { testConnection } from './db/index.js';

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Api is Working')
})

app.use("/api/paystack", paystackRoutes);

const start = async () => {
    try {
        // Test Postgres connection if DATABASE_URL is set
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