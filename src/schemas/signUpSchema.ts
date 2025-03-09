import {z} from 'zod';

export const usernameValidation = z.string().min(2,"User name must be at least 2 characters").max(20,"User name must be at most 20 characters").regex(/^[a-zA-Z0-9_]*$/,"User name must contain only letters, numbers and underscores")


export const SignUpSchema = z.object({
    username:usernameValidation,  
    email:z.string().email({message:"Invalid email"}),
    password:z.string().min(6,"Password must be at least 6 characters"),      
})
