import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  //Destructure Data
  const { username, email, password } = req.body;
  //Hash Password
  const hashedPassword = await bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  //check mail
  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(errorHandler(404, "User not found"));
  //check password
  const isValidPassword = bcryptjs.compareSync(password, existingUser.password);
  if (!isValidPassword) return next(errorHandler(401, "Wrong Credentials!"));

  //I used ID generated by MongoDB for the token
  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY);

  //destructure password
  const { password: hidenPassword, ...restInfo } = existingUser._doc;

  res
    .cookie("access_token", token, { httpOnly: true })
    .status(200)
    .json(restInfo);
  try {
  } catch (error) {
    next(error);
  }
};

//Controller fof Google Auth
export const google = async (req, res, next) => {
  try {
    //check if user exist
    const user = await User.findOne({ email: req.body.email });
    //if user exist
    if (user) {
      //create token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      //remove password & destructure
      const { password: pass, ...restInfo } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restInfo);
    } else {
      //if user dont exist
      //generate password
      const generstedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      //hass the password
      const hashedPassword = bcryptjs.hashSync(generstedPassword, 10);
      //create new user
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      //save user
      await newUser.save();
      //create token
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      //remove password & destructure
      const { password: pass, ...restInfo } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restInfo);
    }
  } catch (error) {
    next(error);
  }
};

//SignOut user API
export const signOutUser = async (req, res, next) => {
  try {
    res.cookie("access_token");
    res.status(200).json("User Signed Out");
  } catch (error) {
    next(error);
  }
};
