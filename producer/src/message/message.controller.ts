import express, {Request, request, Response} from "express";
import Producer, {Message} from '../rabbitmq/rabbitmq.producer'
import * as console from "console";

export const send = async (request: Request, response: Response) => {
    try {
        const producer = new Producer();

        const message: Message = {
            routeKey: request.body.routeKey,
            email: request.body.email,
        };

        await producer.publishMessage(message.routeKey, message.email);

        return response.status(200).send();
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
}
