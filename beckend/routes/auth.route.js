import express from 'express'
import authModel from '../models/auth.Model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import auth from '../middleware/auth.js'

let router = express.Router()

function makeToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )
}

function setTokenCookie(res, token) {
  let isProduction = process.env.NODE_ENV === 'production'

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

router.post('/registration', async function (req, res) {
  try {
    let data = req.body

    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.role ||
      !data.phoneNo
    ) {
      return res.json({
        success: false,
        message: 'Name, email, password, role and phone number are required'
      })
    }

    if (!['seller', 'buyer'].includes(data.role)) {
      return res.json({
        success: false,
        message: 'Invalid role'
      })
    }

    let phoneNo = String(data.phoneNo).replace(/\D/g, '')

    if (
      phoneNo.length !== 11 ||
      !phoneNo.startsWith('03')
    ) {
      return res.json({
        success: false,
        message: 'Phone number 03XXXXXXXXX (11 digits) hona chahiye'
      })
    }

    let existing = await authModel.findOne({
      email: data.email
    })

    if (existing) {
      return res.json({
        success: false,
        message: 'Email already registered'
      })
    }

    let hashPassword = await bcrypt.hash(data.password, 10)

    if (data.role === 'seller') {
      if (!data.cnicNo) {
        return res.json({
          success: false,
          message: 'CNIC is required for seller'
        })
      }

      let cnicNo = String(data.cnicNo).replace(/\D/g, '')

      if (cnicNo.length !== 13) {
        return res.json({
          success: false,
          message: 'CNIC 13 digits ka hona chahiye'
        })
      }

      let user = await authModel.create({
        name: data.name,
        email: data.email,
        password: hashPassword,
        phoneNo: phoneNo,
        cnicNo: cnicNo,
        location: '',
        role: 'seller'
      })

      let token = makeToken(user)

      setTokenCookie(res, token)

      return res.json({
        success: true,
        message: 'Seller registration successful',
        token,
        role: user.role,
        name: user.name
      })
    }

    if (data.role === 'buyer') {
      if (!data.location) {
        return res.json({
          success: false,
          message: 'Location is required for buyer'
        })
      }

      let user = await authModel.create({
        name: data.name,
        email: data.email,
        password: hashPassword,
        phoneNo: phoneNo,
        cnicNo: '',
        location: data.location,
        role: 'buyer'
      })

      let token = makeToken(user)

      setTokenCookie(res, token)

      return res.json({
        success: true,
        message: 'Buyer registration successful',
        token,
        role: user.role,
        name: user.name
      })
    }

  } catch (err) {
    return res.json({
      success: false,
      message: err.message
    })
  }
})

// Normal login: sirf seller aur buyer. Admin yahan se andar nahi aa sakta.
router.post('/login', async function (req, res) {
  try {
    let user = await authModel.findOne({
      email: req.body.email
    })

    if (!user || user.role === 'admin') {
      return res.json({
        success: false,
        message: 'Email or password is not correct'
      })
    }

    let isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (!isMatch) {
      return res.json({
        success: false,
        message: 'Email or password is not correct'
      })
    }

    let token = makeToken(user)

    setTokenCookie(res, token)

    return res.json({
      success: true,
      message: 'You are login',
      token,
      role: user.role,
      name: user.name
    })

  } catch (err) {
    return res.json({
      success: false,
      message: err.message
    })
  }
})

// Admin ka alag login (frontend par chhupe hue URL se call hota hai)
router.post('/admin-login', async function (req, res) {
  try {
    let user = await authModel.findOne({
      email: req.body.email
    })

    // Har galti par same message, taake pata na chale ke kaun admin hai
    if (!user || user.role !== 'admin') {
      return res.json({
        success: false,
        message: 'Email or password is not correct'
      })
    }

    let isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (!isMatch) {
      return res.json({
        success: false,
        message: 'Email or password is not correct'
      })
    }

    let token = makeToken(user)

    setTokenCookie(res, token)

    return res.json({
      success: true,
      message: 'Admin login',
      token,
      role: user.role,
      name: user.name
    })

  } catch (err) {
    return res.json({
      success: false,
      message: err.message
    })
  }
})

router.post('/logout', function (req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production'
      ? 'none'
      : 'lax'
  })

  return res.json({
    success: true,
    message: 'Logged out'
  })
})

router.get(
  '/admin/profile',
  auth('admin'),
  async function (req, res) {
    try {
      let user = await authModel
        .findById(req.user.id)
        .select('-password')

      return res.json({
        success: true,
        user
      })

    } catch (err) {
      return res.json({
        success: false,
        message: err.message
      })
    }
  }
)

router.get(
  '/admin/sellers',
  auth('admin'),
  async function (req, res) {
    try {
      let sellers = await authModel
        .find({
          role: 'seller'
        })
        .select('-password')

      return res.json({
        success: true,
        sellers
      })

    } catch (err) {
      return res.json({
        success: false,
        message: err.message
      })
    }
  }
)

router.get(
  '/admin/buyers',
  auth('admin'),
  async function (req, res) {
    try {
      let buyers = await authModel
        .find({
          role: 'buyer'
        })
        .select('-password')

      return res.json({
        success: true,
        buyers
      })

    } catch (err) {
      return res.json({
        success: false,
        message: err.message
      })
    }
  }
)

router.get(
  '/admin/allProfiles',
  auth('admin'),
  async function (req, res) {
    try {
      let users = await authModel
        .find({
          role: {
            $in: ['seller', 'buyer']
          }
        })
        .select('-password')

      return res.json({
        success: true,
        users
      })

    } catch (err) {
      return res.json({
        success: false,
        message: err.message
      })
    }
  }
)

router.get(
  '/seller/profile',
  auth('seller'),
  async function (req, res) {
    try {
      let user = await authModel
        .findById(req.user.id)
        .select('-password')

      return res.json({
        success: true,
        user
      })

    } catch (err) {
      return res.json({
        success: false,
        message: err.message
      })
    }
  }
)

router.get(
  '/buyer/profile',
  auth('buyer'),
  async function (req, res) {
    try {
      let user = await authModel
        .findById(req.user.id)
        .select('-password')

      return res.json({
        success: true,
        user
      })

    } catch (err) {
      return res.json({
        success: false,
        message: err.message
      })
    }
  }
)

export default router