import express from 'express';
import { env } from '../env.ts';
import authRoutes from './routes/auth.routes.ts';
import userRoutes from './routes/user.routes.ts';
import habitRoutes from './routes/habit.routes.ts';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app =  express();

app.use(helmet());
app.use(cors({
    origin: 'localhost'
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'));




const prefix = env.API_PREFIX
console.log(`${prefix}/health`)

app.get(`${prefix}/health`, (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Habit Tracker API'
    })
})


app.use(`${prefix}/auth`, authRoutes);
app.use(`${prefix}/users`, userRoutes);
app.use(`${prefix}/habits`, habitRoutes)


export default app;