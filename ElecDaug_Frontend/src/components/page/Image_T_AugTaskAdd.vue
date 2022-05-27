<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-picture"></i> Welcome to ElecDaug! </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <el-row :gutter="20">
                    <el-form ref="formRef" :model="form" :rules="FormRules" label-width="100px">
                        <!-- <el-form-item label="Task Name" prop="name">
                            <el-input v-model="form.name" style="width: 500px"></el-input>
                        </el-form-item> -->

                        <el-form-item label="Method">
                            <!-- <div class="block">
                                <el-cascader
                                    style="width: 350px"
                                    v-model="method_value"
                                    :options="options"
                                    :props="{ expandTrigger: 'hover' }"
                                    @change="handleChange"
                                    placeholder="Select the method"
                                ></el-cascader>
                            </div> -->
                            <div>
                                <div class="title">
                                    <span style="margin-right:410px">Transmission Metamorphic Methods:</span>
                                    <span>Time-frequency Metamorphic Methods:</span>
                                </div>

                                <div class="boxes">
                                    <el-checkbox v-model="checked1" label="Radio Noise" border size="medium"></el-checkbox>
                                    <el-checkbox v-model="checked2" label="Signal Outage" border size="medium"></el-checkbox>
                                    <el-checkbox
                                        v-model="checked3"
                                        label="Signal Disruptions"
                                        border
                                        size="medium"
                                        style="margin-right: 100px"
                                    ></el-checkbox>

                                    <el-checkbox v-model="checked4" label="Channel Transformation" border size="medium"></el-checkbox>
                                    <el-checkbox v-model="checked5" label="Power Zooming" border size="medium"></el-checkbox>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item label="Params">
                            <div class="block">
                                <el-slider
                                    v-model="form.params"
                                    :min="1"
                                    :max="10"
                                    :step="1"
                                    :marks="mark_group.marks1_10"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </div>
                        </el-form-item>

                        <!-- <el-form-item label="上传文件">
                            <input type="file" id="filetemp" prop="form.file" ref="image_t_file_ref" @change="fileLoad" />
                        </el-form-item> -->

                        <el-form-item label="Upload file">
                            <input
                                type="file"
                                id="filetemp"
                                prop="form.file"
                                ref="image_t_file_ref"
                                style="display:none"
                                @change="fileLoad"
                            />
                            <input type="text" value="" style="width: 200px" disabled id="inputFileAgent" />
                            <input type="button" @click="clickfiletemp" value="Browse..." />
                            <br />
                        </el-form-item>

                        <!-- <el-form-item label="参数说明">
                            <el-input type="textarea" v-model="form.desc" autosize disabled></el-input>
                        </el-form-item> -->
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit" :disabled="!buttons">Submit</el-button>
                            <!-- <el-button type="primary" @click="DownLoad" :disabled="buttons">DownLoad</el-button>
                            <el-button type="primary" @click="Preview" :disabled="buttons">Preview</el-button> -->
                            <el-button @click="Reset" :disabled="buttons">Reset</el-button>
                        </el-form-item>

                        <el-form-item label="DownLoad">
                            <el-button type="primary" @click="DownLoad(1)" :disabled="buttons || !this.form.augment_type_one"
                                >Radio Noise</el-button
                            >
                            <el-button type="primary" @click="DownLoad(2)" :disabled="buttons || !this.form.augment_type_two"
                                >Signal Outage</el-button
                            >
                            <el-button type="primary" @click="DownLoad(3)" :disabled="buttons || !this.form.augment_type_three"
                                >Signal Disruptions</el-button
                            >
                            <el-button type="primary" @click="DownLoad(4)" :disabled="buttons || !this.form.augment_type_four"
                                >Channel Transformation</el-button
                            >
                            <el-button type="primary" @click="DownLoad(5)" :disabled="buttons || !this.form.augment_type_five"
                                >Power Zooming</el-button
                            >
                        </el-form-item>

                        <el-form-item label="Preview">
                            <el-button type="warning" @click="Preview(1)" :disabled="buttons || !this.form.augment_type_one"
                                >Radio Noise</el-button
                            >
                            <el-button type="warning" @click="Preview(2)" :disabled="buttons || !this.form.augment_type_two"
                                >Signal Outage</el-button
                            >
                            <el-button type="warning" @click="Preview(3)" :disabled="buttons || !this.form.augment_type_three"
                                >Signal Disruptions</el-button
                            >
                            <el-button type="warning" @click="Preview(4)" :disabled="buttons || !this.form.augment_type_four"
                                >Channel Transformation</el-button
                            >
                            <el-button type="warning" @click="Preview(5)" :disabled="buttons || !this.form.augment_type_five"
                                >Power Zooming</el-button
                            >
                        </el-form-item>
                    </el-form>
                </el-row>
                <!-- </el-row> -->
            </div>
        </div>
        <!-- 生成点云预览 -->
        <el-dialog title="Preview" :visible.sync="previewDialogVisible" width="1300px" height="630px" center>
            <div style="height: 1200px">
                <div class="block">
                    <span class="demonstration right">Select data</span>
                    <el-cascader
                        v-model="preview_value"
                        :options="preview_options"
                        :props="{ expandTrigger: 'hover' }"
                        @change="previewHandleChange"
                        style="width: 800px"
                    ></el-cascader>
                    <div id="preview" class="view1"></div>
                    <div id="preview2" class="view1"></div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import qs from 'qs';
