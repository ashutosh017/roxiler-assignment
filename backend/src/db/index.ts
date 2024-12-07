import mongoose from 'mongoose'
import "dotenv/config"


const mongo_uri = process.env.MONGO_URI??"mongodb://localhost:27017/Roxiler-db";

mongoose.connect(mongo_uri)

const productSchema = new mongoose.Schema({
    id:Number,
    title:String,
    price:Number,
    description:String,
    category:String,
    image:String,
    sold:Boolean,
    dateOfSale:String
})

export const ProductModel = mongoose.model("Product",productSchema);

