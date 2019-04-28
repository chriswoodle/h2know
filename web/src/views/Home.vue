<template>
    <div class="home">
        <div class='row'>
            <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
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
            <div class='card'>
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

@Component({
    components: {
        HelloWorld,
    },
})
export default class Home extends Vue {
    data = [{
        name: "Some Data", chartType: 'bar',
        values: [25, 40, 30, 35, 8, 52, 17, -4]
    }]
}
</script>
