import console from "console";
import {ConsumedMessage} from "rabbitmq/consumer.rabbit";

export class MessageProcessor {
    public async process(message: ConsumedMessage) {
        // todo: implement message processing
        console.log(`Processing message with content: ${message.content.toString()}`);
    }
}