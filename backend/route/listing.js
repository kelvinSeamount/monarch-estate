import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createListing } from "../controllers/listing.js";

const router = express.Router();

router.post("/create", verifyUser, createListing);
export default router;
