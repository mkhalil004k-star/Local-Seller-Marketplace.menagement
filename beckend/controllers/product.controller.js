import productModel from "../models/product.Model.js"


// Product add (sirf seller)
async function addProduct(req, res) {
    try {
        let { title, price, stock, category, description, imageUrl } = req.body

        if (!title || !price) {
            return res.json({ success: false, message: "Title and price are required" })
        }

        let product = await productModel.create({
            title,
            price,
            stock,
            category,
            description,
            imageUrl,
            seller: req.user.id      // token se aati hai, frontend se nahi
        })

        return res.json({ success: true, message: "Product added", product })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// Products, saath mein seller ka naam aur email
// Seller ko sirf apne products milenge, buyer aur admin ko sab
async function getAllProducts(req, res) {
    try {
        let filter = {}

        if (req.user.role === "seller") {
            filter.seller = req.user.id
        }

        let products = await productModel
            .find(filter)
            .populate("seller", "name email")

        return res.json({ success: true, products })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// Product update (sirf apna, admin kisi ka bhi)
async function updateProduct(req, res) {
    try {
        let { id, title, price, stock, category, description, imageUrl } = req.body

        let product = await productModel.findById(id)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }
        if (req.user.role !== "admin" && String(product.seller) !== req.user.id) {
            return res.status(403).json({ success: false, message: "Access denied" })
        }

        product.title = title
        product.price = price
        product.stock = stock
        product.category = category
        product.description = description
        product.imageUrl = imageUrl
        await product.save()

        return res.json({ success: true, message: "Product updated", product })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// Product delete (sirf apna, admin kisi ka bhi)
async function deleteProduct(req, res) {
    try {
        let product = await productModel.findById(req.body.id)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }
        if (req.user.role !== "admin" && String(product.seller) !== req.user.id) {
            return res.status(403).json({ success: false, message: "Access denied" })
        }

        await product.deleteOne()
        return res.json({ success: true, message: "Product deleted" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// Public: bina login ke sab products (Home page ke liye)
async function getPublicProducts(req, res) {
    try {
        let products = await productModel
            .find()
            .populate("seller", "name")   // email public nahi karna

        return res.json({ success: true, products })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export {
    addProduct,
    getAllProducts,
    getPublicProducts,
    updateProduct,
    deleteProduct
}