<template>
    <div>
        <hr />
        <el-card>
            <div class="view">
                <el-row>
                    <el-col :span="12">
                        <div>
                            <el-button type="success" id="fileImport" v-on:click="clickLoad" style="float:left">
                                Select original data
                            </el-button>
                            <el-button v-if="original_buttom" type="primary" @click="changeAxios_xz">Exchange XZ </el-button>
                            <el-button v-if="original_buttom" type="primary" @click="changeAxios_xy">Exchange XY </el-button>
                            <el-button v-if="original_buttom" type="primary" @click="changeAxios_yz">Exchange XY </el-button>
                            <input type="file" id="files" ref="refFile" style="display:none" v-on:change="fileLoad" />
                        </div>
                        <div id="main_o" class="view1"></div>
                    </el-col>
                    <el-col :span="12">
                        <div>
                            <el-button type="success" id="fileImport_new" v-on:click="clickLoad_new" style="float:left">
                                Select augmented data
                            </el-button>
                            <el-button v-if="generate_buttom" type="primary" @click="changeAxios_xz_new">Exchange XZ </el-button>
                            <el-button v-if="generate_buttom" type="primary" @click="changeAxios_xy_new">Exchange XY </el-button>
                            <el-button v-if="generate_buttom" type="primary" @click="changeAxios_yz_new">Exchange YZ </el-button>
                            <input type="file" id="files_new" ref="refFile_new" style="display:none" v-on:change="fileLoad_new" />
                        </div>
                        <div v-loading="original_loading" id="main_g" class="view1"></div>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import 'echarts-gl';
