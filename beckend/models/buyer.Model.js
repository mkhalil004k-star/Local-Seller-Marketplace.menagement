import mongoose from "mongoose";

let buyerSchema = mongoose.Schema({
    name: String,
    phone: String,
    city: String,
    address: String,
    imageUrl: String,
    notes: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "auth" }
})
let buyerModel = mongoose.model("buyer", buyerSchema)
export default buyerModel