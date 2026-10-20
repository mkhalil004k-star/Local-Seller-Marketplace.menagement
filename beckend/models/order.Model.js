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

    status: {
        type: String,
        enum: [
            "pending", "confirmed", "shipped", "delivered",
            "rejected", "cancelled",
            "return_requested", "returned", "return_rejected"
        ],
        default: "pending"
    },
    returnReason: String,   // buyer ki wajah
    sellerNote: String,     // seller ki wajah (reject / return reject)

    buyerSeen: { type: Boolean, default: true },
    sellerSeen: { type: Boolean, default: false },

    statusHistory: [{
        status: String,
        at: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model("order", orderSchema);