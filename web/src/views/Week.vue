<template>
    <div class="device">
        <div class='row'>
            <div class='card'>
                <div class='header'>Past Week</div>
                <vue-frappe
                    ref='chart'
                    id="test"
                    :labels="[
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
            ]"
                    title="Flow Rate"
                    type="axis-mixed"
                    :height="300"
                    :colors="['#308BD1']"
                    :dataSets="dailyUsage">
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

const dailyUsage = require('../dailyUsage.json');
console.log(dailyUsage);

const week = [dailyUsage[0],dailyUsage[1],dailyUsage[2],dailyUsage[3],dailyUsage[4],dailyUsage[5],dailyUsage[6]];
console.log(week);

@Component
export default class Home extends Vue {
    dailyUsage = [{
        name: "Total", chartType: 'line',
        values: week.map(i => i.Total)
    },
    {
        name: "Basin", chartType: 'line',
        values: week.map(i => i.Basin)
    },
    {
        name: "Shower", chartType: 'line',
        values: week.map(i => i.Shower)
    },
    {
        name: "Kitchen", chartType: 'line',
        values: week.map(i => i.Kitchen)
    },
     {
        name: "Toilet Low", chartType: 'line',
        values: week.map(i => i['Toilet Low'])
    },
      {
        name: "Toilet High", chartType: 'line',
        values: week.map(i => i['Toilet High'])
    }]
    mounted() {
     
    }
    destroyed() {
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
