import express from "express"
import auth from "../middleware/auth.js"
import {
    createOrder,
    sellerOrders,
    buyerOrders,
    updateOrderStatus,
    cancelOrder,
    returnOrder,
    returnDecision,
    unreadCount,
    markSeen
} from "../controllers/order.controller.js"

let router = express.Router()

// buyer
router.post("/orderCreate", auth("buyer"), createOrder)
router.get("/buyerOrders", auth("buyer"), buyerOrders)
router.post("/cancel", auth("buyer"), cancelOrder)
router.post("/return", auth("buyer"), returnOrder)

// seller
router.get("/sellerOrders", auth("seller"), sellerOrders)
router.post("/orderStatus", auth("seller"), updateOrderStatus)
router.post("/returnDecision", auth("seller"), returnDecision)

// dono (buyer + seller)
router.get("/unreadCount", auth(), unreadCount)
router.post("/markSeen", auth(), markSeen)

export default router