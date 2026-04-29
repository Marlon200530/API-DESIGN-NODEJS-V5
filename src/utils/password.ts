import bcrypt from 'bcrypt';
import { env } from '../../env.ts';


export const hashPassword = async (password : string) => {
    const SALT_ROUNDS = env.BCRYPT_ROUNDS;
    return bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
}
