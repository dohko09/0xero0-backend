import express from "express";
import {
  getParking,
  getParkingView,
  createParking,
  updateParking,
  deleteParking,
} from "../controllers/parking.controller.js";
import { isValid } from "../config/jwt.js";

const router = express.Router();

router.get("/all", isValid, getParking);
router.get("/view/:id", getParkingView);
router.post("/create", isValid, createParking);
router.put("/:id/update", isValid, updateParking);
router.delete("/delete/:id", isValid, deleteParking);

export default router;
