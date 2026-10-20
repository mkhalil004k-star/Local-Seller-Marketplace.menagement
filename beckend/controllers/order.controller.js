import orderModel from "../models/order.Model.js";
import productModel from "../models/product.Model.js";

const DELIVERY_FEE = 100;

// seller kis status se kis status par ja sakta hai
const SELLER_FLOW = {
    pending: ["confirmed", "rejected"],
    confirmed: ["shipped", "rejected"],
    shipped: ["delivered"]
};

async function createOrder(req, res) {
    let { productId, quantity, fullName, phone, city, address, label } = req.body;

    let product = await productModel.findById(productId);
    if (!product) {
        return res.json({ success: false, message: "Product not found" });
    }

    if (!fullName || !phone || !city || !address) {
        return res.json({ success: false, message: "All delivery fields are required" });
    }

    quantity = Number(quantity);
    if (!quantity || quantity < 1) quantity = 1;

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
        label,
        statusHistory: [{ status: "pending" }]
    });

    return res.json({ success: true, message: "Order sent to seller", order });
}

async function sellerOrders(req, res) {
    let orders = await orderModel
        .find({ seller: req.user.id })
        .populate("product")
        .populate("buyer", "name phoneNo")
        .sort({ createdAt: -1 });

    return res.json({ success: true, data: orders });
}

async function buyerOrders(req, res) {
    let orders = await orderModel
        .find({ buyer: req.user.id })
        .populate("product")
        .populate("seller", "name phoneNo")
        .sort({ createdAt: -1 });

    return res.json({ success: true, data: orders });
}

async function updateOrderStatus(req, res) {
    let { id, status, sellerNote } = req.body;

    let order = await orderModel.findOne({ _id: id, seller: req.user.id });
    if (!order) {
        return res.json({ success: false, message: "Order not found" });
    }

    let allowed = SELLER_FLOW[order.status] || [];
    if (!allowed.includes(status)) {
        return res.json({ success: false, message: "Order " + order.status + " se " + status + " nahi ho sakta" });
    }

    order.status = status;
    if (sellerNote) order.sellerNote = sellerNote;
    order.buyerSeen = false;
    order.statusHistory.push({ status });
    await order.save();

    return res.json({ success: true, message: "Order " + status, order });
}

async function cancelOrder(req, res) {
    let order = await orderModel.findOne({ _id: req.body.id, buyer: req.user.id });
    if (!order) {
        return res.json({ success: false, message: "Order not found" });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
        return res.json({ success: false, message: "Ab order cancel nahi ho sakta" });
    }

    order.status = "cancelled";
    order.sellerSeen = false;
    order.statusHistory.push({ status: "cancelled" });
    await order.save();

    return res.json({ success: true, message: "Order cancelled" });
}

async function returnOrder(req, res) {
    let { id, returnReason } = req.body;

    let order = await orderModel.findOne({ _id: id, buyer: req.user.id });
    if (!order) {
        return res.json({ success: false, message: "Order not found" });
    }

    if (order.status !== "delivered") {
        return res.json({ success: false, message: "Return sirf delivered order ka ho sakta hai" });
    }

    if (!returnReason) {
        return res.json({ success: false, message: "Return ki wajah likhein" });
    }

    order.status = "return_requested";
    order.returnReason = returnReason;
    order.sellerSeen = false;
    order.statusHistory.push({ status: "return_requested" });
    await order.save();

    return res.json({ success: true, message: "Return request seller ko bhej di" });
}

async function returnDecision(req, res) {
    let { id, accept, sellerNote } = req.body;

    let order = await orderModel.findOne({ _id: id, seller: req.user.id });
    if (!order || order.status !== "return_requested") {
        return res.json({ success: false, message: "Return request not found" });
    }

    order.status = accept ? "returned" : "return_rejected";
    if (sellerNote) order.sellerNote = sellerNote;
    order.buyerSeen = false;
    order.statusHistory.push({ status: order.status });
    await order.save();

    return res.json({ success: true, message: "Order " + order.status });
}

// sidebar badge ke liye
async function unreadCount(req, res) {
    let asBuyer = await orderModel.countDocuments({ buyer: req.user.id, buyerSeen: false });
    let asSeller = await orderModel.countDocuments({ seller: req.user.id, sellerSeen: false });

    return res.json({ success: true, count: asBuyer + asSeller });
}

// jab user apna Orders page khole
async function markSeen(req, res) {
    await orderModel.updateMany({ buyer: req.user.id, buyerSeen: false }, { buyerSeen: true });
    await orderModel.updateMany({ seller: req.user.id, sellerSeen: false }, { sellerSeen: true });

    return res.json({ success: true });
}

export {
    createOrder, sellerOrders, buyerOrders, updateOrderStatus,
    cancelOrder, returnOrder, returnDecision, unreadCount, markSeen
};