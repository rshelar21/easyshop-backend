const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const accountDetails = async (req, res) => {
  try {
    const user = await req.user;
    console.log(user);
    const userData = await userModel.findById(user.id).select("-password");
    console.log(userData);
    if (userData) {
      return res
        .status(200)
        .json({ result: true, data: userData, message: "User Data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};

const userLogout = async (req, res) => {
  try {
    const response = await res.clearCookie("authcookie");
    console.log(response);
    if (response) {
      return res
        .status(200)
        .json({ message: "Logout Successfully", result: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", result: false });
    }
    const searchUser = await userModel.findOne({ email });
    console.log(searchUser);

    if (!searchUser)
      return res
        .status(404)
        .json({ message: "User does not exist", result: false });

    const checkPassword = await bcrypt.compare(password, searchUser.password);

    if (!checkPassword)
      return res
        .status(404)
        .json({ message: "Invalid Password", result: false });

    const jwtToken = jwt.sign(
      {
        email: searchUser.email,
        id: searchUser._id,
      },
      process.env.JWT_SECRET
    );
    // set cookie for 30 days
    res.cookie("authcookie", jwtToken, {
      maxAge: new Date(Date.now() + 2589200000),
      httpOnly: true,
      SameSite: "None",
    });

    res.status(200).json({
      result: true,
      email: searchUser.email,
      name: searchUser.name,
      id: searchUser._id,
      message: "Login Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", result: false });
  }
};

const register = async (req, res) => {
  const { email, password, phone, name } = req.body;
  try {
    if (!email || !password || !phone || !name) {
      return res
        .status(400)
        .json({ message: "All fields are requiered", result: false });
    }

    const alreadyUser = await userModel.findOne({ email });

    if (alreadyUser) {
      return res
        .status(400)
        .json({ message: "User already exists", result: false });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      email,
      password: hashPassword,
      name,
      phone,
    });

    const jwtToken = await jwt.sign(
      {
        email: newUser.email,
        id: newUser._id,
      },
      process.env.JWT_SECRET
    );
    // set cookie for 30 days
    res.cookie("authcookie", jwtToken, {
      maxAge: new Date(Date.now() + 2589200000),
      httpOnly: true,
      SameSite: "None",
    });

    res.status(200).json({
      status: true,
      email: newUser.email,
      name: newUser.name,
      id: newUser._id,
      message: "Registerd Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", result: false });
  }
};
module.exports = {
  login,
  register,
  accountDetails,
  userLogout,
};
