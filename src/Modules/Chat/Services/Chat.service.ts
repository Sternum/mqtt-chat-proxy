import { Injectable } from '@nestjs/common';
import { connect, IClientOptions, MqttClient } from 'mqtt';

@Injectable()
export class ChatService {
  private client: MqttClient;
  constructor() {
    console.log(process.env.MOSQUITTO_USERNAME, process.env.MOSQUITTO_PASSWORD);
    const options: IClientOptions = {
      username: process.env.MOSQUITTO_USERNAME,
      password: process.env.MOSQUITTO_PASSWORD,
    };

    this.client = connect(process.env.MOSQUITTO_URL, options);

    this.client.on('connect', () => console.log('Connect'));

    this.client.on('error', () => console.log('ERROR'));
  }

  subscribe(topic: string, callback: (topic: string, message: Buffer) => void) {
    this.client.subscribe(topic, (err) => {
      if (!err) {
        this.client.on('message', callback);
      }
    });
  }

  publish(topic: string, message: string) {
    this.client.publish(topic, message);
  }
}
