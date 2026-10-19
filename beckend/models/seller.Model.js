import mongoose from "mongoose";

let sellerSchema = mongoose.Schema({
    shopName: String,
    ownerName: String,
    phone: String,
    city: String,
    imageUrl: String,
    notes: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "auth" }
})
let sellerModel = mongoose.model("seller", sellerSchema)
export default sellerModel