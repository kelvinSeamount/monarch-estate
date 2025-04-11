import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createListing, deleteListing } from "../controllers/listing.js";

const router = express.Router();

router.post("/create", verifyUser, createListing);
router.delete("/delete", verifyUser, deleteListing);
export default router;
