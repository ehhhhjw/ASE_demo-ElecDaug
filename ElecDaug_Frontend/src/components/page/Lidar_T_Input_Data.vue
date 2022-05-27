<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-s-help"></i> 激光雷达蜕变 </el-breadcrumb-item>
                <el-breadcrumb-item>数据可视化</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <hr />
        <el-card>
            <div class="view">
                <el-row>
                    <el-col :span="12">
                        <div>
                            <el-button type="success" id="fileImport" v-on:click="clickLoad" style="float:left">
                                导入原雷达数据
                            </el-button>
                            <input type="file" id="files" ref="refFile" style="display:none" v-on:change="fileLoad" />
                        </div>
                        <div>
                            <el-button
                                v-if="this.originalPointCloudData.length != 0"
                                type="warning"
                                id="fileImport"
                                v-on:click="clickLoad_label"
                                style="float:left"
                            >
                                导入原雷达标签
                            </el-button>
                            <input type="file" id="files_label" ref="refFile_label" style="display:none" v-on:change="fileLoad_label" />
                        </div>
                        <div id="main_o" class="view1"></div>
                    </el-col>
                    <el-col :span="12">
                        <div>
                            <el-button type="success" id="fileImport_new" v-on:click="clickLoad_new" style="float:left">
                                导入生成雷达数据
                            </el-button>
                            <input type="file" id="files_new" ref="refFile_new" style="display:none" v-on:change="fileLoad_new" />
                        </div>
                        <div>
                            <el-button
                                v-if="this.generatePointCloudData.length != 0"
                                type="warning"
                                id="fileImport"
                                v-on:click="clickLoad_label_new"
                                style="float:left"
                            >
                                导入生成雷达标签
                            </el-button>
                            <input
                                type="file"
                                id="files_label_new"
                                ref="refFile_label_new"
                                style="display:none"
                                v-on:change="fileLoad_label_new"
                            />
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
            originalLabelData: [],
            generateLabelData: [],
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
            var PointCloudData = [];

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
                PointCloudData.push(arr);
            });
            return [PointCloudData, this.maxAxisValue, this.minAxisValue];
        },
        make_format_data_label(points_name, labels, flag) {
            // var is_3d_data = 0;
            console.log('labels:', labels);
            var format_data = null;
            var originalPointCloudData = [];
            var generatePointCloudData = [];
            var label_temp = [];

            format_data = labels.replaceAll('\r\n', '\n').split('\n');
            format_data.forEach(item => {
                let arr = item.split(' ');

                var label_temp_item = [];
                if (arr[0] != 'DontCare' && arr[0] != '') {
                    label_temp_item.push(parseFloat(arr[13]));
                    label_temp_item.push(-1 * parseFloat(arr[11]));
                    label_temp_item.push(-1 * parseFloat(arr[12]));
                    label_temp.push(label_temp_item);
                }

                // console.log('label_temp:', label_temp);

                if (!flag) {
                    originalPointCloudData.push(arr);
                } else {
                    generatePointCloudData.push(arr);
                }
            });
            return label_temp;
        },
        get_preview() {
            var myChart_original = echarts.init(document.getElementById('preview_original'));
            this.option_original = {
                title: {
                    text: '原始图'
                },
                tooltip: {
                    show: false,
                    showCcontant: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    // 就是显示哪些东西
                    type: 'plain',
                    data: ['original_data', 'original_label'],
                    top: '10%'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid3D: {
                    containLabel: true,
                    viewControl: {
                        projection: 'orthographic'
                    }
                },
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
                series: [
                    {
                        name: 'original_data',
                        type: 'scatter3D',
                        data: this.originalPointCloudData,
                        symbolSize: 2,
                        encode: {
                            // 维度的名字默认就是表头的属性名
                            tooltip: [0, 1, 2, 3, 4]
                        }
                    },
                    {
                        name: 'original_label',
                        type: 'scatter3D',
                        data: this.originalLabelData,
                        symbolSize: 10,
                        encode: {
                            // 维度的名字默认就是表头的属性名
                            tooltip: [0, 1, 2, 3, 4]
                        }
                    }
                ]
            };
            myChart_original.setOption(this.option_original);
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
            if (size == 0 || size == '0') {
                loading.close();
                return;
            }
            var originalPointCloudData_temp = [];

            var reader = new FileReader();
            reader.readAsText(selectedFile);
            var me = this;

            reader.onload = e => {
                console.log('me.originalPointCloudData:', me.originalPointCloudData);
                var res = this.make_format_data(name, e.target.result, 0);
                originalPointCloudData_temp = res[0];
                me.maxAxisValue = res[1];
                me.minAxisValue = res[2];
                console.log('me.maxAxisValue, me.minAxisValue:', me.maxAxisValue, me.minAxisValue);
                me.originalPointCloudData = originalPointCloudData_temp;
                console.log('me.originalPointCloudData:', me.originalPointCloudData);
                if (this.originalPointCloudData.length !== 0) {
                    this.original_buttom = true;
                }
                this.option = {
                    title: {
                        text: '激光雷达三维点云（原始图）'
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
                    series: [
                        {
                            type: 'scatter3D',
                            data: originalPointCloudData_temp,
                            symbolSize: 2
                        }
                    ]
                };

                myChart.setOption(this.option);
            };
            // while (originalPointCloudData_temp.length == 0) {
            //     setTimeout(function() {
            //         console.log('originalPointCloudData_temp:', originalPointCloudData_temp);
            //     }, 100);
            // }
            console.log('originalPointCloudData_temp:', originalPointCloudData_temp);

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

            if (this.pointCloudData.length) {
                this.pointCloudData = [];
            }
            var myChart = echarts.init(document.getElementById('main_g'));
            const selectedFile = this.$refs.refFile_new.files[0];

            var name = selectedFile.name;
            var size = selectedFile.size;
            if (size == 0 || size == '0') {
                loading.close();
                return;
            }
            var generatePointCloudData_temp = [];

            var reader = new FileReader();
            reader.readAsText(selectedFile);
            var me = this;

            reader.onload = e => {
                console.log('me.generatePointCloudData:', me.generatePointCloudData);
                var res = this.make_format_data(name, e.target.result, 0);
                generatePointCloudData_temp = res[0];
                me.maxAxisValue = res[1];
                me.minAxisValue = res[2];
                console.log('me.maxAxisValue, me.minAxisValue:', me.maxAxisValue, me.minAxisValue);
                me.generatePointCloudData = generatePointCloudData_temp;
                console.log('me.generatePointCloudData:', me.generatePointCloudData);
                if (this.generatePointCloudData.length !== 0) {
                    this.generate_buttom = true;
                }
                this.option = {
                    title: {
                        text: '激光雷达三维点云（生成图）'
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
                    series: [
                        {
                            type: 'scatter3D',
                            data: generatePointCloudData_temp,
                            symbolSize: 2
                        }
                    ]
                };

                myChart.setOption(this.option);
            };
            // while (originalPointCloudData_temp.length == 0) {
            //     setTimeout(function() {
            //         console.log('originalPointCloudData_temp:', originalPointCloudData_temp);
            //     }, 100);
            // }

            loading.close();
        },
        fileLoad_label() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            if (this.originalLabelData.length) {
                this.originalLabelData = [];
            }

            var myChart = echarts.init(document.getElementById('main_o'));
            console.log('this.$refs.refFile_label.files:', this.$refs.refFile_label.files);
            const selectedFile = this.$refs.refFile_label.files[0];

            var name = selectedFile.name;
            var size = selectedFile.size;
            var originalLabelData_temp = [];

            var reader = new FileReader();
            reader.readAsText(selectedFile);
            var me = this;

            reader.onload = e => {
                console.log('me.originalLabelData:', me.originalLabelData);
                console.log('e.target.result:', e.target.result);
                originalLabelData_temp = this.make_format_data_label(name, e.target.result, 0);
                me.originalLabelData = originalLabelData_temp;
                console.log('me.originalLabelData:', me.originalLabelData);

                this.option = {
                    title: {
                        text: '激光雷达三维点云（原始图）'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        // 就是显示哪些东西
                        type: 'plain',
                        data: ['original_data', 'original_label'],
                        top: '10%'
                    },
                    grid3D: {},
                    xAxis3D: {
                        type: 'value',
                        max: me.maxAxisValue.toFixed(3),
                        min: me.minAxisValue.toFixed(3)
                    },
                    yAxis3D: {
                        type: 'value',
                        max: me.maxAxisValue.toFixed(3),
                        min: me.minAxisValue.toFixed(3)
                    },
                    zAxis3D: {
                        type: 'value',
                        max: me.maxAxisValue.toFixed(3),
                        min: me.minAxisValue.toFixed(3)
                    },
                    series: [
                        {
                            name: 'original_data',
                            type: 'scatter3D',
                            data: me.originalPointCloudData,
                            symbolSize: 2,
                            encode: {
                                // 维度的名字默认就是表头的属性名
                                tooltip: [0, 1, 2, 3, 4]
                            }
                        },
                        {
                            name: 'original_label',
                            type: 'scatter3D',
                            data: me.originalLabelData,
                            symbolSize: 10,
                            encode: {
                                // 维度的名字默认就是表头的属性名
                                tooltip: [0, 1, 2, 3, 4]
                            }
                        }
                    ]
                };

                myChart.setOption(this.option);
            };
            loading.close();
        },
        fileLoad_label_new() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            if (this.generateLabelData.length) {
                this.generateLabelData = [];
            }

            var myChart = echarts.init(document.getElementById('main_g'));
            console.log('this.$refs.refFile_label.files:', this.$refs.refFile_label_new.files);
            const selectedFile = this.$refs.refFile_label_new.files[0];

            var name = selectedFile.name;
            var size = selectedFile.size;
            var generateLabelData_temp = [];

            var reader = new FileReader();
            reader.readAsText(selectedFile);
            var me = this;

            reader.onload = e => {
                console.log('me.generateLabelData:', me.generateLabelData);
                console.log('e.target.result:', e.target.result);
                generateLabelData_temp = this.make_format_data_label(name, e.target.result, 0);
                me.generateLabelData = generateLabelData_temp;
                console.log('me.generateLabelData:', me.generateLabelData);

                this.option = {
                    title: {
                        text: '激光雷达三维点云（原始图）'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        // 就是显示哪些东西
                        type: 'plain',
                        data: ['generate_data', 'generate_label'],
                        top: '10%'
                    },
                    grid3D: {},
                    xAxis3D: {
                        type: 'value',
                        max: me.maxAxisValue.toFixed(3),
                        min: me.minAxisValue.toFixed(3)
                    },
                    yAxis3D: {
                        type: 'value',
                        max: me.maxAxisValue.toFixed(3),
                        min: me.minAxisValue.toFixed(3)
                    },
                    zAxis3D: {
                        type: 'value',
                        max: me.maxAxisValue.toFixed(3),
                        min: me.minAxisValue.toFixed(3)
                    },
                    series: [
                        {
                            name: 'generate_data',
                            type: 'scatter3D',
                            data: me.generatePointCloudData,
                            symbolSize: 2,
                            encode: {
                                // 维度的名字默认就是表头的属性名
                                tooltip: [0, 1, 2, 3, 4]
                            }
                        },
                        {
                            name: 'generate_label',
                            type: 'scatter3D',
                            data: me.generateLabelData,
                            symbolSize: 10,
                            encode: {
                                // 维度的名字默认就是表头的属性名
                                tooltip: [0, 1, 2, 3, 4]
                            }
                        }
                    ]
                };

                myChart.setOption(this.option);
            };
            loading.close();
        },
        clickLoad() {
            this.$refs.refFile.dispatchEvent(new MouseEvent('click'));
        },
        clickLoad_new() {
            this.$refs.refFile_new.dispatchEvent(new MouseEvent('click'));
        },
        clickLoad_label() {
            this.$refs.refFile_label.dispatchEvent(new MouseEvent('click'));
        },
        clickLoad_label_new() {
            this.$refs.refFile_label_new.dispatchEvent(new MouseEvent('click'));
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
