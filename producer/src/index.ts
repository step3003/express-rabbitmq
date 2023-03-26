import express, { Request, Response } from "express";
import * as process from "process";
import * as console from "console";
import { messageRouter } from "./message/message.router";

const PORT = process.env.PORT || 3001

const app = express();


app.use(express.json());

app.use('/api/messages', messageRouter);

app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})
