import express, {Request, request, Response} from "express";
import * as console from "console";
import {ConsumerRabbit} from "../rabbitmq/consumer.rabbit";
import {MessageProcessor} from "../message/message.process";


export const startConsume = async (request: Request, response: Response) => {
    try {
        const consumerRabbit = new ConsumerRabbit('messages');
        const messageProcessor = new MessageProcessor();

        await consumerRabbit.connect();
        await consumerRabbit.consumeMessages(10, messageProcessor.process.bind(messageProcessor));

        return response.status(200).send();
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
}
