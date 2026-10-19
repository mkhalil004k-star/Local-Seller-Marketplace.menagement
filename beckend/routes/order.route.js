import express from "express"
import auth from "../middleware/auth.js"
import {
    createOrder,
    sellerOrders,
    updateOrderStatus
} from "../controllers/order.controller.js"

let router = express.Router()

router.post("/orderCreate", auth("buyer"), createOrder)
router.get("/sellerOrders", auth("seller"), sellerOrders)
router.post("/orderStatus", auth("seller"), updateOrderStatus)

export default router