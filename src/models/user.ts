import mongoose,{Schema,Document, model} from "mongoose";

export interface Message extends Document{
    content:string;  
    createAt:Date
}


const messageSchema :Schema<Message> = new Schema({ 
   content:{
    type:String,
    required:true
   },
    createAt:{
     type:Date,
     required:true,
     default:Date.now
    }
 })


export interface User extends Document{
    username:string;  
    password:string;
    email:string;
    verifyCode:string;
    verifyCodeExpire:Date;
    isAcceptingMessage:boolean;
    Isverified:boolean;
    messages:Message[]
}


const UserSchema :Schema<User> = new Schema({ 
    username:{
     type:String,
     required:[true,"Username is required"],
     trim:true,
     unique:true
    },
     email:{
      type:String,
      required:[true,"Email is required"],
      match:[/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,"Invalid email"],
      unique:true
     },
        password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,"Password must be at least 6 characters"]
        },
        verifyCode:{
            type:String,
            required:[true,"Verify code is required"]
        },
        verifyCodeExpire:{
            type:Date,
            required:[true,"Verify code expire is required"]
        },
        isAcceptingMessage:{
            type:Boolean,
            required:true,
            default:true
        },
        Isverified:{
            type:Boolean,
            default:false
        },
        messages:[messageSchema]
  })


  
const userModel = (mongoose.models.User as mongoose.Model<User>)||model<User>("User",UserSchema)

export default userModel;