import express from "express";
import { protect } from "../middleware/auth.js";
import {
  accessShareLink,
  createShareLink,
  deleteShareLink,
  getUserShareLink,
} from "../controllers/shareController.js";

const shareRouter = express.Router();

shareRouter.get("/access/:token", accessShareLink);

shareRouter.use(protect);

shareRouter.post("/", createShareLink);
shareRouter.get("/", getUserShareLink);
shareRouter.delete("/:id", deleteShareLink);

export default shareRouter;
