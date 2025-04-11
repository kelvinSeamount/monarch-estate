import User from "../models/user.models.js";
import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
export const test = (req, res) => {
  res.json({
    message: "My API Alive",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "update your account!"));

  //user correct
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    //update user
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        //use set to prevent database hack
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      }, //save new update
      { new: true }
    );
    const { password, ...restInfo } = updateUser._doc;
    res.status(200).json(restInfo);
  } catch (error) {
    next(error);
  }
};

//Delete user API
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only delete your account"));
  try {
    //Delete user
    await User.findByIdAndDelete(req.params.id);
    res.cookie("access_token");
    res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  try {
    //check if its the real person/owner listing
    if (req.user.id === req.params.id) {
      try {
        //Get the listings
        const listings = await Listing.find({ user: req.params.id });
        res.status(200).json(listings);
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, "You can veiw only listings"));
    }
  } catch (error) {
    next(error);
  }
};
