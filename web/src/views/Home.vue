<template>
    <div class="home">
        <div class='row two'>
            <div class='card device' v-if='device'>
                <div class='label'>{{device.meta.$label || device.id}}</div>
                <div class='field'>Flow Rate</div>
                <div class='value'>{{100 * ((deviceValue) / 255).toFixed(3)}} % </div>
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

import { api } from '../websocket';

const DEVICE_ID = 'D5cc539271baae3b9f2135676';

@Component({
    components: {
        HelloWorld,
    },
})
export default class Home extends Vue {
    device: sdk.Device | null = null;
    deviceValue = 0;
    data = [{
        name: "Some Data", chartType: 'bar',
        values: [25, 40, 30, 35, 8, 52, 17, -4]
    }]
    mounted() {
        api.sdk.devices.info(DEVICE_ID).then(response => {
            Vue.set(this, 'device', response.body);
        })
        api.on('main_device', (event: ws.ServiceNotification) => {
            console.log(event);
            const notification = event.items[0];
            if (notification && notification.service === 'FlowSensor' && notification.member === 'rate') {
                console.log(notification.value);
                Vue.set(this, 'deviceValue', notification.value);
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.device {
    .label {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .field {
        font-size: 12px;
    }
    .value {
        color: $primary-blue;
    }
}
</style>
