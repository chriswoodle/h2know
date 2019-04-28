const WS_HOST = 'ws://localhost:3010';
const HOST = 'http://localhost:3000';
const TOKEN = process.env.VUE_APP_DROPLIT_TOKEN || '';

const ENVIRONMENT_ID = 'E5cc53927ebda03991a97dfa4';

const DEVICE_ID = 'D5cc539271baae3b9f2135676';

import { EventEmitter } from 'events';

import * as Droplit from '@droplit/sdk';
import * as DroplitWS from '@droplit/websocket-sdk';

import debug from 'debug';
const log = debug('app:socket');

class DroplitSocket extends EventEmitter {

    sessionId: string = '';
    socket: DroplitWS.DroplitClient;
    sdk: Droplit.Droplit;

    constructor() {
        super();
        this.sdk = Droplit.instance();
        this.sdk.initialize(HOST, TOKEN);

        this.socket = new DroplitWS.DroplitClient(WS_HOST, TOKEN);
        this.socket.on('connectSuccess', () => {
            log('ws client connected.');

        });
        this.socket.on('sessionStartSuccess', (sessionId) => {
            log('sessionId', sessionId);
            this.sessionId = sessionId;
            // this.sdk.environments.info(ENVIRONMENT_ID, { subscription: "add", sessionId: sessionId});
            this.sdk.devices.list(ENVIRONMENT_ID, { subscription: "add", sessionId: sessionId });
        });
        this.socket.on('serviceNotification', (serviceNotification) => {
            log(serviceNotification);
            if (serviceNotification.deviceId === DEVICE_ID) {
                this.emit('main_device', serviceNotification);
            }
        });

        this.socket.on('dataNotification', (dataNotification) => {
            log(dataNotification);
        });

        this.socket.on('close', (code, reason) => {
            log('disconnected', code, reason);
            log('ws client disconnected.');
        });
        this.socket.on('error', (error) => {
            log(error);
        });
    }
}

export const DSocket = new DroplitSocket();