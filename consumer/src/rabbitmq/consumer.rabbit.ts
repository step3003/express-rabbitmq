import * as console from "console";
import amqp, { Channel, Connection } from 'amqplib/callback_api';

interface RabbitMQSettings {
    protocol: string;
    hostname: string;
    port: number;
    username: string;
    password: string;
    vhost: string;
    authMechanism: string[];
}

export interface ConsumedMessage {
    content: Buffer;
    fields: {
        deliveryTag: number;
    };
}

export class ConsumerRabbit {
    private channel: Channel | null = null;
    private readonly rabbitSettings: RabbitMQSettings;
    private readonly queue: string;

    constructor(queue: string) {
        this.rabbitSettings = {
            protocol: 'amqp',
            hostname: 'rabbit',
            port: 5672,
            username: 'rmuser',
            password: "rmpassword",
            vhost: '/',
            authMechanism: ['PLAIN', "AMQPLAIN", "EXTERNAL"]
        };

        this.queue = queue;
    }

    public async connect(): Promise<Channel> {
        const connection = await this.createConnection();
        this.channel = await this.createChannel(connection);
        return this.channel;
    }

    private createConnection(): Promise<Connection> {
        return new Promise((resolve, reject) => {
            amqp.connect(this.rabbitSettings, (err, connection) => {
                if (err) {
                    return reject(err);
                }

                resolve(connection);
            });
        });
    }

    private createChannel(connection: Connection): Promise<Channel> {
        return new Promise((resolve, reject) => {
            connection.createChannel((err, channel) => {
                if (err) {
                    return reject(err);
                }

                resolve(channel);
            });
        });
    }

    public async consumeMessages(
        messagesToConsume: number,
        messageHandler: (message: ConsumedMessage) => Promise<void>,
    ): Promise<void> {
        if (!this.channel) {
            throw new Error('Channel not initialized');
        }

        await this.channel.prefetch(messagesToConsume);

        const messagesProcessed: any[] = [];

        await this.channel.consume(
            this.queue,
            async (message: ConsumedMessage | null) => {
                if (!message) {
                    return;
                }

                try {
                    await messageHandler(message);
                    messagesProcessed.push(message.fields.deliveryTag);
                } catch (err) {
                    console.error(`Error processing message ${message.fields.deliveryTag}: ${err}`);
                }

                if (messagesProcessed.length === messagesToConsume) {
                    this.channel!.ack(messagesProcessed[messagesToConsume - 1]);
                    messagesProcessed.forEach((deliveryTag) => {
                        if (deliveryTag !== messagesProcessed[messagesToConsume - 1]) {
                            this.channel!.ack(deliveryTag);
                        }
                    });

                    messagesProcessed.length = 0;
                }
            },
            { noAck: true }
        );
    }
}




