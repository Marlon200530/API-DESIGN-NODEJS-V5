import type {Request, Response} from 'express';
import { createUserService, loginUserService } from '../services/auth.service.ts';

export const registerUser = async (req: Request, res: Response) => {
    const { user, token } = await createUserService(req.body);
    const { password: _password, ...safeUser } = user;

    res.status(201).json({
        message: "User signed up",
        user: safeUser,
        token,
    });
};

export const loginUser = async (req: Request, res: Response) => {
    const { user, token } = await loginUserService(req.body);
    const { password: _password, ...safeUser } = user;

    res.status(200).json({
        message: "User logged",
        user: safeUser,
        token,
    });
};
