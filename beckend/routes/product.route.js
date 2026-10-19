import express from "express"
import auth from "../middleware/auth.js"
import {
    addProduct,
    getAllProducts,
    getPublicProducts,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js"
let router = express.Router()

router.post("/add", auth("seller"), addProduct)
router.get("/all", auth(), getAllProducts)
router.put("/update", auth("seller", "admin"), updateProduct)
router.delete("/delete", auth("seller", "admin"), deleteProduct)
router.get("/public", getPublicProducts) 
export default router