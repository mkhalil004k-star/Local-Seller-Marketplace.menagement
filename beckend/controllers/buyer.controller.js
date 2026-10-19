import buyerModel from '../models/buyer.Model.js'


async function createBuyer(req, res) {
    try {
        let { name, phone, city, address, notes } = req.body

        let already = await buyerModel.findOne({ owner: req.user.id })
        if (already) {
            return res.json({
                success: false,
                message: "Profile already created"
            })
        }

        let saveData = {
            name,
            phone,
            city,
            address,
            notes,
            imageUrl: req.file ? req.file.path : "",
            owner: req.user.id
        }
        let buyerData = await buyerModel.create(saveData)
        if (buyerData) {
            return res.json({
                success: true,
                message: "The buyer is created successfully"
            })
        } else {
            return res.json({
                success: false,
                message: "Failed to create buyer"
            })
        }
    } catch (error) {
        console.log("CREATE ERROR:", error)
        return res.status(500).json({ success: false, message: error.message })
    }
}


async function findAllBuyer(req, res) {
    try {
        let buyerData = await buyerModel.find()
        return res.json({
            success: true,
            message: "The api is working",
            data: buyerData
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// sirf apni profile (admin kisi ki bhi)
async function deleteBuyer(req, res) {
    try {
        let buyer = await buyerModel.findById(req.body.id)
        if (!buyer) {
            return res.json({ success: false, message: "Buyer not found" })
        }
        if (req.user.role !== "admin" && String(buyer.owner) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: "Access denied" })
        }
        await buyer.deleteOne()
        return res.json({
            success: true,
            message: "The buyer is deleted successfully",
            data: buyer
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


async function findOneBuyer(req, res) {
    try {
        let buyerData = await buyerModel.findOne({ _id: req.query.id })

        if (buyerData) {
            return res.json({
                success: true,
                message: "The buyer is found",
                data: buyerData
            })
        } else {
            return res.json({
                success: false,
                message: "Buyer not found"
            })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// sirf apni profile (admin kisi ki bhi)
async function updateBuyer(req, res) {
    try {
        let { id, name, phone, city, address, notes } = req.body

        let buyer = await buyerModel.findById(id)
        if (!buyer) {
            return res.json({ success: false, message: "Buyer not found" })
        }
        if (req.user.role !== "admin" && String(buyer.owner) !== String(req.user.id)) {
            return res.status(403).json({ success: false, message: "Access denied" })
        }

        let updateData = { name, phone, city, address, notes }
        if (req.file) {
            updateData.imageUrl = req.file.path
        }

        let buyerData = await buyerModel.findOneAndUpdate(
            { _id: id },
            updateData,
            { new: true }
        )
        return res.json({
            success: true,
            message: "The buyer is updated successfully",
            data: buyerData
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


// login ke baad check: is user ki profile bani hai ya nahi
async function myProfile(req, res) {
    try {
        let buyer = await buyerModel.findOne({ owner: req.user.id })
        return res.json({ success: true, exists: !!buyer, data: buyer })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export {
    createBuyer,
    findAllBuyer,
    deleteBuyer,
    findOneBuyer,
    updateBuyer,
    myProfile
}