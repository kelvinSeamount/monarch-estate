import express from "express";
import { signin, signup, google, signOutUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signOutUser);
export default router;
