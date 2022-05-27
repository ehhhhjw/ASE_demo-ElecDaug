<template>
    <div>
        <div class="container">
            <div class="form-box">
                <el-form ref="formRef" :model="form" :rules="rulesList" label-width="120px">
                    <el-form-item label="Task Name" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="Augmentation Type">
                        <el-select v-model="form.augmentation_method" placeholder="Please select augmentation type" @change="methodChanged">
                            <el-option v-for="item in this.methods" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="params_id == 1 || params_id == 2 || params_id == 3" label="Urgency Level">
                        <div style="float: left; margin-right: 5px; width:300px">
                            <!-- <el-input type="text" v-model="form.urgency_level"></el-input> -->
                            <el-slider v-model="form.urgency_level" :min="1" :max="5" :step="1" :marks="mark_group.marks1_5"> </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="Description of Urgency level:"
                                width="200"
                                trigger="hover"
                                content="The urgency of the task, the system will schedule the task according to the urgency level."
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 1" label="扰动幅度" prop="epsilon">
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="扰动幅度:"
                                width="200"
                                trigger="hover"
                                content="表示攻击中对点云参数的扰动值，此处可批量设置"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                        <div class="block" style="float: left; margin-right: 5px; width: 450px">
                            <!-- <el-input type="text" v-model="form.epsilon"></el-input> -->
                            <el-form-item
                                v-for="(domain, index) in form.domains"
                                :label="'幅度' + (index + 1)"
                                :key="domain.key"
                                label-width="50px"
                            >
                                <el-slider
                                    v-model="domain.value"
                                    show-input
                                    :min="0.001"
                                    :max="2"
                                    :step="0.001"
                                    :marks="mark_group.marks0001_2"
                                >
                                </el-slider
                                ><el-button @click.prevent="removeDomain(domain)" style="margin-left: 20px">delete</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addDomain()">新增幅度</el-button>
                                <el-button @click="resetForm('form')">reset</el-button>
                            </el-form-item>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 2" label="单步扰动幅度">
                        <div style="float: left; margin-right: 5px; width:400px">
                            <!-- <el-input type="number" v-model="form.ite_epsilon2"></el-input> -->
                            <el-slider
                                v-model="form.ite_epsilon2"
                                show-input
                                :min="0.001"
                                :max="1"
                                :step="0.001"
                                :marks="mark_group.marks0001_1"
                            >
                            </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单步扰动幅度:"
                                width="200"
                                trigger="hover"
                                content="表示迭代攻击中每步对点云参数的扰动值"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 3" label="单步扰动幅度">
                        <div style="float: left; margin-right: 5px; width:400px">
                            <!-- <el-input type="number" v-model="form.ite_epsilon3"></el-input> -->
                            <el-slider
                                v-model="form.ite_epsilon3"
                                show-input
                                :min="0.001"
                                :max="2"
                                :step="0.001"
                                :marks="mark_group.marks0001_2"
                            >
                            </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单步扰动幅度:"
                                width="200"
                                trigger="hover"
                                content="表示迭代攻击中每步对点云参数的扰动值"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 2 || params_id == 3" label="扰动次数上限">
                        <div style="float: left; margin-right: 5px; width:400px">
                            <!-- <el-input type="number" v-model="form.ite_limit"></el-input> -->
                            <el-slider
                                v-if="params_id == 2"
                                v-model="form.ite_limit"
                                show-input
                                :min="1"
                                :max="1000"
                                :step="1"
                                :marks="mark_group.marks1_1000"
                            >
                            </el-slider>
                            <el-slider
                                v-if="params_id == 3"
                                v-model="form.ite_limit"
                                show-input
                                :min="1"
                                :max="15000"
                                :step="1"
                                :marks="mark_group.marks1_15000"
                            >
                            </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="扰动次数上限:"
                                width="200"
                                trigger="hover"
                                content="表示可对点云单步扰动的最大次数"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 1 || params_id == 2 || params_id == 3" label="是否旋转">
                        <div style="float: left; margin-right: 5px">
                            <el-switch v-model="form.whether_to_rotate" active-text="是" inactive-text="否"> </el-switch>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="是否旋转:"
                                width="200"
                                trigger="hover"
                                content="表示是否允许点云旋转"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 1" label="单文件生成数量">
                        <div style="float: left; margin-right: 5px; width: 400px">
                            <!-- <el-input type="number" v-model="form.generate_per_file_and_params"></el-input> -->
                            <el-slider
                                v-model="form.generate_per_file_and_params"
                                show-input
                                :min="1"
                                :max="100"
                                :step="1"
                                :marks="mark_group.marks1_100"
                            >
                            </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单文件生成数量及参数:"
                                width="200"
                                trigger="hover"
                                content="表示每个参数及点云所期望生成的点云数量"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 2 || params_id == 3" label="单文件生成数量">
                        <div style="float: left; margin-right: 5px; width:400px">
                            <!-- <el-input type="number" v-model="form.generate_per_file"></el-input> -->
                            <el-slider
                                v-model="form.generate_per_file"
                                show-input
                                :min="1"
                                :max="100"
                                :step="1"
                                :marks="mark_group.marks1_100"
                            >
                            </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单文件生成数量:"
                                width="200"
                                trigger="hover"
                                content="表示每个文件所期望的扩增数量"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 3" label="边界约束">
                        <div style="float: left; margin-right: 5px; width:400px">
                            <!-- <el-input type="number" v-model="form.boundary_constraint"></el-input> -->
                            <el-slider
                                v-model="form.boundary_constraint"
                                show-input
                                :min="1"
                                :max="2"
                                :step="0.001"
                                :marks="mark_group.marks1_2"
                            >
                            </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="边界约束:"
                                width="200"
                                trigger="hover"
                                content="表示点云能扰动的最大比例"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 1 || params_id == 2 || params_id == 3" label="严格模式">
                        <div style="float: left; margin-right: 5px">
                            <el-switch v-model="form.strict_mode" active-text="是" inactive-text="否"> </el-switch>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="严格模式:"
                                width="200"
                                trigger="hover"
                                content="表示是否是严格模式(“是”，表示生成结果必须使得模型做出错误判断才算扩增数据；“否”，表示直接经过参数设定生成的数据即视为扩增数据)"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id == 1 || params_id == 2 || params_id == 3" label="Upload file">
                        <input type="file" id="filetemp" prop="form.file" ref="lidar_t_file_ref" style="display:none" @change="fileLoad" />
                        <input type="text" value="" disabled id="inputFileAgent" />
                        <input type="button" @click="clickfiletemp" value="Browse..." />
                        <el-popover
                            placement="right-start"
                            title="The upload file type required by this method is limited to no suffix or '.zip'"
                            width="200"
                            trigger="hover"
                            style="white-space: pre-wrap"
                        >
                        </el-popover>
                        <br />
                    </el-form-item>

                    <!-- <el-form-item v-if="params_id == 1 || params_id == 2 || params_id == 3" label="上传文件">
                        <input type="file" id="filetemp" prop="form.file" ref="lidar_a_file_ref" @change="fileLoad" />
                        <el-popover
                            placement="right-start"
                            title="上传文件:"
                            width="200"
                            trigger="hover"
                            content="该方法所需上传文件类型限制为 无后缀/.zip 类型"
                        >
                            <i class="el-icon-info" slot="reference"></i>
                        </el-popover>
                        <br />
                    </el-form-item> -->
                    <el-form-item>
                        <el-button
                            type="primary"
                            :disabled="is_available_to_submit"
                            @click="onSubmit"
                            :loading="loading"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="Submitting"
                            >Submit</el-button
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
        return {
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
                    100: '100'
                },
                marks1_1000: {
                    1: '1',
                    1000: '1000'
                },
                marks1_15000: {
                    1: '1',
                    15000: '15000'
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
            loading: false,
            form: {
                name: '',
                augmentation_method: null,
                epsilon: '',
                domains: [
                    {
                        value: 0
                    }
                ],

                ite_epsilon2: null,
                ite_epsilon3: null,
                ite_limit: null,
                whether_to_rotate: false,
                generate_per_file_and_params: null,
                generate_per_file: null,
                boundary_constraint: null,
                strict_mode: false,

                master: this.$store.state.userId,
                urgency_level: 0,
                file: {}
            },
            methods: [],
            fileList: [],
            typeList: [],
            params_id: 0,
            is_available_to_submit: true
            // rules1: {
            //     augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }]
            //     // epsilon: [
            //     //     { required: true, message: '不能为空', trigger: 'blur' },
            //     //     { validator: epsilonRule, trigger: 'blur' }
            //     // ],
            //     // generate_per_file_and_params: [
            //     //     { required: true, message: '请输入数字', trigger: 'blur' },
            //     //     { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
            //     //     { validator: isNum, trigger: 'blur' }
            //     // ],
            //     // urgency_level: [
            //     //     { required: true, message: '请输入数字', trigger: 'blur' },
            //     //     { validator: isNotNag_int, trigger: 'blur' }
            //     // ]
            // },
            // rules2: {
            //     augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
            //     ite_epsilon2: [
            //         { required: true, message: '请输入数字', trigger: 'blur' },
            //         { validator: isNotNag, trigger: 'blur' }
            //     ],
            //     ite_limit: [
            //         { required: true, message: '请输入数字', trigger: 'blur' },
            //         { validator: isNum, trigger: 'blur' }
            //     ],
            //     generate_per_file: [
            //         { required: true, message: '请输入数字', trigger: 'blur' },
            //         { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
            //         { validator: isNum, trigger: 'blur' }
            //     ]
            // },
            // rules3: {
            //     augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
            //     ite_epsilon3: [
            //         { required: true, message: '请输入数字', trigger: 'blur' },
            //         { validator: isNotNag, trigger: 'blur' }
            //     ],
            //     ite_limit: [
            //         { required: true, message: '请输入数字', trigger: 'blur' },
            //         { validator: isNum, trigger: 'blur' }
            //     ],
            //     generate_per_file: [
            //         { required: true, message: '请输入数字', trigger: 'blur' },
            //         { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
            //         { validator: isNum, trigger: 'blur' }
            //     ],
            //     boundary_constraint: [
            //         { required: true, message: '请输入数字', trigger: 'blur' },
            //         { validator: isNotNag, trigger: 'blur' }
            //     ]
            // }
        };
    },
    computed: {
        rulesList: function() {
            if (this.params_id === 1) {
                return this.rules1;
            } else if (this.params_id === 2) {
                return this.rules2;
            } else {
                return this.rules3;
            }
        }
    },
    methods: {
        clickfiletemp() {
            document.getElementById('filetemp').click();
        },
        resetForm(formName) {
            console.log('formName:', formName);

            this.form.domains = [
                {
                    value: 0
                }
            ];
        },
        removeDomain(item) {
            if (this.form.domains.length == 1) {
                this.$message.error('扰动幅度不可为空!');
            } else {
                var item_index = this.form.domains.indexOf(item);
                if (item_index !== -1) {
                    this.form.domains.splice(item_index, 1);
                }
            }
        },
        addDomain() {
            this.form.domains.push({
                value: 0,
                key: Date.now()
            });
        },
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
                        if (this.form.augmentation_method === 1) {
                            var temp = [];
                            for (var x in this.form.domains) {
                                console.log('this.form.domains[x]["value"]:', this.form.domains[x]['value']);
                                temp.push(this.form.domains[x]['value']);
                            }
                            temp_params.epsilon = '[' + temp.toString() + ']';
                            // console.log("'[' + this.form.epsilon + ']':", '[' + this.form.epsilon + ']');
                            temp_params = {
                                epsilon: temp_params.epsilon,
                                whether_to_rotate: this.form.whether_to_rotate,
                                generate_per_file_and_params: this.form.generate_per_file_and_params,
                                strict_mode: this.form.strict_mode
                            };
                        } else if (this.form.augmentation_method === 2) {
                            temp_params = {
                                ite_epsilon: this.form.ite_epsilon2 + '',
                                ite_limit: this.form.ite_limit + '',
                                whether_to_rotate: this.form.whether_to_rotate,
                                generate_per_file: this.form.generate_per_file + '',
                                strict_mode: this.form.strict_mode
                            };
                        } else if (this.form.augmentation_method === 3) {
                            temp_params = {
                                ite_epsilon: this.form.ite_epsilon3 + '',
                                ite_limit: this.form.ite_limit + '',
                                whether_to_rotate: this.form.whether_to_rotate,
                                generate_per_file: this.form.generate_per_file + '',
                                boundary_constraint: this.form.boundary_constraint + '',
                                strict_mode: this.form.strict_mode
                            };
                        }
                        temp_params.whether_to_rotate = this.form.whether_to_rotate ? '1' : '0';
                        temp_params.strict_mode = this.form.strict_mode ? '1' : '0';

                        temp_params = JSON.stringify(temp_params);
                        adddata.append('params', temp_params);
                        this.form.file = document.getElementById('filetemp').files[0];

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

            this.is_available_to_submit = false;
        },
        fileLoad() {
            const selectedFile = this.$refs.lidar_t_file_ref.files[0];
            // console.log('selectedFile:', selectedFile);
            if (selectedFile == undefined) {
                document.getElementById('inputFileAgent').value = '';
            } else {
                let fileName = selectedFile.name;
                let pos = fileName.lastIndexOf('.');
                let lastName = fileName.substring(pos, fileName.length);
                console.log(lastName, lastName.toLowerCase());
                console.log('lastName:', lastName);
                if (pos != -1 && lastName.toLowerCase() !== '.zip') {
                    this.$message.error({
                        showClose: true,
                        message: 'The type of uploaded file is limited to no suffix or ".zip".',
                        offset: 70
                    });
                    // this.$refs.lidar_t_file_ref.clearFiles;
                    this.$refs.lidar_t_file_ref.value = ''; // 清空file文件
                    return false;
                }

                this.form.file = selectedFile;
                var str = document.getElementById('filetemp').value;
                str = str.split('\\')[str.split('\\').length - 1];
                document.getElementById('inputFileAgent').value = str;
            }
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

        var id = 1;
        const { data: data } = await this.$http.get('/augmentation_method/?augmentation_type=' + id);
        if (data.code === 45000) {
            return this.$message.error('该生成类型暂无方法！');
        }
        if (data.code !== 20000) {
            return this.$message.error('查询生成方法失败！' + '错误原因：' + data.msg);
        }
        this.methods = data.data.filter(item => {
            return item.augmentation_type_id === id;
        });
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
