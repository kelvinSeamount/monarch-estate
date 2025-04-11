import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, resizeBy, next) => {
  try {
    const listing = await Listing.create(req.body);
    return resizeBy.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  //check if listing exits
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  // listing exits & check if user matches Id
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Listing deleted successfully");
  } catch (error) {
    next(error);
  }
};
