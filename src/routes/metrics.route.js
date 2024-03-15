import express from "express";
const router = express.Router();
import {
  getTotalParkingOccupied,
  getTotalParkingToday,
  getParkingLogsLast7Days,

} from "../controllers/metrics.controller.js";
import { isValid } from "../config/jwt.js";
router.get("/total-parking-occupied", isValid, getTotalParkingOccupied);
router.get("/total-parking-today", isValid, getTotalParkingToday);
router.get("/income-parking-last-7-days", isValid, getParkingLogsLast7Days);

export default router;