import jsonp from 'jsonp';
import * as echarts from 'echarts';
import fileDownload from 'js-file-download';

export default {
    name: 'baseform',
    inject: ['reload'],
    data() {
        // var checkMethod = (rule, value, callback) => {
        //     console.log('method:' + value);
        //     if (value === '') {
        //         return callback(new Error('生成方法不能为空'));
        //     }
        // };
        return {
            checked1: false,
            checked2: false,
            checked3: false,
            checked4: false,
            checked5: false,
            preview_value: [],
            previewDialogVisible: false,
            preview_options: [],
            data_x_o: [],
            data_y_o: [],
            data_x_g: [],
            data_y_g: [],
            buttons: true,
            method_value: [],
            type_value: '',
            temp: [1, 1],
            mark_group: {
                marks1_10: {
                    1: '1',
                    10: {
                        style: {
                            width: '30px'
                        },
                        label: '10'
                    }
                }
            },
            activeNames: [null],
            activeName: 'first',
            form: {
                augment_type_one: 0,
                augment_type_two: 0,
                augment_type_three: 0,
                augment_type_four: 0,
                augment_type_five: 0,
                params: 1,
                file: {}
            },
            FormRules: {
                // // 验证用户名是否合法
                // name: [{ required: true, message: '任务名不可为空', trigger: 'blur' }],
                // // 验证密码是否合法
                // augmentation_method: [{ required: true, message: '生成方法不可为空', trigger: 'blur' }]
            },
            // loadingMethod: false,
            methods: [],
            fileList: [],
            typeList: [],
            value: [],
            options: [
                {
                    value: 'Transmission Metamorphic Methods',
                    label: 'Transmission Metamorphic Methods',
                    children: [
                        {
                            value: 'Radio Noise',
                            label: 'Radio Noise'
                        },
                        {
                            value: 'Signal Outage',
                            label: 'Signal Outage'
                        },
                        {
                            value: 'Signal Disruptions',
                            label: 'Signal Disruptions'
                        }
                    ]
                },
                {
                    value: 'Time-frequency Metamorphic Methods',
                    label: 'Time-frequency Metamorphic Methods',
                    children: [
                        {
                            value: 'Channel Transformation',
                            label: 'Channel Transformation'
                        },
                        {
                            value: 'Power Zooming',
                            label: 'Power Zooming'
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        async Preview(index) {
            // GET:129.211.89.155:8050/showwavemessage?augment_type_one=0&augment_type_two=1&augment_type_three=0&augment_type_four=0&augment_type_five=0
            let one = 0,
                two = 0,
                three = 0,
                four = 0,
                five = 0;
            let file_name = '';
            if (index == 1) {
                one = 1;
            } else if (index == 2) {
                two = 1;
            } else if (index == 3) {
                three = 1;
            } else if (index == 4) {
                four = 1;
            } else if (index == 5) {
                five = 1;
            }
            console.log(
                '/showwavemessage?augment_type_one=' +
                    one +
                    '&augment_type_two=' +
                    two +
                    '&augment_type_three=' +
                    three +
                    '&augment_type_four=' +
                    four +
                    '&augment_type_five=' +
                    five
            );
            const { data: data } = await this.$http({
                url:
                    '/showwavemessage?augment_type_one=' +
                    one +
                    '&augment_type_two=' +
                    two +
                    '&augment_type_three=' +
                    three +
                    '&augment_type_four=' +
                    four +
                    '&augment_type_five=' +
                    five,
                method: 'get'
            });
            console.log('data:', data);
            let details = [];
            if (index == 1) {
                details = data.detailsone;
            } else if (index == 2) {
                details = data.detailstwo;
            } else if (index == 3) {
                details = data.detailsthree;
            } else if (index == 4) {
                details = data.detailsfour;
            } else if (index == 5) {
                details = data.detailsfive;
            }
            console.log(details);
            // console.log('data.details:', data.details);
            // console.log('data.details[0]:', data.details[0]);
            // console.log('data.details[0]:', data.details[0].data[0]);
            for (let i = 0; i < details.length; i++) {
                console.log('data.details[i]:', details[i]);
                this.data_x_g.push(details[i].data[0]);
                this.data_y_g.push(details[i].data[1]);
                this.data_x_o.push(data.original[i].data[0]);
                this.data_y_o.push(data.original[i].data[1]);
            }

            console.log(this.data_x_g);
            console.log(this.data_y_g);
            console.log(this.data_x_o);
            console.log(this.data_y_o);
            // console.log('data_x:', this.data_x);
            // console.log('data_y:', this.data_y);
            this.preview_options = [];
            for (let i = 0; i < this.data_x_o.length; i++) {
                let temp = {};
                temp.value = '' + i;
                temp.label = 'data' + i;
                this.preview_options.push(temp);
            }
            console.log('this.preview_value:', this.preview_value);
            this.previewDialogVisible = true;
        },
        async DownLoad(index) {
            // GET:129.211.89.155:8050/downloadwave?augment_type_one=0&augment_type_two=0&augment_type_three=0&augment_type_four=1&augment_type_five=0
            let one = 0,
                two = 0,
                three = 0,
                four = 0,
                five = 0;
            let file_name = '';
            if (index == 1) {
                one = 1;
                file_name = 'downloaddata_GN.json';
            } else if (index == 2) {
                two = 1;
                file_name = 'downloaddata_RE.json';
            } else if (index == 3) {
                three = 1;
                file_name = 'downloaddata_F.json';
            } else if (index == 4) {
                four = 1;
                file_name = 'downloaddata_ST.json';
            } else if (index == 5) {
                five = 1;
                file_name = 'downloaddata_Z.json';
            }
            const { data: data } = await this.$http({
                url:
                    '/downloadwave?augment_type_one=' +
                    one +
                    '&augment_type_two=' +
                    two +
                    '&augment_type_three=' +
                    three +
                    '&augment_type_four=' +
                    four +
                    '&augment_type_five=' +
                    five,
                method: 'get',
                contentType: 'application/x-www-form-urlencoded',
                responseType: 'blob'
            });
            console.log('download:', data);

            fileDownload(data, file_name);
        },
        // 发送添加任务申请
        onSubmit() {
            this.loading = true;
            this.form.master = this.$store.state.userId;
            this.$refs.formRef.validate(async valid => {
                if (1) {
                    var adddata = new FormData();

                    // name
                    if (!this.checked1 && !this.checked2 && !this.checked3 && !this.checked4 && !this.checked5) {
                        return this.$message.error('Please select the method! ');
                    } else {
                        this.form.augment_type_one = this.checked1 ? 1 : 0;
                        this.form.augment_type_two = this.checked2 ? 1 : 0;
                        this.form.augment_type_three = this.checked3 ? 1 : 0;
                        this.form.augment_type_four = this.checked4 ? 1 : 0;
                        this.form.augment_type_five = this.checked5 ? 1 : 0;
                    }

                    adddata.append('augment_type_one', this.form.augment_type_one);
                    adddata.append('augment_type_two', this.form.augment_type_two);
                    adddata.append('augment_type_three', this.form.augment_type_three);
                    adddata.append('augment_type_four', this.form.augment_type_four);
                    adddata.append('augment_type_five', this.form.augment_type_five);

                    adddata.append('params', this.form.params);

                    // file
                    this.form.file = document.getElementById('filetemp').files[0];
                    if (this.form.file) {
                        adddata.append('file', this.form.file);
                    } else {
                        this.loading = false;
                        return this.$message.error('Please upload the file! ');
                    }

                    for (var [a, b] of adddata.entries()) {
                        console.log(a, b);
                    }

                    const { data: data } = await this.$http({
                        url: 'uploadwave',
                        data: adddata,
                        method: 'post'
                        // contentType: 'application/x-www-form-urlencoded',
                        // responseType: 'blob'
                    });
                    console.log('data:', data);
                    if (data.page == 200) {
                        this.$message.success('Submitted successfully!');
                        // 重置表单
                        this.buttons = false;
                    } else {
                        this.$message.error('Submission failed!');
                    }

                    // console.log('重置表单');
                    // this.reload();
                    // this.$store.commit('storeToken', data.data.token);
                }
            });
        },
        Reset() {
            this.reload();
        },

        async previewHandleChange() {
            console.log('this.preview_value:', this.preview_value);
            this.get_preview();
        },
        get_preview() {
            var myChart = echarts.init(document.getElementById('preview'));
            var option = {
                title: {
                    text: 'Input data'
                },

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.data_x_o[parseInt(this.preview_value[0])]
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: this.data_y_o[parseInt(this.preview_value[0])],
                        type: 'line'
                    }
                ]
            };
            myChart.setOption(option);

            var myChart2 = echarts.init(document.getElementById('preview2'));
            var option2 = {
                title: {
                    text: 'Augmented data'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.data_x_g[parseInt(this.preview_value[0])]
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: this.data_y_g[parseInt(this.preview_value[0])],
                        type: 'line'
                    }
                ]
            };
            myChart2.setOption(option2);
        },

        clickfiletemp() {
            document.getElementById('filetemp').click();
        },
        reloadPage() {
            this.reload();
        },

        handleChange(value) {
            console.log(value);
            this.form.augmentation_type_name = value[0];
            this.form.augmentation_method_name = value[1];
            console.log('this.form.augmentation_type_name:', this.form.augmentation_type_name);
            console.log('this.form.augmentation_method_name:', this.form.augmentation_method_name);
        },
        // 上传文件[this.form.file赋值]
        fileLoad() {
            const selectedFile = this.$refs.image_t_file_ref.files[0];

            let fileName = selectedFile.name;
            let pos = fileName.lastIndexOf('.');
            let lastName = fileName.substring(pos, fileName.length);
            console.log(lastName, lastName.toLowerCase());
            console.log('lastName:', lastName);
            if (lastName.toLowerCase() !== '.json') {
                this.$message.error('文件必须为 .json 类型');
                // this.$refs.lidar_t_file_ref.clearFiles;
                this.$refs.image_t_file_ref.value = ''; // 清空file文件
                // return false;
            } else {
                this.form.file = selectedFile;
                var str = document.getElementById('filetemp').value;
                str = str.split('\\')[str.split('\\').length - 1];
                document.getElementById('inputFileAgent').value = str;
            }
        },
        clickLoad() {
            this.$refs.refFile.dispatchEvent(new MouseEvent('click'));
        }
    }
};
</script>

<style scoped>
.marginRight {
    margin-right: 10px !important;
}
.view1 {
    width: 1200px;
    height: 530px;
    margin: 0 10px 0 0;
    background-color: #fff;
    float: left;
}
</style>
