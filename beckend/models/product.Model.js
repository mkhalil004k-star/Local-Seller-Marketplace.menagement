import mongoose from "mongoose";

let productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    stock: Number,
    category: String,
    description: String,
    imageUrl: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "auth" }
}, { timestamps: true });

export default mongoose.model("product", productSchema);