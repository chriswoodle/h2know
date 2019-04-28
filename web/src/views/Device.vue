<template>
    <div class="device">
        <div class='row'>
            <div class='card' v-if='device'>
                <div class='label'>{{device.meta.$label || device.id}}</div>
                <vue-frappe
                    v-if='this.history.length > 0 && !hide'
                    ref='chart'
                    id="test"
                    :labels="labels"
                    title="Flow Rate"
                    type="axis-mixed"
                    :height="300"
                    :colors="['#308BD1']"
                    :dataSets="dataSets">
                </vue-frappe>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

import * as ws from '@droplit/websocket-sdk';
import * as sdk from '@droplit/sdk';

import * as devices from '../devices';
import { api } from '../websocket';

const DEVICE_ID = 'D5cc539271baae3b9f2135676';

interface DeviceItem {
    id: string,
    record: sdk.Device | null
}

@Component({
    components: {
        HelloWorld,
    },
})
export default class Home extends Vue {
    
    hide = false;
    device: sdk.Device | null = null;
    history: number[] = [];
    deviceValue = 0;
    get dataSets() {
        return [{
            name: 'Rate', chartType: 'line',
            values: this.history
        }]
    }
    get labels() {
        return Array(this.history.length).fill('');
    }
    devices: DeviceItem[] = [DEVICE_ID, devices.shower, devices.kitchenSink, devices.dishwasher, devices.washer, devices.toilet, devices.sprinklers].map<DeviceItem>(id => {
        return {
            id,
            record: null
        };
    })
    mounted() {
        api.sdk.devices.info(DEVICE_ID, { expand: [sdk.DeviceExpandOptions.ServiceProperties] }).then(response => {
            Vue.set(this, 'device', response.body);
        })

        api.sdk.devices.history(DEVICE_ID, undefined, 50).then(response => {
            replaceArray(this.history, response.body.items
                .filter(item => item.member === 'rate' && item.service === 'FlowSensor')
                .map<number>(item => <any>item.value));
            console.log('history', this.history);
        })
        api.on('info', (event: ws.ServiceNotification) => {
            const notification = event.items[0];
            console.log(event.deviceId, notification.service, notification.member, notification.value)
            if (this.device && this.device.id === event.deviceId)
                if (this.device.serviceProperties && this.device.serviceProperties[notification.service]) {
                    if (notification.member === 'rate' && notification.service === 'FlowSensor') {
                        console.log(this.history)
                        this.history.pop();
                        this.history.unshift(notification.value);
                        console.log((this.$refs['chart'] as any).update());
                    }
                    Vue.set(this.device.serviceProperties[notification.service]["0"], notification.member, notification.value);
                }
        })
    }
    destroyed() {
        api.removeAllListeners();
    }
}

function replaceArray<T>(array: T[], newValues: T[]) {
    array.splice(0, array.length, ...newValues);
}
</script>

<style lang="scss" scoped>
.device {
    .label {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .prop {
        display: inline-block;
        .field {
            font-size: 12px;
        }
        .value {
            color: $primary-blue;
        }
    }

    .section {
        display: inline-block;
        margin-right: 20px;
        .section-header {
            margin-bottom: 5px;

            color: gray;
        }
    }
}
</style>
