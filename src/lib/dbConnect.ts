import mongoose from "mongoose";

type ConnectionObjects ={
    isConnected? : number;
}


const  connection: ConnectionObjects = {};


async function dbConnect(): Promise<void> {    
    if(connection.isConnected){
        console.log('Aready connected to DB');
        return;
    }
    try {
        const db = await mongoose.connect (process.env.MONGODB_URI || "", {});
 //
        connection.isConnected = db.connections[0].readyState;

        console.log(connection.isConnected);
        console.log('Connected to DB');
    } catch (error) {
        console.log('Error connecting to DB', error);
        process.exit(1);
    }
}

export default dbConnect;