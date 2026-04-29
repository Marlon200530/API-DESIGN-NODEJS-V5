import { Router } from "express";
import { validateBody } from "../middlewares/validation.ts";
import { asyncHandler } from "../middlewares/async-handler.ts";
import { loginUser, registerUser } from "../controllers/auth.controllers.ts";
import z from 'zod';

const authRoutes = Router();



const createUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    username: z
        .string()
        .min(3, "Username must have at least 3 characters")
        .max(50, "Username must have at most 50 characters"),
    password: z
        .string()
        .min(8, "Password must have at least 8 characters")
        .max(255, "Password must have at most 255 characters"),
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
})

const loginUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
})

authRoutes.post('/register', validateBody(createUserSchema), asyncHandler(registerUser));

authRoutes.post('/login', validateBody(loginUserSchema), asyncHandler(loginUser));


export default authRoutes;
