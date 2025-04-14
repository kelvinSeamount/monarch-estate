import mongoose from "mongoose";

//USERSCHEMA
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRtOQFOpeJX6BFnLTtNcqDahZArLIWFUfs5MMFoPPVZek7b8BN8jvCrik&s",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
