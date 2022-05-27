<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-s-help"></i> 激光雷达蜕变 </el-breadcrumb-item>
                <el-breadcrumb-item>添加生成任务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="formRef" :model="form" :rules="rulesList" label-width="120px">
                    <el-form-item label="任务名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="任务类型" prop="augmentation_method">
                        <div style="float: left; margin-right: 5px; ">
                            <el-select
                                v-model="form.augmentation_method"
                                placeholder="请选择生成方法"
                                @change="methodChanged"
                                style="width: 220px"
                            >
                                <el-option v-for="item in this.methods" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                            </el-select>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="生成方法说明:"
                                width="200"
                                trigger="hover"
                                content="请注意：在场景物体添加蜕变功能中，若您所提供的场景不足以达到您所指定的扩增数量时，算法会返回该场景所能扩增的最大数量，其可能为0（即该场景无法扩增）。极端场景蜕变功能同理。"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                                <!-- <el-button slot="reference">hover 激活</el-button> -->
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 10 || params_id == 11 || params_id == 12" label="紧急等级">
                        <div style="float: left; margin-right: 5px; width:300px">
                            <!-- <el-input type="text" v-model="form.urgency_level"></el-input> -->
                            <el-slider v-model="form.urgency_level" :min="1" :max="5" :step="1" :marks="mark_group.marks1_5"> </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="紧急等级:"
                                width="200"
                                trigger="hover"
                                content="任务的紧急程度，系统会根据紧急等级对任务进行调度"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item v-if="params_id == 1 || params_id == 2 || params_id == 3" label="紧急等级" prop="urgency_level">
                        <div style="float: left; margin-right: 5px">
                            <el-input type="text" v-model="form.urgency_level"></el-input>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="紧急等级:"
                                width="200"
                                trigger="hover"
                                content="任务的紧急程度，系统会根据紧急等级对任务进行调度"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item> -->
                    <!-- <el-form-item label="原点云序号" v-if="params_id == 10 || params_id == 11 || params_id == 12" prop="aug_index">
                        <div style="float: left; margin-right: 5px">
                            <el-input type="text" v-model="form.aug_index" placeholder="请输入原点云序号(0~7480)"></el-input>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="原点云序号:"
                                width="210"
                                trigger="hover"
                                content="选取KITTI数据集中序列为0~7480的任一点云进行扩增"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item> -->
                    <el-form-item label="生成卡车类型" v-if="params_id == 10" prop="aug_object_Truck">
                        <div style="float: left; margin-right: 5px">
                            <el-select v-model="form.aug_object_Truck" placeholder="请选择生成卡车类型">
                                <el-option v-for="item in truck_options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="生成卡车类型:"
                                width="200"
                                trigger="hover"
                                content="选择不同的卡车型号作为扩增物体。不同卡车对应物体长宽高、点云数、形状均不同，目前提供三种卡车型号"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                                <!-- <el-button slot="reference">hover 激活</el-button> -->
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item label="生成卡车数量" v-if="params_id == 10 && form.aug_object_Truck" prop="aug_count_Truck">
                        <!-- <el-input type="text" v-model="form.aug_count_Truck" placeholder="请输入生成卡车数量"></el-input> -->
                        <el-slider v-model="form.aug_count_Truck" show-input> </el-slider>
                    </el-form-item>

                    <el-form-item label="生成轿车类型" v-if="params_id == 10" prop="aug_object_Car">
                        <div style="float: left; margin-right: 5px">
                            <el-select v-model="form.aug_object_Car" placeholder="请选择生成轿车类型">
                                <el-option v-for="item in car_options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="生成轿车类型:"
                                width="200"
                                trigger="hover"
                                content="选择不同的轿车型号作为扩增物体。不同轿车对应物体长宽高、点云数、形状均不同，目前仅提供一种轿车型号"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                                <!-- <el-button slot="reference">hover 激活</el-button> -->
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item label="生成轿车数量" v-if="params_id == 10 && form.aug_object_Car" prop="aug_count_Car">
                        <!-- <el-input type="text" v-model="form.aug_count_Car" placeholder="请输入生成轿车数量"></el-input> -->
                        <el-slider v-model="form.aug_count_Car" show-input> </el-slider>
                    </el-form-item>

                    <el-form-item label="生成自行车类型" v-if="params_id == 10" prop="aug_object_Cyclist">
                        <div style="float: left; margin-right: 5px">
                            <el-select v-model="form.aug_object_Cyclist" placeholder="请选择生成自行车类型">
                                <el-option v-for="item in cyclist_options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="生成自行车类型:"
                                width="200"
                                trigger="hover"
                                content="选择不同的自行车型号作为扩增物体。不同自行车对应物体长宽高、点云数、形状均不同，目前提供两种自行车型号"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                                <!-- <el-button slot="reference">hover 激活</el-button> -->
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item label="生成自行车数量" v-if="params_id == 10 && form.aug_object_Cyclist" prop="aug_count_Cyclist">
                        <!-- <el-input type="text" v-model="form.aug_count_Cyclist" placeholder="请输入生成自行车数量"></el-input> -->
                        <el-slider v-model="form.aug_count_Cyclist" show-input> </el-slider>
                    </el-form-item>

                    <el-form-item label="物体旋转角度" v-if="params_id == 11" prop="angle">
                        <!-- <div style="float: left; margin-right: 5px; width: 100px">
                            <el-slider v-model="form.angle" show-input :min="-180" :max="180" style="width: 100px"> </el-slider>
                        </div> -->
                        <!-- <el-input type="number" v-model="form.angle" placeholder="请输入物体旋转角度(-180~180)"></el-input> -->
                        <div style="float: left; margin-right: 5px; width:400px">
                            <el-slider v-model="form.angle" show-input :min="-180" :max="180" :step="0.5" :marks="marks"> </el-slider>
                        </div>

                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="物体旋转角度:"
                                width="200"
                                trigger="hover"
                                content="对场景中标签所含的所有物体进行旋转角度的选择"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                                <!-- <el-button slot="reference">hover 激活</el-button> -->
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="params_id == 12" label="是否加入卡车">
                        <div style="float: left; margin-right: 5px">
                            <el-switch v-model="form.aug_Truck" active-text="是" inactive-text="否"> </el-switch>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="是否加入卡车:"
                                width="210"
                                trigger="hover"
                                content="选择生成的极端场景中是否包含大量卡车"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                                <!-- <el-button slot="reference">hover 激活</el-button> -->
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="params_id == 12" label="是否加入轿车">
                        <div style="float: left; margin-right: 5px">
                            <el-switch v-model="form.aug_Car" active-text="是" inactive-text="否"> </el-switch>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="是否加入轿车:"
                                width="210"
                                trigger="hover"
                                content="选择生成的极端场景中是否包含大量轿车"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                                <!-- <el-button slot="reference">hover 激活</el-button> -->
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="params_id == 12" label="是否加入自行车">
                        <div style="float: left; margin-right: 5px">
                            <el-switch v-model="form.aug_Cyclist" active-text="是" inactive-text="否"> </el-switch>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="是否加入自行车:"
                                width="210"
                                trigger="hover"
                                content="选择生成的极端场景中是否包含大量自行车"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                                <!-- <el-button slot="reference">hover 激活</el-button> -->
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="params_id == 10 || params_id == 11 || params_id == 12" label="上传文件">
                        <input type="file" id="filetemp" prop="form.file" ref="lidar_t_file_ref" @change="fileLoad" />
                        <el-popover
                            placement="right-start"
                            title="该方法所需上传文件类型限制为 .zip 类型。文件结构如下（旋转功能无需planes）:"
                            width="200"
                            trigger="hover"
                            style="white-space: pre-wrap"
                        >
                            <i class="el-icon-info" slot="reference"></i>
                            <img src="../../assets/lidar_t_upload_file.jpg" class="user-avator" alt />
                        </el-popover>
                        <br />
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            :disabled="is_available_to_submit"
                            @click="onSubmit"
                            :loading="loading"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="提交中"
                            >表单提交</el-button
                        >
                        <!-- <el-button type="primary" :disabled="is_available_to_submit" @click="onSubmit">表单提交</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import qs from 'qs';
