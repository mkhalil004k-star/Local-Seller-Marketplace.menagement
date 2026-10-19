import orderModel from "../models/order.Model.js";
import productModel from "../models/product.Model.js";

const DELIVERY_FEE = 100;

async function createOrder(req, res) {
    let { productId, quantity, fullName, phone, city, address, label } = req.body;

    let product = await productModel.findById(productId);

    if (!product) {
        return res.json({ success: false, message: "Product not found" });
    }

    if (!fullName || !phone || !city || !address) {
        return res.json({ success: false, message: "All delivery fields are required" });
    }

    quantity = Number(quantity) || 1;

    // label sirf Home ya Office ho sakta hai
    label = label === "Office" ? "Office" : "Home";

    let order = await orderModel.create({
        product: product._id,
        buyer: req.user.id,
        seller: product.seller,
        quantity,
        deliveryFee: DELIVERY_FEE,
        totalPrice: product.price * quantity + DELIVERY_FEE,
        fullName,
        phone,
        city,
        address,
        label
    });

    return res.json({
        success: true,
        message: "Order sent to seller",
        order
    });
}

async function sellerOrders(req, res) {
    let orders = await orderModel
        .find({ seller: req.user.id })
        .populate("product")
        .populate("buyer", "name phoneNo")
        .sort({ createdAt: -1 });

    return res.json({ success: true, data: orders });
}

async function updateOrderStatus(req, res) {
    await orderModel.findOneAndUpdate(
        { _id: req.body.id, seller: req.user.id },
        { status: req.body.status }
    );

    return res.json({ success: true, message: "Order " + req.body.status });
}

export { createOrder, sellerOrders, updateOrderStatus };