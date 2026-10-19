import express from "express"
import cors from "cors"
let app = express()
import dbConnection from "./database/dbConnection.js"
import authRoutes from './routes/auth.route.js'
import sellerRoutes from "./routes/seller.routes.js";
import buyerRoutes from "./routes/buyer.routes.js";
import productRouter from "./routes/product.route.js"
import orderRouter from "./routes/order.route.js";
import chatRoute from "./routes/chat.route.js";

import cookieParser from 'cookie-parser'
import dotenv from "dotenv"
dotenv.config()
dbConnection()
app.use(cookieParser())

app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json())


app.use('/auth',authRoutes)
app.use('/sellers',sellerRoutes)
app.use('/buyers', buyerRoutes)
app.use("/product", productRouter)
app.use("/orders", orderRouter);
app.use("/api/chat", chatRoute);

app.listen(4000, function () {
  console.log("The server is runing on 4000");

})