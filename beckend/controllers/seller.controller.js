import sellerModel from '../models/seller.Model.js'
import productModel from '../models/product.Model.js'


async function createSeller(req, res) {
    try {
        let { shopName, ownerName, phone, city, notes } = req.body

        let already = await sellerModel.findOne({ owner: req.user.id })
        if (already) {
            return res.json({ success: false, message: "Profile already created" })
        }

        let saveData = {
            shopName,
            ownerName,
            phone,
            city,
            notes,
            imageUrl: req.file ? req.file.path : "",
            owner: req.user.id
        }
        let sellerData = await sellerModel.create(saveData)
        if (sellerData) {
            return res.json({
                success: true,
                message: "The seller is created successfully"
            })
        } else {
            return res.json({
                success: false,
                message: "Failed to create seller"
            })
        }
    } catch (error) {
        console.log("CREATE ERROR:", error)
        return res.status(500).json({ success: false, message: error.message })
    }
}


// har shop ke saath uske products bhi
async function findAllSeller(req, res) {
    try {
        let sellers = await sellerModel.find().lean()
        let products = await productModel.find().lean()

        let data = sellers.map(function (s) {
            return {
                ...s,
                products: products.filter(function (p) {
                    return s.owner && p.seller && p.seller.toString() === s.owner.toString()
                })
            }
        })

        return res.json({
            success: true,
            message: "The api is working",
            data: data
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// Public: bina login ke sellers (Home page ke liye)
// phone aur owner ki id public nahi ki ja rahi
async function getPublicSellers(req, res) {
    try {
        let sellers = await sellerModel
            .find()
            .select("shopName ownerName city imageUrl notes owner")
            .lean()

        let products = await productModel
            .find()
            .select("title price imageUrl category seller")
            .lean()

        let data = sellers.map(function (s) {
            let { owner, ...publicInfo } = s
            return {
                ...publicInfo,
                products: products.filter(function (p) {
                    return owner && p.seller && p.seller.toString() === owner.toString()
                })
            }
        })

        return res.json({ success: true, data: data })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// sirf apni shop (admin kisi ki bhi)
async function deleteSeller(req, res) {
    try {
        let shop = await sellerModel.findById(req.body.id)
        if (!shop) {
            return res.json({ success: false, message: "Seller not found" })
        }
        if (req.user.role !== "admin" && String(shop.owner) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: "Access denied" })
        }
        await shop.deleteOne()
        return res.json({
            success: true,
            message: "The seller is deleted successfully",
            data: shop
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


async function findOneSeller(req, res) {
    try {
        let sellerData = await sellerModel.findOne({ _id: req.query.id })

        if (sellerData) {
            return res.json({
                success: true,
                message: "The seller is found",
                data: sellerData
            })
        } else {
            return res.json({
                success: false,
                message: "Seller not found"
            })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// sirf apni shop (admin kisi ki bhi)
async function updateSeller(req, res) {
    try {
        let { id, shopName, ownerName, phone, city, notes } = req.body

        let shop = await sellerModel.findById(id)
        if (!shop) {
            return res.json({ success: false, message: "Seller not found" })
        }
        if (req.user.role !== "admin" && String(shop.owner) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: "Access denied" })
        }

        let updateData = { shopName, ownerName, phone, city, notes }
        if (req.file) {
            updateData.imageUrl = req.file.path
        }

        let sellerData = await sellerModel.findOneAndUpdate(
            { _id: id },
            updateData,
            { new: true }
        )
        return res.json({
            success: true,
            message: "The seller is updated successfully",
            data: sellerData
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// login ke baad check: is user ki profile bani hai ya nahi
async function myProfile(req, res) {
    try {
        let seller = await sellerModel.findOne({ owner: req.user.id })
        return res.json({ success: true, exists: !!seller, data: seller })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export {
    createSeller,
    findAllSeller,
    getPublicSellers,
    deleteSeller,
    findOneSeller,
    updateSeller,
    myProfile
}