export default {
    data() {
        return {
            fileList: [],
            pointCloudData: [],
            pointCloudData_new: [],
            option: [],
            option1: [],
            originalPointCloudData: [],
            generatePointCloudData: [],
            maxAxisValue: -10000,
            minAxisValue: 10000,
            maxLightValue: -10000,
            minLightValue: 10000,
            original_buttom: false,
            generate_buttom: false,
            original_loading: false,
            generate_loading: false
        };
    },
    methods: {
        make_format_data(points_name, pointscloud, flag) {
            var is_3d_data = 0;
            var format_data = null;
            var dot = points_name.lastIndexOf('.');
            if (dot === -1) {
                format_data = pointscloud.replaceAll('\r\n', '\n').split('\n');
                format_data.forEach(item => {
                    let arr = item.split(' ');
                    for (var k in arr) {
                        if (k < 3 && parseFloat(arr[k]) > this.maxAxisValue) {
                            this.maxAxisValue = parseFloat(arr[k]);
                        }
                        if (k < 3 && parseFloat(arr[k]) < this.minAxisValue) {
                            this.minAxisValue = parseFloat(arr[k]);
                        }
                    }
                    if ((arr.length === 3 || arr[3] === '') && !flag) {
                        is_3d_data = 1;
                        if (arr.length === 3) {
                            arr.push('0');
                        } else if (arr[3] === '') {
                            arr[3] = '0';
                        }
                    } else if ((arr.length === 3 || arr[3] === '') && flag) {
                        is_3d_data = 1;
                        if (arr.length === 3) {
                            arr.push('100');
                        } else if (arr[3] === '') {
                            arr[3] = '100';
                        }
                    }
                    if (!flag) {
                        this.originalPointCloudData.push(arr);
                    } else {
                        this.generatePointCloudData.push(arr);
                    }
                    if (parseFloat(arr[3]) > this.maxLightValue) {
                        this.maxLightValue = parseFloat(arr[3]);
                    }
                    if (parseFloat(arr[3]) < this.minLightValue) {
                        this.minLightValue = parseFloat(arr[3]);
                    }
                });

                return is_3d_data;
            }
            var data_type = points_name.substr(dot);
            if (data_type === '.ply') {
                format_data = pointscloud.replaceAll('\r\n', '\n').split('\n');
                var end_header_index = -1;
                for (var i in format_data) {
                    if (format_data[i] === 'end_header') {
                        end_header_index = i;
                    }
                }

                format_data = format_data.splice(parseInt(end_header_index) + 1, format_data.length - parseInt(end_header_index) - 1);
                format_data.forEach(item => {
                    let arr = item.split(' ');
                    for (var k in arr) {
                        if (k < 3 && parseFloat(arr[k]) > this.maxAxisValue) {
                            this.maxAxisValue = parseFloat(arr[k]);
                        }
                        if (k < 3 && parseFloat(arr[k]) < this.minAxisValue) {
                            this.minAxisValue = parseFloat(arr[k]);
                        }
                    }
                    if ((arr.length === 3 || arr[3] === '') && !flag) {
                        is_3d_data = 1;
                        if (arr.length === 3) {
                            arr.push('0');
                        } else if (arr[3] === '') {
                            arr[3] = '0';
                        }
                    } else if ((arr.length === 3 || arr[3] === '') && flag) {
                        is_3d_data = 1;
                        if (arr.length === 3) {
                            arr.push('100');
                        } else if (arr[3] === '') {
                            arr[3] = '100';
                        }
                    }
                    if (!flag) {
                        this.originalPointCloudData.push(arr);
                    } else {
                        this.generatePointCloudData.push(arr);
                    }
                    if (parseFloat(arr[3]) > this.maxLightValue) {
                        this.maxLightValue = parseFloat(arr[3]);
                    }
                    if (parseFloat(arr[3]) < this.minLightValue) {
                        this.minLightValue = parseFloat(arr[3]);
                    }
                });
            } else if (data_type === '.txt') {
                format_data = pointscloud.replaceAll('\r\n', '\n').split('\n');
                format_data.forEach(item => {
                    let arr = item.split(' ');
                    for (var k in arr) {
                        if (k < 3 && parseFloat(arr[k]) > this.maxAxisValue) {
                            this.maxAxisValue = parseFloat(arr[k]);
                        }
                        if (k < 3 && parseFloat(arr[k]) < this.minAxisValue) {
                            this.minAxisValue = parseFloat(arr[k]);
                        }
                    }
                    if ((arr.length === 3 || arr[3] === '') && !flag) {
                        is_3d_data = 1;
                        if (arr.length === 3) {
                            arr.push('0');
                        } else if (arr[3] === '') {
                            arr[3] = '0';
                        }
                    } else if ((arr.length === 3 || arr[3] === '') && flag) {
                        is_3d_data = 1;
                        if (arr.length === 3) {
                            arr.push('100');
                        } else if (arr[3] === '') {
                            arr[3] = '10';
                        }
                    }
                    if (!flag) {
                        this.originalPointCloudData.push(arr);
                    } else {
                        this.generatePointCloudData.push(arr);
                    }
                    if (parseFloat(arr[3]) > this.maxLightValue) {
                        this.maxLightValue = parseFloat(arr[3]);
                    }
                    if (parseFloat(arr[3]) < this.minLightValue) {
                        this.minLightValue = parseFloat(arr[3]);
                    }
                });
            } else if (data_type === '.bin') {
            }

            return is_3d_data;
        },
        changeAxios_yz() {
            for (var i in this.originalPointCloudData) {
                [this.originalPointCloudData[i][1], this.originalPointCloudData[i][2]] = [
                    this.originalPointCloudData[i][2],
                    this.originalPointCloudData[i][1]
                ];
            }
            var myChart = echarts.init(document.getElementById('main_o'));
            this.option = {
                title: {
                    text: 'Lidar 3D point cloud (original data)'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid3D: {},
                xAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                yAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                zAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    max: this.maxLightValue,
                    min: this.minLightValue,
                    inRange: {
                        symbolSize: 2,
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                series: [
                    {
                        type: 'scatter3D',
                        data: this.originalPointCloudData
                    }
                ]
            };

            myChart.setOption(this.option);
        },
        changeAxios_xz() {
            for (var i in this.originalPointCloudData) {
                [this.originalPointCloudData[i][0], this.originalPointCloudData[i][2]] = [
                    this.originalPointCloudData[i][2],
                    this.originalPointCloudData[i][0]
                ];
            }
            var myChart = echarts.init(document.getElementById('main_o'));
            this.option = {
                title: {
                    text: 'Lidar 3D point cloud (original data)'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid3D: {},
                xAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                yAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                zAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    max: this.maxLightValue,
                    min: this.minLightValue,
                    inRange: {
                        symbolSize: 2,
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                series: [
                    {
                        type: 'scatter3D',
                        data: this.originalPointCloudData
                    }
                ]
            };

            myChart.setOption(this.option);
        },
        changeAxios_xy() {
            for (var i in this.originalPointCloudData) {
                [this.originalPointCloudData[i][0], this.originalPointCloudData[i][1]] = [
                    this.originalPointCloudData[i][1],
                    this.originalPointCloudData[i][0]
                ];
            }
            var myChart = echarts.init(document.getElementById('main_o'));
            this.option = {
                title: {
                    text: 'Lidar 3D point cloud (original data)'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid3D: {},
                xAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                yAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                zAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    max: this.maxLightValue,
                    min: this.minLightValue,
                    inRange: {
                        symbolSize: 2,
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                series: [
                    {
                        type: 'scatter3D',
                        data: this.originalPointCloudData
                    }
                ]
            };

            myChart.setOption(this.option);
        },
        changeAxios_yz_new() {
            for (var i in this.generatePointCloudData) {
                [this.generatePointCloudData[i][1], this.generatePointCloudData[i][2]] = [
                    this.generatePointCloudData[i][2],
                    this.generatePointCloudData[i][1]
                ];
            }
            var myChart1 = echarts.init(document.getElementById('main_g'));
            this.option1 = {
                title: {
                    text: 'Lidar 3D point cloud (augmented data)'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid3D: {},
                xAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                yAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                zAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    max: this.maxLightValue,
                    min: this.minLightValue,
                    inRange: {
                        symbolSize: 2,
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                series: [
                    {
                        type: 'scatter3D',
                        data: this.generatePointCloudData
                    }
                ]
            };

            myChart1.setOption(this.option1);
        },
        changeAxios_xy_new() {
            for (var i in this.generatePointCloudData) {
                [this.generatePointCloudData[i][0], this.generatePointCloudData[i][1]] = [
                    this.generatePointCloudData[i][1],
                    this.generatePointCloudData[i][0]
                ];
            }
            var myChart1 = echarts.init(document.getElementById('main_g'));
            this.option1 = {
                title: {
                    text: 'Lidar 3D point cloud (augmented data)'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid3D: {},
                xAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                yAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                zAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    max: this.maxLightValue,
                    min: this.minLightValue,
                    inRange: {
                        symbolSize: 2,
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                series: [
                    {
                        type: 'scatter3D',
                        data: this.generatePointCloudData
                    }
                ]
            };

            myChart1.setOption(this.option1);
        },
        changeAxios_xz_new() {
            for (var i in this.generatePointCloudData) {
                [this.generatePointCloudData[i][0], this.generatePointCloudData[i][2]] = [
                    this.generatePointCloudData[i][2],
                    this.generatePointCloudData[i][0]
                ];
            }
            var myChart1 = echarts.init(document.getElementById('main_g'));
            this.option1 = {
                title: {
                    text: 'Lidar 3D point cloud (augmented data)'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid3D: {},
                xAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                yAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                zAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    max: this.maxLightValue,
                    min: this.minLightValue,
                    inRange: {
                        symbolSize: 2,
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                series: [
                    {
                        type: 'scatter3D',
                        data: this.generatePointCloudData
                    }
                ]
            };

            myChart1.setOption(this.option1);
        },
        fileLoad() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.originalPointCloudData = [];
            this.maxAxisValue = -10000;
            this.minAxisValue = 10000;
            this.maxLightValue = -10000;
            this.minLightValue = 10000;

            if (this.pointCloudData.length) {
                this.pointCloudData = [];
            }
            var myChart = echarts.init(document.getElementById('main_o'));
            const selectedFile = this.$refs.refFile.files[0];

            var name = selectedFile.name;
            var size = selectedFile.size;

            var reader = new FileReader();
            reader.readAsText(selectedFile);
            reader.onload = e => {
                var is_3d_data = this.make_format_data(name, e.target.result, 0);

                if (is_3d_data) {
                    this.maxLightValue = 100;
                }

                console.log('this.originalPointCloudData.length:', this.originalPointCloudData.length);
                if (this.originalPointCloudData.length !== 0) {
                    this.original_buttom = true;
                }
                this.option = {
                    title: {
                        text: 'Lidar 3D point cloud (original data)'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid3D: {},
                    xAxis3D: {
                        type: 'value',
                        max: this.maxAxisValue,
                        min: this.minAxisValue
                    },
                    yAxis3D: {
                        type: 'value',
                        max: this.maxAxisValue,
                        min: this.minAxisValue
                    },
                    zAxis3D: {
                        type: 'value',
                        max: this.maxAxisValue,
                        min: this.minAxisValue
                    },
                    visualMap: {
                        show: false,
                        calculable: true,
                        max: this.maxLightValue,
                        min: this.minLightValue,
                        inRange: {
                            symbolSize: 2,
                            color: [
                                '#313695',
                                '#4575b4',
                                '#74add1',
                                '#abd9e9',
                                '#e0f3f8',
                                '#ffffbf',
                                '#fee090',
                                '#fdae61',
                                '#f46d43',
                                '#d73027',
                                '#a50026'
                            ]
                        }
                    },
                    series: [
                        {
                            type: 'scatter3D',
                            data: this.originalPointCloudData
                        }
                    ]
                };

                myChart.setOption(this.option);
            };
            loading.close();
        },
        fileLoad_new() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.generatePointCloudData = [];
            this.maxAxisValue = -10000;
            this.minAxisValue = 10000;
            this.maxLightValue = -10000;
            this.minLightValue = 10000;

            if (this.pointCloudData_new.length) {
                this.pointCloudData_new = [];
            }
            var myChart1 = echarts.init(document.getElementById('main_g'));
            const selectedFile = this.$refs.refFile_new.files[0];

            var name = selectedFile.name;
            var size = selectedFile.size;

            var reader = new FileReader();
            reader.readAsText(selectedFile);
            reader.onload = e => {
                this.make_format_data(name, e.target.result, 1);
                var is_3d_data = this.make_format_data(name, e.target.result, 0);

                if (this.maxLightValue === 0 && this.minLightValue === 0) {
                    this.maxLightValue = 100;
                }

                if (this.generatePointCloudData.length !== 0) {
                    this.generate_buttom = true;
                }
                this.option1 = {
                    title: {
                        text: 'Lidar 3D point cloud (augmented data)'
                    },
                    grid3D: {},
                    xAxis3D: {
                        type: 'value',
                        max: this.maxAxisValue,
                        min: this.minAxisValue
                    },
                    yAxis3D: {
                        type: 'value',
                        max: this.maxAxisValue,
                        min: this.minAxisValue
                    },
                    zAxis3D: {
                        type: 'value',
                        max: this.maxAxisValue,
                        min: this.minAxisValue
                    },
                    visualMap: {
                        show: false,
                        calculable: true,
                        max: this.maxLightValue,
                        min: this.minLightValue,
                        inRange: {
                            symbolSize: 2,
                            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#fdae61', '#f46d43', '#d73027', '#a50026']
                        }
                    },
                    series: [
                        {
                            type: 'scatter3D',
                            data: this.generatePointCloudData
                        }
                    ]
                };
                myChart1.setOption(this.option1);
            };
            loading.close();
        },
        clickLoad() {
            this.$refs.refFile.dispatchEvent(new MouseEvent('click'));
        },
        clickLoad_new() {
            this.$refs.refFile_new.dispatchEvent(new MouseEvent('click'));
        }
    },
    mounted() {
        this.$store.commit('setUserId', sessionStorage.getItem('userId'));
    }
};
</script>
<style scoped>
.view {
    width: 1300px;
    height: 580px;
    margin: auto;
    float: left;
    background-color: #fff;
}
.view1 {
    width: 600px;
    height: 530px;
    margin: 0 10px 0 0;
    background-color: #fff;
    float: left;
}
</style>
