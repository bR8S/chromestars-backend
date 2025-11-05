import express from 'express'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { body, validationResult } from 'express-validator'

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, first_name, last_name, email, phone_number, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({ 
      username,
      first_name,
      last_name,
      phone_number,
      email,
      password: hashedPassword,
      profile_image: `${req.headers.origin}/file/default-profile.png`,
      background_image: `${req.headers.origin}/file/default-bg.png`,
      bio: "placeholder bio",
      wins: 0,
      losses: 0,
      competitions: 0,
      score: 0,
      elo: 1000,
      placements: [],
      streak: 0,
      podium_count: 0,
      rivals: [],
      admin: false
    })

    await user.save()

    // Optionally, return a JWT immediately
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.status(201).json({ user: { id: user._id, username, email }, token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.json({ user: { id: user._id, username: user.username, email }, token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router;