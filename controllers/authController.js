const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password_hash });

    const token = jwt.sign(
      { id: newUser._id, username },
      process.env.JWT_SECRET
    );
    res.status(201).json({ token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};
