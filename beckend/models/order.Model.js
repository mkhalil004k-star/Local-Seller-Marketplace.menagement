import mongoose from "mongoose";

let orderSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "auth" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "auth" },
    quantity: Number,
    deliveryFee: { type: Number, default: 0 },
    totalPrice: Number,
    fullName: String,
    phone: String,
    city: String,
    address: String,
    label: { type: String, default: "Home" },
    status: { type: String, default: "pending" }
}, { timestamps: true });

export default mongoose.model("order", orderSchema);