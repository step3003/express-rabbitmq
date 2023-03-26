import express from "express";
import * as messageController from "./message.controller";
import {startConsume} from "./message.controller";
export const messageRouter = express.Router();

messageRouter.get('/', messageController.startConsume)
