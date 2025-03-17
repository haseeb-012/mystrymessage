import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from '@/models/user';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifyByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifyByUsername) {
            return NextResponse.json({
                success: false,
                message: "User Already Taken"
            }, {
                status: 400
            });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User is already verified with this Email"
                }, {
                    status: 400
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpire= new Date(Date.now()+360000)
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                password: hashedPassword,
                email,
                verifyCode,
                verifyCodeExpire: expiryDate,
                isAcceptingMessage: true,
                isVerified: false,
                messages: []
            });
            await newUser.save();
        }

        //  send verification email 
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            });
        }

        return NextResponse.json({
            success: true,
            message: "User registration successful, please verify your email"
        }, {
            status: 200
        });
    } 
    catch (error) {
        console.error("Error in registration of user", error);
        return NextResponse.json({
            success: false,
            message: "Error in registration of user"
        }, {
            status: 500
        });
    }
}
