import express from "express";
import {
  getParkingPlaces,
  getAvailableParkingPlaces,
  getParkingPlacesFree,
  createParkingPlace,
  updateParkingPlace,
  deleteParkingPlace,
  updateParkingPlaceStatus,
} from "../controllers/parking_place.controller.js";
import { isValid } from "../config/jwt.js";

const router = express.Router();

router.get("/all", isValid, getParkingPlaces);
router.get("/available", getAvailableParkingPlaces);
router.get("/parking-places-free", getParkingPlacesFree);
router.post("/create", isValid, createParkingPlace);
router.put("/update/:id", isValid, updateParkingPlace);
router.put("/update/:id/status", isValid, updateParkingPlaceStatus);
router.delete("/delete/:id", isValid, deleteParkingPlace);

export default router;
