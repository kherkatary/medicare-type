import mongoose from "mongoose";

const connectDb= async ()=>{
    try{

        const connection = await mongoose.connect(process.env.DATABASE);
        console.log("Connection established with the database");

    }catch(err){
        console.log(`Mongoose Error: ${err}`);
    }
}


export default connectDb