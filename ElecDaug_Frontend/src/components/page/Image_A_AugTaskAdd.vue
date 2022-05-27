<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-picture-outline"></i> SAR雷达对抗 </el-breadcrumb-item>
                <el-breadcrumb-item>添加生成任务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="formRef" :model="form" :rules="rulesList" label-width="120px">
                    <el-form-item label="任务名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="任务类型">
                        <el-cascader
                            v-model="params_id"
                            :options="methods"
                            :props="{ expandTrigger: 'hover' }"
                            @change="methodChanged"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item v-if="params_id[1] == 7 || params_id[1] == 4 || params_id[1] == 5 || params_id[1] == 6" label="紧急等级">
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

                    <el-form-item v-if="params_id[1] == 4" label="扰动幅度">
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.range_epsilon_6"></el-input> -->
                            <!-- <el-slider v-model="form.range_epsilon_5" range :min="0.1" :max="10" :marks="range_epsilon_6_marks" :step="0.1">
                            </el-slider> -->
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="扰动幅度:"
                                width="200"
                                trigger="hover"
                                content="表示攻击中对图像的扰动值，可批量设置"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                        <el-radio v-model="radio_epsilon_4" label="1">列表</el-radio>
                        <el-radio v-model="radio_epsilon_4" label="2">范围</el-radio>

                        <div style="margin-right: 5px" v-if="radio_epsilon_4 == '1'">
                            <!-- <el-input v-if="radio_epsilon_4 == '1'" type="text" v-model="form.epsilon_4"></el-input> -->
                            <el-form-item
                                v-for="(domain, index) in form.domain_4"
                                :label="'幅度' + (index + 1)"
                                :key="domain.key"
                                label-width="50px"
                            >
                                <el-slider
                                    v-model="domain.value"
                                    show-input
                                    :min="0.1"
                                    :max="255"
                                    :step="0.1"
                                    :marks="mark_group.mark01_255"
                                >
                                </el-slider
                                ><el-button @click.prevent="removeDomain(domain, 4)" style="margin-left: 20px">删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addDomain(4)">新增幅度</el-button>
                                <el-button @click="resetForm('form', 4)">重置</el-button>
                            </el-form-item>
                        </div>

                        <el-slider
                            v-if="radio_epsilon_4 == '2'"
                            v-model="form.range_epsilon_4"
                            range
                            :min="0.1"
                            :max="255"
                            :step="0.1"
                            :marks="mark_group.mark01_255"
                        >
                        </el-slider>
                    </el-form-item>

                    <el-form-item v-if="params_id[1] == 7" label="单步扰动幅度">
                        <!-- <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <el-input type="number" v-model="form.range_epsilon_5"></el-input>
                        </div> -->
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.range_epsilon_6"></el-input> -->
                            <!-- <el-slider v-model="form.range_epsilon_5" range :min="0.1" :max="10" :marks="range_epsilon_6_marks" :step="0.1">
                            </el-slider> -->
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单步扰动幅度:"
                                width="200"
                                trigger="hover"
                                content="表示迭代攻击中每步对图像的扰动值，可批量设置"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                        <el-radio v-model="radio_epsilon_7" label="1">列表</el-radio>
                        <el-radio v-model="radio_epsilon_7" label="2">范围</el-radio>

                        <div style="margin-right: 5px" v-if="radio_epsilon_7 == '1'">
                            <!-- <el-input type="text" v-model="form.epsilon_7"></el-input> -->
                            <el-form-item
                                v-for="(domain, index) in form.domain_7"
                                :label="'幅度' + (index + 1)"
                                :key="domain.key"
                                label-width="50px"
                            >
                                <el-slider
                                    v-model="domain.value"
                                    show-input
                                    :min="0.1"
                                    :max="255"
                                    :step="0.1"
                                    :marks="mark_group.mark01_255"
                                >
                                </el-slider
                                ><el-button @click.prevent="removeDomain(domain, 7)" style="margin-left: 20px">删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addDomain(7)">新增幅度</el-button>
                                <el-button @click="resetForm('form', 7)">重置</el-button>
                            </el-form-item>
                        </div>

                        <el-slider
                            v-if="radio_epsilon_7 == '2'"
                            v-model="form.range_epsilon_7"
                            range
                            :min="0.1"
                            :max="255"
                            :step="0.1"
                            :marks="mark_group.mark01_255"
                        >
                        </el-slider>
                    </el-form-item>

                    <el-form-item v-if="params_id[1] == 5" label="单步扰动幅度">
                        <!-- <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <el-input type="number" v-model="form.range_epsilon_5"></el-input>
                        </div> -->
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.range_epsilon_6"></el-input> -->
                            <!-- <el-slider v-model="form.range_epsilon_5" range :min="0.1" :max="10" :marks="range_epsilon_6_marks" :step="0.1">
                            </el-slider> -->
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单步扰动幅度:"
                                width="200"
                                trigger="hover"
                                content="表示迭代攻击中每步对图像的扰动值，可批量设置"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                        <el-radio v-model="radio_epsilon_5" label="1">列表</el-radio>
                        <el-radio v-model="radio_epsilon_5" label="2">范围</el-radio>

                        <div style="margin-right: 5px" v-if="radio_epsilon_5 == '1'">
                            <!-- <el-input type="text" v-model="form.epsilon_5"></el-input> -->
                            <el-form-item
                                v-for="(domain, index) in form.domain_5"
                                :label="'幅度' + (index + 1)"
                                :key="domain.key"
                                label-width="50px"
                            >
                                <el-slider
                                    v-model="domain.value"
                                    show-input
                                    :min="0.1"
                                    :max="255"
                                    :step="0.1"
                                    :marks="mark_group.mark01_255"
                                >
                                </el-slider
                                ><el-button @click.prevent="removeDomain(domain, 5)" style="margin-left: 20px">删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addDomain(5)">新增幅度</el-button>
                                <el-button @click="resetForm('form', 5)">重置</el-button>
                            </el-form-item>
                        </div>

                        <el-slider
                            v-if="radio_epsilon_5 == '2'"
                            v-model="form.range_epsilon_5"
                            range
                            :min="0.1"
                            :max="255"
                            :step="0.1"
                            :marks="mark_group.mark01_255"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item v-if="params_id[1] == 6" label="单步扰动幅度">
                        <!-- <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <el-slider v-model="form.range_epsilon_6" range :min="0.1" :max="10" :marks="range_epsilon_6_marks" :step="0.1">
                            </el-slider>
                        </div> -->
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单步扰动幅度:"
                                width="200"
                                trigger="hover"
                                content="表示迭代攻击中每步对图像的扰动值【推荐取值0.5以上】，可批量设置"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                        <el-radio v-model="radio_epsilon_6" label="1">列表</el-radio>
                        <el-radio v-model="radio_epsilon_6" label="2">范围</el-radio>

                        <div style="margin-right: 5px" v-if="radio_epsilon_6 == '1'">
                            <!-- <el-input type="text" v-model="form.epsilon_6"></el-input> -->
                            <el-form-item
                                v-for="(domain, index) in form.domain_6"
                                :label="'幅度' + (index + 1)"
                                :key="domain.key"
                                label-width="50px"
                            >
                                <el-slider
                                    v-model="domain.value"
                                    show-input
                                    :min="0.1"
                                    :max="255"
                                    :step="0.1"
                                    :marks="mark_group.mark01_255"
                                >
                                </el-slider
                                ><el-button @click.prevent="removeDomain(domain, 6)" style="margin-left: 20px">删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addDomain(6)">新增幅度</el-button>
                                <el-button @click="resetForm('form', 6)">重置</el-button>
                            </el-form-item>
                        </div>

                        <el-slider
                            v-if="radio_epsilon_6 == '2'"
                            v-model="form.range_epsilon_6"
                            range
                            :min="0.1"
                            :max="255"
                            :step="0.1"
                            :marks="mark_group.mark01_255"
                        >
                        </el-slider>
                    </el-form-item>

                    <el-form-item v-if="radio_epsilon_7 == '2' && params_id[1] == 7" label="单文件生成数量" prop="generate_per_file">
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.generate_per_file_and_params"></el-input> -->
                            <el-slider v-model="form.generate_per_file" :min="1" :max="50" :marks="marks"> </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单文件生成数量及参数:"
                                width="200"
                                trigger="hover"
                                content="表示所期望生成的图像数量"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="radio_epsilon_4 == '2' && params_id[1] == 4" label="单文件生成数量" prop="generate_per_file">
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.generate_per_file_and_params"></el-input> -->
                            <el-slider v-model="form.generate_per_file" :min="1" :max="50" :marks="marks"> </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单文件生成数量及参数:"
                                width="200"
                                trigger="hover"
                                content="表示所期望生成的图像数量"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="radio_epsilon_5 == '2' && params_id[1] == 5" label="单文件生成数量" prop="generate_per_file">
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.generate_per_file_and_params"></el-input> -->
                            <el-slider v-model="form.generate_per_file" :min="1" :max="50" :marks="marks"> </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单文件生成数量及参数:"
                                width="200"
                                trigger="hover"
                                content="表示所期望生成的图像数量"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="radio_epsilon_6 == '2' && params_id[1] == 6" label="单文件生成数量" prop="generate_per_file">
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.generate_per_file_and_params"></el-input> -->
                            <el-slider v-model="form.generate_per_file" :min="1" :max="50" :marks="marks"> </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="单文件生成数量及参数:"
                                width="200"
                                trigger="hover"
                                content="表示所期望生成的图像数量"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="params_id[1] == 5" label="迭代次数上限">
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.ite_limit"></el-input> -->
                            <el-slider v-model="form.ite_limit" :min="1" :max="50" :marks="marks"> </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="迭代次数上限:"
                                width="200"
                                trigger="hover"
                                content="表示可对图像单步扰动的最大次数"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id[1] == 7" label="迭代次数" prop="num_iters">
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.ite_limit"></el-input> -->
                            <el-slider v-model="form.num_iters" :min="1" :max="50" :marks="marks"> </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="迭代次数:"
                                width="200"
                                trigger="hover"
                                content="表示可扰动的最大次数"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id[1] == 6" label="最多扰动特征数比例" prop="gamma">
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.ite_limit"></el-input> -->
                            <el-slider v-model="form.gamma" :min="1" :max="100" :marks="ite_limit_bili_marks"> </el-slider>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="最多扰动特征数比例:"
                                width="200"
                                trigger="hover"
                                content="【推荐取值50%-100%】"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id[1] == 6" label="定向攻击标签" prop="target">
                        <div class="block" style="float: left; margin-right: 20px; width: 200px">
                            <!-- <el-input type="number" v-model="form.ite_limit"></el-input> -->
                            <!-- <el-slider v-model="form.ite_limit" range :max="50" :marks="marks"> </el-slider> -->
                            <el-cascader
                                v-model="directional_id"
                                :options="directional"
                                :props="{ expandTrigger: 'hover' }"
                                @change="handleChange"
                            ></el-cascader>
                        </div>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="定向攻击标签:"
                                width="200"
                                trigger="hover"
                                content="选择定向攻击的方式"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="params_id[1] == 6" label="攻击方向" prop="positive">
                        <el-radio v-model="form.positive" label="1">正向</el-radio>
                        <el-radio v-model="form.positive" label="0">负向</el-radio>
                        <div style="float: left">
                            <el-popover
                                placement="right-start"
                                title="攻击方向:"
                                width="200"
                                trigger="hover"
                                content="对抗方向可分为正向或者负向"
                                style="float: left"
                            >
                                <i class="el-icon-info" slot="reference"></i>
                            </el-popover>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="params_id[1] == 4 || params_id[1] == 5 || params_id[1] == 6 || params_id[1] == 7" label="严格模式">
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
                    <el-form-item v-if="params_id[1] == 7 || params_id[1] == 4 || params_id[1] == 5 || params_id[1] == 6" label="上传文件">
                        <input type="file" id="filetemp" prop="form.file" ref="image_a_file_ref" @change="fileLoad" />
                        <el-popover
                            placement="right-start"
                            title="上传文件:"
                            width="200"
                            trigger="hover"
                            content="该方法所需上传文件类型限制为 .jpg/.jpeg/.zip 类型"
                        >
                            <i class="el-icon-info" slot="reference"></i>
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
            mark_group: {
                mark0: {
                    0: '0'
                },
                mark01_255: {
                    0.1: '0.1',
                    255: '255'
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
            radio_epsilon_4: '1',
            radio_epsilon_5: '1',
            radio_epsilon_6: '1',
            radio_epsilon_7: '1',
            loading: false,

            form: {
                domain_4: [
                    {
                        value: 0
                    }
                ],
                domain_5: [
                    {
                        value: 0
                    }
                ],
                domain_6: [
                    {
                        value: 0
                    }
                ],
                domain_7: [
                    {
                        value: 0
                    }
                ],
                target: null,
                positive: '1',
                name: '',
                augmentation_method: null,
                epsilon: '',
                // range_epsilon_5: null,
                // range_epsilon_6: null,
                range_epsilon_7: [0.1, 0.1],
                range_epsilon_4: [0.1, 0.1],
                range_epsilon_5: [0.1, 0.1],
                range_epsilon_6: [0.1, 0.1],
                // ite_limit: null,
                ite_limit: null,
                num_iters: [1, 1],
                gamma: [1, 1],
                whether_to_rotate: false,
                // generate_per_file_and_params: null,
                generate_per_file_and_params: 1,
                // generate_per_file: null,
                generate_per_file: 1,
                boundary_constraint: null,
                strict_mode: false,
                master: this.$store.state.userId,
                urgency_level: 0,
                file: {},
                epsilon_7: null,
                epsilon_4: null,
                epsilon_5: null,
                epsilon_6: null
            },

            marks: {
                1: '1',
                50: '50'
            },
            range_epsilon_6_marks: {
                0.1: '0.1',
                10: '10'
            },
            ite_limit_bili_marks: {
                1: '1%',
                100: '100%'
            },
            methods: [
                {
                    value: '0',
                    label: '黑盒对抗',
                    children: [
                        {
                            // Guassian_noise
                            value: '7',
                            label: 'SIMBA'
                        }
                    ]
                },
                {
                    value: '1',
                    label: '白盒对抗',
                    children: [
                        {
                            value: '4',
                            label: 'FGSM'
                        },
                        {
                            value: '5',
                            label: 'I-FGSM(BIM)'
                        },
                        {
                            value: '6',
                            label: 'JSMA'
                        }
                    ]
                }
            ],
            directional: [
                {
                    value: '0',
                    label: '定向',
                    children: [
                        {
                            value: '0',
                            label: '2S1'
                        },
                        {
                            value: '1',
                            label: 'BMP2'
                        },
                        {
                            value: '2',
                            label: 'BRDM_2'
                        },
                        {
                            value: '3',
                            label: 'BTR60'
                        },
                        {
                            value: '4',
                            label: 'BTR70'
                        },
                        {
                            value: '5',
                            label: 'D7'
                        },
                        {
                            value: '6',
                            label: 'T62'
                        },
                        {
                            value: '7',
                            label: 'T72'
                        },
                        {
                            value: '8',
                            label: 'ZIL131'
                        },
                        {
                            value: '9',
                            label: 'ZSU_23_4'
                        }
                    ]
                },
                {
                    value: '10',
                    label: '非定向',
                    children: [
                        {
                            // Guassian_noise
                            value: '10',
                            label: '随机'
                        }
                    ]
                }
            ],
            fileList: [],
            typeList: [],
            params_id: [null, null],
            directional_id: ['10', '10'],
            is_available_to_submit: true,
            rules1: {
                // augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
                epsilon: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: epsilonRule, trigger: 'blur' }
                ],
                generate_per_file_and_params: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ],
                urgency_level: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    { validator: isNotNag_int, trigger: 'blur' }
                ]
            },
            rules2: {
                // augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
                range_epsilon_5: [
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
                // augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
                range_epsilon_6: [
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
        resetForm(formName, index) {
            console.log('formName:', formName);
            // this.$refs[formName].resetFields();
            if (index == 4) {
                this.form.domain_4 = [
                    {
                        value: 0
                    }
                ];
            } else if (index == 5) {
                this.form.domain_5 = [
                    {
                        value: 0
                    }
                ];
            } else if (index == 6) {
                this.form.domain_6 = [
                    {
                        value: 0
                    }
                ];
            } else if (index == 7) {
                this.form.domain_7 = [
                    {
                        value: 0
                    }
                ];
            }
        },

        removeDomain(item, index) {
            if (index == 4) {
                if (this.form.domain_4.length == 1) {
                    this.$message.error('扰动幅度不可为空!');
                } else {
                    var item_index = this.form.domain_4.indexOf(item);
                    if (item_index !== -1) {
                        this.form.domain_4.splice(item_index, 1);
                    }
                }
            } else if (index == 5) {
                if (this.form.domain_5.length == 1) {
                    this.$message.error('单步扰动幅度不可为空!');
                } else {
                    var item_index = this.form.domain_5.indexOf(item);
                    if (item_index !== -1) {
                        this.form.domain_5.splice(item_index, 1);
                    }
                }
            } else if (index == 6) {
                if (this.form.domain_6.length == 1) {
                    this.$message.error('单步扰动幅度不可为空!');
                } else {
                    var item_index = this.form.domain_6.indexOf(item);
                    if (item_index !== -1) {
                        this.form.domain_6.splice(item_index, 1);
                    }
                }
            } else if (index == 7) {
                if (this.form.domain_7.length == 1) {
                    this.$message.error('单步扰动幅度不可为空!');
                } else {
                    var item_index = this.form.domain_7.indexOf(item);
                    if (item_index !== -1) {
                        this.form.domain_7.splice(item_index, 1);
                    }
                }
            }
        },
        addDomain(index) {
            if (index == 4) {
                this.form.domain_4.push({
                    value: 0,
                    key: Date.now()
                });
            } else if (index == 5) {
                this.form.domain_5.push({
                    value: 0,
                    key: Date.now()
                });
            } else if (index == 6) {
                this.form.domain_6.push({
                    value: 0,
                    key: Date.now()
                });
            } else if (index == 7) {
                this.form.domain_7.push({
                    value: 0,
                    key: Date.now()
                });
            }
        },
        handleChange() {
            console.log('this.params_id:', this.params_id);
        },
        trim(str) {
            return str.replace(/(^s*)|(s*$)/g, '');
        },
        onSubmit() {
            this.loading = true;
            this.form.master = this.$store.state.userId;
            this.$refs.formRef.validate(async valid => {
                // valid
                if (1) {
                    console.log('this.form.augmentation_method[1]:', this.form.augmentation_method[1]);
                    if (this.form.augmentation_method[1] === '') {
                        this.loading = false;
                        return this.$message.error('请选择生成方法!');
                    }

                    var adddata = new FormData();
                    if (this.form.name) {
                        adddata.append('name', this.form.name);
                    }
                    adddata.append('augmentation_method', this.form.augmentation_method[1]);
                    adddata.append('master', this.form.master);
                    adddata.append('urgency_level', this.form.urgency_level + '');
                    // adddata.append('urgency_level', this.form.urgency_level);
                    var temp_params = {};

                    if (this.form.augmentation_method[1] == 4) {
                        temp_params = {
                            strict_mode: this.form.strict_mode
                        };
                        temp_params.strict_mode = this.form.strict_mode ? '1' : '0';
                        if (this.radio_epsilon_4 == '1') {
                            // 列表
                            // epsilon: '[' + this.form.epsilon + ']',
                            // temp_params.epsilon = '[' + this.form.epsilon_4 + ']';
                            var temp = [];
                            for (var x in this.form.domain_4) {
                                console.log('this.form.domain_4[x]["value"]:', this.form.domain_4[x]['value']);
                                temp.push(this.form.domain_4[x]['value']);
                            }
                            temp_params.epsilon = '[' + temp.toString() + ']';
                            console.log('temp_params.epsilon:', temp_params.epsilon);
                        } else if (this.radio_epsilon_4 == '2') {
                            // 范围
                            temp_params.epsilon_upper_limit = this.form.range_epsilon_4[1] + '';
                            temp_params.epsilon_lower_limit = this.form.range_epsilon_4[0] + '';
                            temp_params.generate_per_file = this.form.generate_per_file + '';
                        }
                    } else if (this.form.augmentation_method[1] == 5) {
                        temp_params = {
                            ite_limit: this.form.ite_limit + '',
                            strict_mode: this.form.strict_mode
                        };
                        temp_params.strict_mode = this.form.strict_mode ? '1' : '0';
                        if (this.radio_epsilon_5 == '1') {
                            // 列表
                            // epsilon: '[' + this.form.epsilon + ']',
                            // temp_params.epsilon = '[' + this.form.epsilon_5 + ']';
                            var temp = [];
                            for (var x in this.form.domain_5) {
                                console.log('this.form.domain_5[x]["value"]:', this.form.domain_5[x]['value']);
                                temp.push(this.form.domain_5[x]['value']);
                            }
                            temp_params.epsilon = '[' + temp.toString() + ']';
                            console.log('temp:', temp);
                            console.log('temp_params.epsilon:', temp_params.epsilon);
                        } else if (this.radio_epsilon_5 == '2') {
                            // 列表
                            temp_params.epsilon_upper_limit = this.form.range_epsilon_5[1] + '';
                            temp_params.epsilon_lower_limit = this.form.range_epsilon_5[0] + '';
                            temp_params.generate_per_file = this.form.generate_per_file + '';
                        }
                    } else if (this.form.augmentation_method[1] == 6) {
                        temp_params = {
                            gamma: this.form.gamma / 100,
                            positive: this.form.positive,
                            strict_mode: this.form.strict_mode
                        };
                        temp_params.strict_mode = this.form.strict_mode ? '1' : '0';
                        if (this.radio_epsilon_6 == '1') {
                            // 列表
                            // epsilon: '[' + this.form.epsilon + ']',
                            // temp_params.epsilon = '[' + this.form.epsilon_6 + ']';
                            var temp = [];
                            for (var x in this.form.domain_6) {
                                console.log('this.form.domain_6[x]["value"]:', this.form.domain_6[x]['value']);
                                temp.push(this.form.domain_6[x]['value']);
                            }
                            temp_params.epsilon = '[' + temp.toString() + ']';
                            console.log('temp:', temp);
                            console.log('temp_params.epsilon:', temp_params.epsilon);
                        } else if (this.radio_epsilon_6 == '2') {
                            // 列表
                            temp_params.epsilon_upper_limit = this.form.range_epsilon_6[1] + '';
                            temp_params.epsilon_lower_limit = this.form.range_epsilon_6[0] + '';
                            temp_params.generate_per_file = this.form.generate_per_file + '';
                        }
                        if (this.directional_id[1] != 10) {
                            temp_params.target = this.directional_id[1];
                        }
                    } else if (this.form.augmentation_method[1] == 7) {
                        temp_params = {
                            num_iters: this.form.num_iters + '',
                            strict_mode: this.form.strict_mode
                        };
                        temp_params.strict_mode = this.form.strict_mode ? '1' : '0';
                        if (this.radio_epsilon_7 == '1') {
                            // 列表
                            // temp_params.epsilon = '[' + this.form.epsilon_7 + ']';
                            var temp = [];
                            for (var x in this.form.domain_7) {
                                console.log('this.form.domain_7[x]["value"]:', this.form.domain_7[x]['value']);
                                temp.push(this.form.domain_7[x]['value']);
                            }
                            temp_params.epsilon = '[' + temp.toString() + ']';
                            console.log('temp:', temp);
                            console.log('temp_params.epsilon:', temp_params.epsilon);
                        } else if (this.radio_epsilon_7 == '2') {
                            // 列表
                            temp_params.epsilon_upper_limit = this.form.range_epsilon_7[1] + '';
                            temp_params.epsilon_lower_limit = this.form.range_epsilon_7[0] + '';
                            temp_params.generate_per_file = this.form.generate_per_file + '';
                        }
                    }

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
                    console.log('data:', data);
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
            const selectedFile = this.$refs.image_a_file_ref.files[0];

            let fileName = selectedFile.name;
            let pos = fileName.lastIndexOf('.');
            let lastName = fileName.substring(pos, fileName.length);
            console.log(lastName, lastName.toLowerCase());
            console.log('lastName:', lastName);
            if (lastName.toLowerCase() !== '.jpg' && lastName.toLowerCase() !== '.jpeg' && lastName.toLowerCase() !== '.zip') {
                this.$message.error('文件必须为 .jpg/.jpeg/.zip 类型');
                // this.$refs.lidar_t_file_ref.clearFiles;
                this.$refs.image_a_file_ref.value = ''; // 清空file文件
                // return false;
            } else {
                this.form.file = selectedFile;
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
        // const { data: data } = await this.$http.get('/augmentation_method/?augmentation_type=' + id);
        // if (data.code === 45000) {
        //     return this.$message.error('该生成类型暂无方法！');
        // }
        // if (data.code !== 20000) {
        //     return this.$message.error('查询生成方法失败！');
        // }
        // this.methods = data.data.filter(item => {
        //     return item.augmentation_type_id === id;
        // });
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
