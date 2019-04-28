<template>
    <div class="home">
        <div class='row two'>
            <div class='card'>
                <h1>Projected usage tomorrow</h1>
                <h3 v-if='tomorrow' :class="{[tomorrow]: true}">{{tomorrow}}</h3>
                <h1>Yesterdays usage</h1>
                <h3 :class="{[yesterday.Class]: true}">{{yesterday.Class}}</h3>
                <h3>{{yesterday.Total}} Gallons</h3>
            </div>
            <div class='card'>
                <h1>Drought status</h1>
                <h2>{{drought}}</h2>
                <h3>(Higher level reflects more drought)</h3>
            </div>
        </div>
        <div class='row two'>
            <div class='card device' v-for='device in devices' :key='device.id'>
                <div v-if='device.record'>
                    <div class='label'>{{device.record.meta.$label || device.record.id}}</div>
                    <div v-for="(prop, key) in device.record.serviceProperties" :key="key" class='section'>
                        <div class='section-header'>{{key}}</div>
                        <div v-for='(value, member) in prop[0]' :key="member" class='prop'>
                            <div class='field'>{{member}}</div>
                            <div class='value' v-if='key === "FlowSensor" && member === "rate" '>{{Number.parseFloat(100 * ((value) / 255)).toFixed(2)}} %</div>
                            <div class='value' v-else-if='key === "FlowSensor" && member === "ratio" '>{{value}} G/m</div>
                            <div class='value' v-else>{{value}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='row two'>
            <router-link class='card clickable' tag='div' to="/week">

                <vue-frappe
                    id="test"
                    :labels="[
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
            ]"
                    title="Past Daily Usage (Gallons)"
                    type="axis-mixed"
                    :height="300"
                    :colors="['#308BD1', '#ffa3ef', 'light-blue']"
                    :dataSets="this.dailyUsage">
                </vue-frappe>
            </router-link>
            <router-link class='card' tag='div' to="/week">

                <vue-frappe
                    id="test2"
                    :labels="[
                '1', '2', '3', '4',
                '5', '6', '7', '8'
            ]"
                    title="Past Weekly Usage (Gallons)"
                    type="axis-mixed"
                    :height="300"
                    :colors="['#4EA4E4', '#ffa3ef', 'light-blue']"
                    :dataSets="this.weeklyUsage">
                </vue-frappe>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

import axios from 'axios';

const address = process.env.VUE_APP_ADDRESS || '';

const weeklyUsage = require('../weeklyUsage.json');
console.log(weeklyUsage);

const dailyUsage = require('../dailyUsage.json');
console.log(dailyUsage);

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
    devices: DeviceItem[] = [DEVICE_ID, devices.shower, devices.kitchenSink, devices.dishwasher, devices.washer, devices.toilet, devices.toiletLow, devices.sprinklers].map<DeviceItem>(id => {
        return {
            id,
            record: null
        };
    })
    data = [{
        name: "Some Data", chartType: 'bar',
        values: [25, 40, 30, 35, 8, 52, 17, -4]
    }]
    drought: string = '';
    yesterday = dailyUsage[0];
    tomorrow: string = '';
    weeklyUsage = [{
        name: "Past Weekly Usage", chartType: 'line',
        values: [weeklyUsage[0].Total, weeklyUsage[1].Total, weeklyUsage[2].Total, weeklyUsage[3].Total, weeklyUsage[4].Total, weeklyUsage[5].Total, weeklyUsage[6].Total, weeklyUsage[7].Total]
    }]
    dailyUsage = [{
        name: "Past Daily Usage", chartType: 'line',
        values: [dailyUsage[0].Total, dailyUsage[1].Total, dailyUsage[2].Total, dailyUsage[3].Total, dailyUsage[4].Total, dailyUsage[5].Total, dailyUsage[6].Total]
    }]
    mounted() {
        axios.post('http://10.61.0.104:8001/daily', {
            "Inputs": {
                "input1":
                    [
                        dailyUsage[0]
                    ],
            },
            "GlobalParameters": {
            }
        })
            .then((response) => {
                console.log(response);
                Vue.set(this, 'tomorrow', response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        axios.post('http://10.61.0.104:8001/drought', {
            address
        })
            .then((response) => {
                console.log(response);
                this.drought = response.data;
            })
            .catch((error) => {
                console.log(error);
            });

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
            console.log(event.deviceId, notification.service, notification.member, notification.value)
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
        margin-right: 10px;
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
h1 {
    font-size: 24px;
}
h2 {
    margin-top: 20px;
    margin-top: 20px;
    font-size: 40px;
    font-weight: 100;
}
h3 {
    margin-bottom: 10px;
    &.Low {
        font-weight: bold;
        color: $primary-blue;
    }
    &.Med {
        font-weight: bold;
        color: #e2ac38;
    }
    &.High {
        font-weight: bold;
        color: #ffda82;
    }
}
</style>
