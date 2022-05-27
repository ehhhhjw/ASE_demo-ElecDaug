<template>
    <div>
        <el-row :gutter="20" style="margin-bottom: 0px">
            <el-col :span="18">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <!-- 快捷方式 -->
                        <!-- <cardShortcut></cardShortcut> -->
                        <cardSystemReport></cardSystemReport>
                    </el-col>
                    <el-col :span="8">
                        <cardMethods></cardMethods>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="6">
                <!-- 平台信息 -->
                <cardPlatInfo></cardPlatInfo>
                <!-- 系统报告 -->
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-card shadow="hover">
                    <div class="block">
                        <el-carousel trigger="click" height="400px">
                            <el-carousel-item v-for="item in 3" :key="item">
                                <div v-if="item == 1" id="main1" style="width: 95%; height: 400px; margin: 0 auto"></div>
                                <div v-if="item == 2" id="main2" style="width: 95%; height: 400px; margin: 0 auto"></div>
                                <div v-if="item == 3" id="main3" style="width: 95%; height: 400px; margin: 0 auto"></div>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </el-card>
                <!-- <el-card shadow="hover">
                    <div class="block">
                        <echart-carousel></echart-carousel>
                    </div>
                </el-card> -->
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import * as echarts from 'echarts';
import echartCarousel from './echarts_carousel.vue';
import cardShortcut from './card_shortcut.vue';
import cardMethods from './card_methods.vue';
import cardPlatInfo from './card_plat_info.vue';
import cardSystemReport from './card_system_report.vue';
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
            temp_series_ran: [],
            temp_series_finish: [],
            temp_series_generate: [],
            myChart: null,
            myChart2: null,
            myChart3: null
        };
    },
    components: {
        Schart,
        echartCarousel,
        cardShortcut,
        cardMethods,
        cardPlatInfo,
        cardSystemReport
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    destroyed() {
        clearInterval(this.timer);
    },
    async created() {
        const { data: data } = await this.$http.get('/user/');
    },
    mounted() {
        let week = ['日', '一', '二', '三', '四', '五', '六'];
        setInterval(() => {
            var date_time = (this.tableData = [
                {
                    key: '平台名',
                    value: '智能系统软件测试数据生成平台'
                },
                {
                    key: '版本号',
                    value: 'Ver 1.0'
                },
                {
                    key: '时间',
                    value:
                        new Date().toLocaleDateString() +
                        '  ' +
                        new Date().toLocaleTimeString('it-IT') +
                        '  星期' +
                        week[new Date().getDay()]
                }
            ]);
        }, 1000);
        this.$store.commit('setUserId', sessionStorage.getItem('userId'));

        this.getPerformance();
        // this.getOnlineUser();
        this.getRunningTask();
        this.getECharts();
        this.timer = setInterval(() => {
            this.getPerformance();
            // this.getOnlineUser();
            this.getRunningTask();
            this.getECharts();
        }, 1000 * 60);
    },
    methods: {
        handleClick() {
            this.getTwo();
        },
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        async getPerformance() {
            const { data: data } = await this.$http.get('/system_status/performance/');
            if (data.code !== 20000) {
                return this.$message.error('获取当前系统性能失败！' + '错误原因：' + data.msg);
            }
            this.systemStatusData.CPUStatus = parseInt(data.data.cpu);
            this.systemStatusData.memoryStatus = parseInt(data.data.memory);
        },
        async getOnlineUser() {
            const { data: data } = await this.$http.get('/system_status/online_user/');
            if (data.code !== 20000) {
                return this.$message.error('获取在线人数失败！');
            }
            this.OnlineUsersNum = data.data.online_user;
        },
        async getRunningTask() {
            const { data: data } = await this.$http.get('/system_status/running_task/');
            if (data.code !== 20000) {
                return this.$message.error('获取正在运行各生成任务失败！' + '错误原因：' + data.msg);
            }
            this.RunningTask = data.data;
            this.RunningTask_name = Object.keys(this.RunningTask);
            this.RunningTask_num = Object.values(this.RunningTask);
            let rf = [];
            for (var i = 0; i < this.RunningTask_name.length; i++) {
                var x = {};
                x.name = this.RunningTask_name[i];
                x.num = this.RunningTask_num[i];
                rf.push(x);
            }
            this.RunningTask_final = rf;
        },
        getECharts() {
            this.getTwo();
        },
        async getTwo() {
            const { data: data } = await this.$http.get('log/recent_fifteen_days/');
            if (data.code !== 20000) {
                return this.$message.error('获取近15日系统日志数据失败！' + '错误原因：' + data.msg);
            }
            this.logData = data.data;

            this.showData();
        },
        showData() {
            console.log('showData1');
            this.dates = [];
            this.methods = [];
            this.datas_ran = [];
            this.datas_finish = [];
            this.datas_generate = [];
            this.temp_series_ran = [];
            this.temp_series_finish = [];
            this.temp_series_generate = [];
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
            console.log('showData2');
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
                this.temp_series_ran.push(getone);
            }
            // console.log('this.temp_series_ran:', this.temp_series_ran);
            // this.temp_series_ran.reverse();
            // console.log('this.temp_series_ran:', this.temp_series_ran);
            console.log('showData3');
            if (this.myChart != null && this.myChart != '' && this.myChart != undefined) {
                this.myChart.dispose();
            }
            var temp_data_ran = [];
            temp_data_ran.push(this.temp_series_ran[0], this.temp_series_ran[1], this.temp_series_ran[2]);
            console.log('temp_data_ran:', temp_data_ran);
            this.myChart = echarts.init(document.getElementById('main1'));
            console.log('showData4');
            var option = {
                title: {
                    text: 'Running Tasks',
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
            console.log('showData5');
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
                this.temp_series_finish.push(getone);
            }
            var temp_data_finish = [];
            temp_data_finish.push(this.temp_series_finish[0], this.temp_series_finish[1], this.temp_series_finish[2]);
            if (this.myChart2 != null && this.myChart2 != '' && this.myChart2 != undefined) {
                this.myChart2.dispose();
            }
            this.myChart2 = echarts.init(document.getElementById('main2'));
            var option2 = {
                title: {
                    text: 'Completed Tasks',
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
                series: temp_data_finish
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
                this.temp_series_generate.push(getone);
            }
            var temp_data_generate = [];
            temp_data_generate.push(this.temp_series_generate[0], this.temp_series_generate[1], this.temp_series_generate[2]);

            if (this.myChart3 != null && this.myChart3 != '' && this.myChart3 != undefined) {
                this.myChart3.dispose();
            }
            this.myChart3 = echarts.init(document.getElementById('main3'));
            var option3 = {
                title: {
                    text: 'Generated Data',
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
                series: temp_data_generate
            };
            console.log('option3:', option3);
            console.log('typeof option3:', typeof option3);
            if (option3 && typeof option3 === 'object') {
                console.log('update main3');
                this.myChart3.setOption(option3, true);
            }
        }
        // showData() {
        //     this.dates = [];
        //     this.methods = [];
        //     this.datas_ran = [];
        //     this.datas_finish = [];
        //     this.datas_generate = [];
        //     this.temp_series_ran = [];
        //     this.temp_series_finish = [];
        //     this.temp_series_generate = [];
        //     var flag = true;
        //     for (var date in this.logData) {
        //         this.dates.push(date);
        //         for (var method in this.logData[date]) {
        //             if (flag) {
        //                 this.methods.push(method);
        //             }
        //         }
        //         flag = false;
        //     }

        //     for (var method in this.methods) {
        //         var temp_ran = [];
        //         var temp_finish = [];
        //         var temp_generate = [];
        //         for (var date in this.dates) {
        //             temp_ran.push(this.logData[this.dates[date]][this.methods[method]]['ran_task_number']);
        //             temp_finish.push(this.logData[this.dates[date]][this.methods[method]]['finish_task_number']);
        //             temp_generate.push(this.logData[this.dates[date]][this.methods[method]]['generate_data_number']);
        //         }
        //         this.datas_ran.push(temp_ran);
        //         this.datas_finish.push(temp_finish);
        //         this.datas_generate.push(temp_generate);
        //     }

        //     for (var i = 0; i < this.methods.length; i++) {
        //         var getone = {};
        //         getone.type = 'line';
        //         getone.areaStyle = {};
        //         getone.name = this.methods[i];
        //         getone.data = this.datas_ran[i].reverse();
        //         this.temp_series_ran.push(getone);
        //     }
        //     // console.log('this.temp_series_ran:', this.temp_series_ran);
        //     // this.temp_series_ran.reverse();
        //     // console.log('this.temp_series_ran:', this.temp_series_ran);

        //     if (this.myChart != null && this.myChart != '' && this.myChart != undefined) {
        //         this.myChart.dispose();
        //     }
        //     this.myChart = echarts.init(document.getElementById('main1'));
        //     var option = {
        //         title: {
        //             text: '运行任务数监控',
        //             left: 'center'
        //         },
        //         tooltip: {
        //             trigger: 'axis',
        //             axisPointer: {
        //                 type: 'cross',
        //                 label: {
        //                     backgroundColor: '#6a7985'
        //                 }
        //             }
        //         },
        //         legend: {
        //             data: this.methods,
        //             top: '10%'
        //         },
        //         toolbox: {
        //             feature: {
        //                 saveAsImage: {}
        //             }
        //         },
        //         grid: {
        //             left: '3%',
        //             right: '4%',
        //             bottom: '3%',
        //             containLabel: true
        //         },
        //         xAxis: [
        //             {
        //                 type: 'category',
        //                 boundaryGap: true,
        //                 data: this.dates.reverse()
        //             }
        //         ],
        //         yAxis: [
        //             {
        //                 type: 'value'
        //             }
        //         ],
        //         series: this.temp_series_ran
        //     };
        //     if (option && typeof option === 'object') {
        //         this.myChart.setOption(option, true);
        //     }
        //     for (var i = 0; i < this.methods.length; i++) {
        //         var getone = {};
        //         getone.type = 'line';
        //         getone.areaStyle = {};
        //         getone.name = this.methods[i];
        //         getone.data = this.datas_finish[i].reverse();
        //         this.temp_series_finish.push(getone);
        //     }
        //     if (this.myChart2 != null && this.myChart2 != '' && this.myChart2 != undefined) {
        //         this.myChart2.dispose();
        //     }
        //     this.myChart2 = echarts.init(document.getElementById('main2'));
        //     var option2 = {
        //         title: {
        //             text: '完成任务数监控',
        //             left: 'center'
        //         },
        //         tooltip: {
        //             trigger: 'axis',
        //             axisPointer: {
        //                 type: 'cross',
        //                 label: {
        //                     backgroundColor: '#6a7985'
        //                 }
        //             }
        //         },
        //         legend: {
        //             data: this.methods,
        //             top: '8%'
        //         },
        //         toolbox: {
        //             feature: {
        //                 saveAsImage: {}
        //             }
        //         },
        //         grid: {
        //             left: '3%',
        //             right: '4%',
        //             bottom: '3%',
        //             containLabel: true
        //         },
        //         xAxis: [
        //             {
        //                 type: 'category',
        //                 boundaryGap: true,
        //                 data: this.dates
        //             }
        //         ],
        //         yAxis: [
        //             {
        //                 type: 'value'
        //             }
        //         ],
        //         series: this.temp_series_finish
        //     };
        //     if (option2 && typeof option2 === 'object') {
        //         this.myChart2.setOption(option2, true);
        //     }
        //     for (var i = 0; i < this.methods.length; i++) {
        //         var getone = {};
        //         getone.type = 'line';
        //         getone.areaStyle = {};
        //         getone.name = this.methods[i];
        //         getone.data = this.datas_generate[i].reverse();
        //         this.temp_series_generate.push(getone);
        //     }
        //     if (this.myChart3 != null && this.myChart3 != '' && this.myChart3 != undefined) {
        //         this.myChart3.dispose();
        //     }
        //     this.myChart3 = echarts.init(document.getElementById('main3'));
        //     var option3 = {
        //         title: {
        //             text: '生成数据量监控',
        //             left: 'center'
        //         },
        //         tooltip: {
        //             trigger: 'axis',
        //             axisPointer: {
        //                 type: 'cross',
        //                 label: {
        //                     backgroundColor: '#6a7985'
        //                 }
        //             }
        //         },
        //         legend: {
        //             data: this.methods,
        //             top: '8%'
        //         },
        //         toolbox: {
        //             feature: {
        //                 saveAsImage: {}
        //             }
        //         },
        //         grid: {
        //             left: '3%',
        //             right: '4%',
        //             bottom: '3%',
        //             containLabel: true
        //         },
        //         xAxis: [
        //             {
        //                 type: 'category',
        //                 boundaryGap: true,
        //                 data: this.dates
        //             }
        //         ],
        //         yAxis: [
        //             {
        //                 type: 'value'
        //             }
        //         ],
        //         series: this.temp_series_generate
        //     };
        //     if (option3 && typeof option3 === 'object') {
        //         this.myChart3.setOption(option3, true);
        //     }
        // }
    }
};
</script>

<style scoped>
.el-card {
    border-radius: 3%;
}
.el-row {
    margin-bottom: 20px;
}
.grid-content {
    display: flex;
    align-items: center;
    height: 70px;
}
.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}
.grid-num {
    font-size: 30px;
    font-weight: bold;
}
.grid-con-icon {
    font-size: 50px;
    width: 70px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}
.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}
.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}
.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}
.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
}
.grid-con-3 .grid-con-icon {
    background: #e6a23c;
}
.grid-con-3 .grid-num {
    color: #e6a23c;
}
.grid-con-4 .grid-con-icon {
    background: #f56c6c;
}
.grid-con-4 .grid-num {
    color: #f56c6c;
}
.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 10px;
}
.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}
.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}
.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}
.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}
.user-info-list span {
    margin-left: 25px;
}
.mgb20 {
    margin-bottom: 20px;
}
.todo-item {
    font-size: 14px;
}
.todo-item-del {
    text-decoration: line-through;
    color: #999;
}
.schart {
    width: 100%;
    height: 300px;
}
.el-card__header1 {
    padding: 0px 10px 10px 10px !important;
    border-bottom: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.el-card__body1 {
    padding: 10px !important;
}
.el-card__body2 {
    padding-top: 10px;
}
.body3 {
    padding-top: 0 !important;
}
.el-button--info.is-plain {
    border-color: #f4f4f5 !important;
}
.el-button [class*='el-icon-'] + span {
    margin-left: 0 !important;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}
/* .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
} */
.lidarPic {
    width: 50px;
    height: 50px;
    text-align: center;
    margin-left: 8px;
}
.table-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    background: #f4f4f5;
    width: 100%;
    height: 100px;
    border-radius: 4px;
}
.table-icon:hover {
    background: lightgrey;
}
a {
    color: rgb(83, 83, 83);
    text-decoration: none;
}
</style>
