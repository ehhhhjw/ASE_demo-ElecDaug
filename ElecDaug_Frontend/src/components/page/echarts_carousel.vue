<template>
    <div class="block">
        <!-- <span class="demonstration">Click 指示器触发</span> -->
        <el-carousel trigger="click" height="400px">
            <el-carousel-item v-for="item in 3" :key="item">
                <div v-if="item == 1" id="main1" style="width: 95%; height: 400px; margin: 0 auto"></div>
                <div v-if="item == 2" id="main2" style="width: 95%; height: 400px; margin: 0 auto"></div>
                <div v-if="item == 3" id="main3" style="width: 95%; height: 400px; margin: 0 auto"></div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import * as echarts from 'echarts';
export default {
    name: 'dashboard',
    data() {
        return {
            activeName: 'first',
            selfstyle: {
                'margin-left': '0px !important',
                fontSize: '35px',
                width: '100%',
                height: '100px'
            },
            tableButtonData: [
                {
                    action: '获取设置'
                }
            ],
            tableData: [],
            name: sessionStorage.getItem('ms_username'),
            data: [],
            systemStatusData: {
                CPUStatus: -1,
                GPUStatus: -1,
                memoryStatus: -1
            },
            StructuredDataNum: 1,
            TextDataNum: 36,
            EmergencyDataNum: 0,
            OnlineUsersNum: 0,
            ConversionRate: 0,
            PassRate: 0,
            RunningTask: {},
            RunningTask_name: [],
            RunningTask_num: [],
            RunningTask_final: [],
            i: 0,
            logShow_new_two: [],
            dates: [],
            methods: [],
            datas_ran: [],
            datas_finish: [],
            datas_generate: [],
            tmep_series_ran: [],
            tmep_series_finish: [],
            tmep_series_generate: [],
            myChart: null,
            myChart2: null,
            myChart3: null
        };
    },
    destroyed() {
        clearInterval(this.timer);
    },
    created() {
        this.getECharts();
    },
    mounted() {
        this.getECharts();
        this.timer = setInterval(() => {
            this.getECharts();
        }, 1000 * 60);
    },
    methods: {
        handleClick() {
            this.getTwo();
        },
        getECharts() {
            console.log('getECharts');
            this.getTwo();
        },
        async getTwo() {
            console.log('getTwo');
            const { data: data } = await this.$http.get('log/recent_fifteen_days/');
            if (data.code !== 20000) {
                return this.$message.error('获取近15日系统日志数据失败！' + '错误原因：' + data.msg);
            }
            this.logData = data.data;

            this.showData();
        },
        showData() {
            console.log('showData');
            this.dates = [];
            this.methods = [];
            this.datas_ran = [];
            this.datas_finish = [];
            this.datas_generate = [];
            this.tmep_series_ran = [];
            this.tmep_series_finish = [];
            this.tmep_series_generate = [];
            var flag = true;
            for (var date in this.logData) {
                this.dates.push(date);
                for (var method in this.logData[date]) {
                    if (flag) {
                        this.methods.push(method);
                    }
                }
                flag = false;
            }

            for (var method in this.methods) {
                var temp_ran = [];
                var temp_finish = [];
                var temp_generate = [];
                for (var date in this.dates) {
                    temp_ran.push(this.logData[this.dates[date]][this.methods[method]]['ran_task_number']);
                    temp_finish.push(this.logData[this.dates[date]][this.methods[method]]['finish_task_number']);
                    temp_generate.push(this.logData[this.dates[date]][this.methods[method]]['generate_data_number']);
                }
                this.datas_ran.push(temp_ran);
                this.datas_finish.push(temp_finish);
                this.datas_generate.push(temp_generate);
            }

            for (var i = 0; i < this.methods.length; i++) {
                var getone = {};
                getone.type = 'line';
                getone.areaStyle = {};
                getone.name = this.methods[i];
                getone.data = this.datas_ran[i].reverse();
                this.tmep_series_ran.push(getone);
            }
            // console.log('this.tmep_series_ran:', this.tmep_series_ran);
            // this.tmep_series_ran.reverse();
            // console.log('this.tmep_series_ran:', this.tmep_series_ran);

            if (this.myChart != null && this.myChart != '' && this.myChart != undefined) {
                this.myChart.dispose();
            }
            var temp_data_ran = [];
            temp_data_ran.push(this.temp_series_ran[0], this.temp_series_ran[1], this.temp_series_ran[2]);
            console.log('temp_data_ran:', temp_data_ran);
            this.myChart = echarts.init(document.getElementById('main1'));
            var option = {
                title: {
                    text: '运行任务数监控',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['FGSM-激光雷达', 'I-FGSM(BIM)-激光雷达', 'JSMA-激光雷达'],
                    top: '10%'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: this.dates.reverse()
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: temp_data_ran
            };
            console.log('option:', option);
            console.log('typeof option:', typeof option);
            if (option && typeof option === 'object') {
                console.log('update main1');
                this.myChart.setOption(option, true);
            }

            for (var i = 0; i < this.methods.length; i++) {
                var getone = {};
                getone.type = 'line';
                getone.areaStyle = {};
                getone.name = this.methods[i];
                getone.data = this.datas_finish[i].reverse();
                this.tmep_series_finish.push(getone);
            }
            if (this.myChart2 != null && this.myChart2 != '' && this.myChart2 != undefined) {
                this.myChart2.dispose();
            }
            this.myChart2 = echarts.init(document.getElementById('main2'));
            var option2 = {
                title: {
                    text: '完成任务数监控',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: this.methods,
                    top: '8%'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: this.dates
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: this.tmep_series_finish
            };
            console.log('option2:', option2);
            console.log('typeof option2:', typeof option2);
            if (option2 && typeof option2 === 'object') {
                console.log('update main2');
                this.myChart2.setOption(option2, true);
            }
            for (var i = 0; i < this.methods.length; i++) {
                var getone = {};
                getone.type = 'line';
                getone.areaStyle = {};
                getone.name = this.methods[i];
                getone.data = this.datas_generate[i].reverse();
                this.tmep_series_generate.push(getone);
            }
            if (this.myChart3 != null && this.myChart3 != '' && this.myChart3 != undefined) {
                this.myChart3.dispose();
            }
            this.myChart3 = echarts.init(document.getElementById('main3'));
            var option3 = {
                title: {
                    text: '生成数据量监控',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: this.methods,
                    top: '8%'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: this.dates
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: this.tmep_series_generate
            };
            console.log('option3:', option3);
            console.log('typeof option3:', typeof option3);
            if (option3 && typeof option3 === 'object') {
                console.log('update main3');
                this.myChart3.setOption(option3, true);
            }
        }
    }
};
</script>

<style></style>
