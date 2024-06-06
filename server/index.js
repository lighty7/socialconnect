import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dbConnection from './dbConfig/index.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import router from './routes/index.js';
import path from 'path';
import userRoutes from './routes/userRoutes.js'; 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'views/build'))); 
app.use('/auth', userRoutes);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/build', 'index.html'));
});

app.use(errorMiddleware);


dbConnection();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json()); // Ensure body-parser middleware is used before the router
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' })); // Ensure express.json() middleware is used before the router

app.use(router); // Place the router after body parser middleware

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
