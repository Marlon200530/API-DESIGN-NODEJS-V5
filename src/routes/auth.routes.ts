import { Router } from "express";
import { validateBody } from "../middlewares/validation.ts";
import z from 'zod';

const authRoutes = Router();



const createUserSchema = z.object({
    email: z.email(),
    password: z.string().min(8, 'The Password must have at least 8 characters').max(255, 'The Password must have in maximum 255 characters')
})

authRoutes.post('/register', validateBody(createUserSchema),async(req, res) => {
    res.status(201).json({
        message: 'User signed up'
    });
});

authRoutes.post('/login', async(req, res) => {
    res.status(200).json({
        message: 'User logged'
    });
});


export default authRoutes;