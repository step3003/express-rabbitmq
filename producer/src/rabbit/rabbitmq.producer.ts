import * as console from "console";
import amqp from "amqplib";

const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'rabbit',
    port: 5672,
    username: 'rmuser',
    password: "rmpassword",
    vhost: '/',
    authMechanism: ['PLAIN', "AMQPLAIN", "EXTERNAL"]
}

export interface Message {
    routeKey: string;
    email: string;
}

export default class Producer {
    private channel: any;

    async createChannel() {
        const connection = await amqp.connect(rabbitSettings);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey: string, message: string) {
        if (!this.channel) {
            await this.createChannel();
        }

        const exchangeName = 'publisher';
        await this.channel.assertExchange(exchangeName, "direct");

        const logDetails = {
            logType: routingKey,
            message: message,
            dateTime: new Date()
        }

        this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(logDetails))
        );
        this.channel.close();

        console.log(`The message ${message} is sent to exchange ${exchangeName}`);
    }
}


