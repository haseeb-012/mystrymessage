import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/user"
import { error } from "console"


export const AuthOptions : NextAuthOptions = {
  providers: [      
    CredentialsProvider({
        id: "credentials",
        name:"Credentials",
       credentials: {
        username: { label: "Username" ,type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials:any) :Promise<any>{
        await dbConnect()
        try {
           const user = await UserModel.findOne({
                $or:[
                    {email: credentials.identifier},
                    {username: credentials.identifier}
                ]
            })

            if(!user){
                throw new Error("No user Found")
            }

            if(!user.isVerified){
                throw new Error("please verify your email before login ")
            }

             const isPasswordsCorrect = await bcrypt.compare(credentials.password, user.password) 
             
                if(isPasswordsCorrect){
                   return user
                }else{
                    throw new Error("incorrect Password")

                }
        } catch (err:any) {
            throw new Error(err)
        }
      },
    }),
  ], 
  callbacks:{
    async jwt({token,user}){
      if(user){
        token._id = user._id?.toString()
        token.isVerified=user.isVerified
        token.isAcceptingMessage=user.isAcceptingMessage;
        token.username=user.username;
      }
      return token
    },
    async session({session,token}) {
      if(token){
        session.user._id = token._id
        session.user.isAcceptingMessage=token.isAcceptingMessage;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username
      }
        return session
    },
  },
  pages:{
    signIn:'/sign-in'
  },
  session:{
    strategy:"jwt"
  },
  secret: process.env.Auth_SECRET,

}
