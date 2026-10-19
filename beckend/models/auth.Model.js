import mongoose from "mongoose";

let authSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phoneNo: String,
    cnicNo: String,                       // sirf seller ke liye
    location: { type: String, default: "" },   // sirf buyer ke liye
    role: { type: String, enum: ["admin", "seller", "buyer"] }
})

let authModel = mongoose.model("auth", authSchema)
export default authModel;