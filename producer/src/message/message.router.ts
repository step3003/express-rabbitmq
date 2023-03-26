import express from "express";
import * as messageController from "./message.controller";
export const messageRouter = express.Router();

messageRouter.post('/', messageController.send)

