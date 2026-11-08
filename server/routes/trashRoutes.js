import express from "express";
import { protect } from "../middleware/auth";
import { emptyTrash, getTrashItems } from "../controllers/trashController";

const trashRouter = express.Router();

trashRouter.use(protect);

trashRouter.get("/", getTrashItems);
trashRouter.post("/empty", emptyTrash);

export default trashRouter;
