import express from "express";
import auth from "../middleware/auth.js";
import {
    createSeller,
    findAllSeller,
    getPublicSellers,
    deleteSeller,
    findOneSeller,
    updateSeller,
    myProfile
} from "../controllers/seller.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

function uploadImage(req, res, next) {
    upload.single("image")(req, res, function (err) {
        if (err) {
            console.log("UPLOAD ERROR:", err);
            return res.status(500).json({
                success: false,
                message: err.message || "Image upload failed"
            });
        }
        next();
    });
}

// Public: bina login ke (Home page)
router.get("/public", getPublicSellers);

router.post("/sellerCreate", auth("seller", "admin"), uploadImage, createSeller);
router.get("/sellerAll", auth(), findAllSeller);
router.post("/sellerDelete", auth("seller", "admin"), deleteSeller);
router.post("/sellerUpdate", auth("seller", "admin"), uploadImage, updateSeller);
router.get("/sellerOne", auth(), findOneSeller);
router.get("/myProfile", auth("seller"), myProfile);

export default router;