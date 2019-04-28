<template>
    <div class="home">
        <div class='row two'>
            <div class='card device' v-for='device in devices' :key='device.id'>
                <div v-if='device.record'>
                    <div class='label'>{{device.record.meta.$label || device.record.id}}</div>
                    <div v-for="(prop, key) in device.record.serviceProperties" :key="key" class='section'>
                        <div class='section-header'>{{key}}</div>
                        <div v-for='(value, member) in prop[0]' :key="member" class='prop'>
                            <div class='field'>{{member}}</div>
                            <div class='value' v-if='key === "FlowSensor" && member === "rate" '>{{Number.parseFloat(100 * ((value) / 255)).toFixed(2)}} %</div>
                            <div class='value' v-else>{{value}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='row two'>
            <div class='card'>
                <vue-frappe
                    id="test"
                    :labels="[
                '12am-3am', '3am-6am', '6am-9am', '9am-12pm',
                '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'
            ]"
                    title="My Awesome Chart"
                    type="axis-mixed"
                    :height="300"
                    :colors="['#308BD1', '#ffa3ef', 'light-blue']"
                    :dataSets="this.data">
                </vue-frappe>
            </div>
            <div class='card clickable'>
                <vue-frappe
                    id="test2"
                    :labels="[
                '12am-3am', '3am-6am', '6am-9am', '9am-12pm',
                '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'
            ]"
                    title="My Awesome Chart"
                    type="axis-mixed"
                    :height="300"
                    :colors="['#4EA4E4', '#ffa3ef', 'light-blue']"
                    :dataSets="this.data">
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
    device: sdk.Device | null = null;
    deviceValue = 0;
    devices: DeviceItem[] = [DEVICE_ID, devices.shower, devices.kitchenSink, devices.dishwasher, devices.washer, devices.toilet, devices.sprinklers].map<DeviceItem>(id => {
        return {
            id,
            record: null
        };
    })
    data = [{
        name: "Some Data", chartType: 'bar',
        values: [25, 40, 30, 35, 8, 52, 17, -4]
    }]
    mounted() {
        this.devices.forEach(item => {
            api.sdk.devices.info(item.id, { expand: [sdk.DeviceExpandOptions.ServiceProperties] }).then(response => {
                // Vue.set(item, 'record', (this as any).$deepModel(response.body));
                item.record = response.body;
                console.log(item)
            })
        })
        // api.sdk.devices.info(DEVICE_ID).then(response => {
        //     Vue.set(this, 'device', response.body);
        // })
        api.on('info', (event: ws.ServiceNotification) => {
            const notification = event.items[0];
            console.log(event.deviceId, notification.service,notification.member, notification.value)
            // const devices: DeviceItem[] = Object.assign([], this.devices);
            const found = this.devices.find(item => item.id === event.deviceId);
            if (!found) return;
            if (found.record && found.record.serviceProperties && found.record.serviceProperties[notification.service]) {
                // console.log('yes', found, notification.value);
                // (this as any).$vueSet(found, `record.serviceProperties.${notification.service}.0.${notification.member}`, notification.value);
                Vue.set(found.record.serviceProperties[notification.service]["0"], notification.member, notification.value);
                // console.log(devices);
                // replaceArray(this.devices, devices);
            }

            // if (notification && notification.service === 'FlowSensor' && notification.member === 'rate') {
            //     console.log(notification.value);
            //     Vue.set(this, 'deviceValue', notification.value);
            // }
        })
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
