import express from "express";
import auth from "../middleware/auth.js";
import {
    createBuyer,
    findAllBuyer,
    deleteBuyer,
    findOneBuyer,
    updateBuyer,
    myProfile
} from "../controllers/buyer.controller.js";
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

router.post("/buyerCreate", auth("buyer", "admin"), uploadImage, createBuyer);
router.get("/buyerAll", auth(), findAllBuyer);
router.post("/buyerDelete", auth("buyer", "admin"), deleteBuyer);
router.post("/buyerUpdate", auth("buyer", "admin"), uploadImage, updateBuyer);
router.get("/buyerOne", auth(), findOneBuyer);
router.get("/myProfile", auth("buyer"), myProfile);

export default router;