export default {
    name: 'baseform',
    inject: ['reload'],
    data() {
        const isNotNag_int = (rule, value, callback) => {
            const boolean = new RegExp('^[1-9][0-9]*$').test(value);
            if (value !== '0' && !boolean) {
                callback(new Error('请输入非负整数'));
            } else {
                callback();
            }
        };
        const generate_per_file_and_paramsRule = (rule, value, callback) => {
            if (value < 1) {
                callback(new Error('只能为大于等于1整数'));
            } else {
                callback();
            }
        };
        const isNum = (rule, value, callback) => {
            const age = /^[0-9]*$/;
            if (!age.test(value)) {
                callback(new Error('只能为非负数字'));
            } else {
                callback();
            }
        };
        const isNotNag = (rule, value, callback) => {
            if (value < 0) {
                callback(new Error('只能为非负数'));
            } else {
                callback();
            }
        };
        const epsilonRule = (rule, value, callback) => {
            var list = value.split(',');
            for (var i in list) {
                if (!typeof parseFloat(list[i]) === 'number' && !isNaN(parseFloat(list[i])) && parseFloat(list[i]) < 0) {
                    callback(new Error('请填写合理的非负数字列表'));
                } else {
                    callback();
                }
            }
        };
        return {
            marks: {
                0: '0'
            },
            mark_group: {
                marks1_2: {
                    1: '1',
                    2: '2'
                },
                marks0001_2: {
                    0.001: '0.001',
                    2: '2'
                },
                marks0001_1: {
                    0.001: '0.001',
                    1: '1'
                },
                marks1_100: {
                    1: '1',
                    100: {
                        style: {
                            width: '30px'
                        },
                        label: '100'
                    }
                },
                marks1_1000: {
                    1: '1',
                    1000: {
                        style: {
                            width: '40px'
                        },
                        label: '1000'
                    }
                },
                marks1_15000: {
                    1: '1',
                    15000: {
                        style: {
                            width: '50px'
                        },
                        label: '15000'
                    }
                },
                marks0_5: {
                    0: '0',
                    5: '5'
                },
                marks1_5: {
                    1: '1',
                    5: '5'
                }
            },
            value: 0,
            loading: false,
            form: {
                name: '',
                augmentation_method: null,
                // aug_index: null,
                aug_object_Car: null,
                aug_count_Car: 0,
                aug_object_Truck: null,
                aug_count_Truck: 0,
                aug_object_Cyclist: null,
                aug_count_Cyclist: 0,

                angle: 0,

                aug_Car: true,
                aug_Truck: true,
                aug_Cyclist: true,

                master: this.$store.state.userId,
                urgency_level: 0,
                file: {}
            },
            methods: [],
            truck_options: [
                {
                    value: '1',
                    label: '类型1'
                },
                {
                    value: '2',
                    label: '类型2'
                },
                {
                    value: '3',
                    label: '类型3'
                }
            ],
            car_options: [
                {
                    value: '1',
                    label: '类型1'
                }
            ],
            cyclist_options: [
                {
                    value: '1',
                    label: '类型1'
                },
                {
                    value: '2',
                    label: '类型2'
                }
            ],
            fileList: [],
            typeList: [],
            params_id: 0,
            is_available_to_submit: true,
            rules1: {
                augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
                epsilon: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: epsilonRule, trigger: 'blur' }
                ],
                generate_per_file_and_params: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ]
                // urgency_level: [
                //     { required: true, message: '请输入数字', trigger: 'blur' },
                //     { validator: isNotNag_int, trigger: 'blur' }
                // ]
            },
            rules2: {
                augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
                ite_epsilon2: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: isNotNag, trigger: 'blur' }
                ],
                ite_limit: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ],
                generate_per_file: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ]
            },
            rules3: {
                augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
                ite_epsilon3: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: isNotNag, trigger: 'blur' }
                ],
                ite_limit: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ],
                generate_per_file: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ],
                boundary_constraint: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: isNotNag, trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        rulesList: function() {
            if (this.params_id === 10) {
                return this.rules1;
            } else if (this.params_id === 11) {
                return this.rules2;
            } else if (this.params_id === 12) {
                return this.rules3;
            }
        }
    },
    methods: {
        trim(str) {
            return str.replace(/(^s*)|(s*$)/g, '');
        },
        onSubmit() {
            this.loading = true;
            (this.form.master = this.$store.state.userId),
                this.$refs.formRef.validate(async valid => {
                    if (valid) {
                        if (this.form.augmentation_method === '') {
                            this.loading = false;
                            return this.$message.error('请选择生成方法!');
                        }

                        var adddata = new FormData();
                        if (this.form.name) {
                            adddata.append('name', this.form.name);
                        }
                        adddata.append('augmentation_method', this.form.augmentation_method);
                        adddata.append('master', this.form.master);
                        adddata.append('urgency_level', this.form.urgency_level + '');

                        var temp_params = {};
                        if (this.form.augmentation_method === 10) {
                            if (this.form.aug_count_Car + this.form.aug_count_Truck + this.form.aug_count_Cyclist === 0) {
                                this.loading = false;
                                return this.$message.error('添加数量不可为0！');
                            }
                            temp_params = {
                                aug_object_car: this.form.aug_object_Car ? this.form.aug_object_Car : '1',
                                aug_object_truck: this.form.aug_object_Truck ? this.form.aug_object_Truck : '1',
                                aug_object_cyclist: this.form.aug_object_Cyclist ? this.form.aug_object_Cyclist : '1',
                                aug_count_car: this.form.aug_count_Car + '',
                                aug_count_truck: this.form.aug_count_Truck + '',
                                aug_count_cyclist: this.form.aug_count_Cyclist + ''
                            };
                        } else if (this.form.augmentation_method === 11) {
                            if (this.form.angle === 0) {
                                this.loading = false;
                                return this.$message.error('旋转角度不可为0！');
                            }
                            temp_params = {
                                angle: this.form.angle + ''
                            };
                        } else if (this.form.augmentation_method === 12) {
                            if (!this.form.aug_Car && !this.form.aug_Truck && !this.form.aug_Cyclist) {
                                this.loading = false;
                                return this.$message.error('请选择添加物体！');
                            }
                            temp_params = {
                                aug_Car: this.form.aug_Car,
                                aug_Truck: this.form.aug_Truck,
                                aug_Cyclist: this.form.aug_Cyclist
                            };
                        }

                        temp_params = JSON.stringify(temp_params);
                        adddata.append('params', temp_params);
                        this.form.file = document.getElementById('filetemp').files[0];

                        console.log('this.form.file:', this.form.file);
                        if (this.form.file) {
                            adddata.append('file', this.form.file);
                        } else {
                            this.loading = false;
                            return this.$message.error('请上传文件！');
                        }

                        for (var [a, b] of adddata.entries()) {
                            console.log(a, b);
                        }
                        const { data: data } = await this.$http({
                            url: '/task/',
                            data: adddata,
                            method: 'post'
                        });
                        if (data.code !== 20000) {
                            this.loading = false;
                            return this.$message.error('添加生成任务失败！' + '错误原因：' + data.msg);
                        }
                        this.$message.success('提交成功！');
                        this.reload();
                    } else {
                        this.loading = false;
                    }
                });
        },
        async methodChanged(method_id) {
            this.params_id = method_id;
            this.form.augmentation_method = this.params_id;
            console.log('this.params_id:', this.params_id);
            this.is_available_to_submit = false;
        },
        fileLoad() {
            const selectedFile = this.$refs.lidar_t_file_ref.files[0];

            let fileName = selectedFile.name;
            let pos = fileName.lastIndexOf('.');
            let lastName = fileName.substring(pos, fileName.length);
            console.log(lastName, lastName.toLowerCase());
            console.log('lastName:', lastName);
            if (lastName.toLowerCase() !== '.zip') {
                this.$message.error('文件必须为 .zip 类型');
                // this.$refs.lidar_t_file_ref.clearFiles;
                this.$refs.lidar_t_file_ref.value = ''; // 清空file文件
                return false;
            }

            this.form.file = selectedFile;
        },
        clickLoad() {
            this.$refs.refFile.dispatchEvent(new MouseEvent('click'));
        },
        async getTypeList() {
            const { data: data } = await this.$http.get('/augmentation_type/');
            if (data.code !== 20000) {
                return this.$message.error('获取任务列表失败！' + '错误原因：' + data.msg);
            }

            this.typeList = data.data;
        }
    },
    async mounted() {
        this.$store.commit('setUserId', sessionStorage.getItem('userId'));

        var id = 2;
        const { data: data } = await this.$http.get('/augmentation_method/?augmentation_type=' + id);
        if (data.code === 45000) {
            return this.$message.error('该生成类型暂无方法！');
        }
        if (data.code !== 20000) {
            return this.$message.error('查询生成方法失败！');
        }
        this.methods = data.data.filter(item => {
            return item.augmentation_type_id === id;
        });
        console.log('this.methods:', this.methods);
    },
    created() {
        this.getTypeList();
    }
};
</script>
<style scoped>
.marginRight {
    margin-right: 10px !important;
}
</style>
