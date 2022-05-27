<template>
    <div>
        <!-- <div>{{ wocao }}</div> -->
        <el-table :data="taskList" border stripe>
            <!-- <el-table-column type="index" width="35px"></el-table-column> -->
            <el-table-column label="id" prop="id" width="42px"></el-table-column>
            <el-table-column label="Task Name" prop="name" width="172px"></el-table-column>
            <el-table-column label="Urgency level" prop="urgency_level" width="100px">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.urgency_level }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Task Status" prop="task_status" width="90px"></el-table-column>
            <el-table-column label="Whether to upload the original file" prop="task_have_origin_file" width="220px">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.task_have_origin_file === true" class="right10">
                        &nbsp;&nbsp;Yes&nbsp;&nbsp;
                    </el-tag>
                    <el-tag v-else-if="scope.row.task_have_origin_file === false" type="danger">&nbsp;&nbsp;No&nbsp;&nbsp;</el-tag>
                    <el-tooltip
                        content="Original file download"
                        placement="top"
                        :enterable="false"
                        v-if="scope.row.task_have_origin_file === true"
                    >
                        <el-button
                            type="success"
                            icon="el-icon-download"
                            size="mini"
                            @click="originalfileDownload(scope.row.id, 0)"
                            plain
                        ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="Whether to generate augmentation file" prop="task_have_generate_file" width="240px">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.task_have_generate_file === true" class="right10">
                        &nbsp;&nbsp;Yes&nbsp;&nbsp;
                    </el-tag>
                    <el-tag v-else-if="scope.row.task_have_generate_file === false" type="danger">&nbsp;&nbsp;No&nbsp;&nbsp;</el-tag>
                    <el-tooltip
                        content="Augmentation file download"
                        placement="top"
                        :enterable="false"
                        v-if="scope.row.task_have_generate_file === true"
                    >
                        <el-button
                            type="success"
                            icon="el-icon-download"
                            size="mini"
                            @click="generatefileDownload(scope.row.id, 0)"
                            plain
                        ></el-button>
                    </el-tooltip>

                    <el-tooltip
                        content="Point cloud comparison preview"
                        effect="dark"
                        placement="top"
                        :enterable="false"
                        v-if="scope.row.task_have_generate_file === true && show_point_preview == 1"
                    >
                        <el-button
                            type="warning"
                            icon="el-icon-data-analysis"
                            size="mini"
                            @click="point_cloud_preview(scope.row.id, 0)"
                            plain
                        ></el-button>
                    </el-tooltip>

                    <el-tooltip
                        content="Point cloud comparison preview"
                        effect="dark"
                        placement="top"
                        :enterable="false"
                        v-if="scope.row.task_have_generate_file === true && show_image_preview == 1"
                    >
                        <el-button
                            type="warning"
                            icon="el-icon-data-analysis"
                            size="mini"
                            @click="point_cloud_preview(scope.row.id, 0)"
                            plain
                        ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="Generated Data" prop="generate_data_number" width="120px">
                <template slot-scope="scope">
                    {{ isBlank_num(scope) }}
                </template>
            </el-table-column>
            <el-table-column label="Update time" prop="update_datetime" width="90px">
                <template slot-scope="scope">
                    {{ scope.row.update_datetime.split('T')[0] }}
                    <br />
                    {{
                        scope.row.update_datetime
                            .split('T')[1]
                            .split('+')[0]
                            .split('.')[0]
                    }}
                </template>
            </el-table-column>
            <el-table-column label="Start time" prop="start_datetime" width="90px">
                <template slot-scope="scope">
                    {{ isBlank_start(scope).split('T')[0] }}
                    <br />
                    {{ isBlank_start(scope).split('T')[1] }}
                </template>
            </el-table-column>
            <el-table-column label="Completion time" prop="fin_datetime" width="120px">
                <template slot-scope="scope">
                    {{ isBlank_end(scope).split('T')[0] }}
                    <br />
                    {{ isBlank_end(scope).split('T')[1] }}
                </template>
            </el-table-column>
            <el-table-column v-if="this.is_root === '1'" label="Task Creator" prop="master_username" width="110"></el-table-column>
            <el-table-column fixed="right" label="Operation" width="180">
                <template slot-scope="scope">
                    <el-tooltip
                        v-if="scope.row.task_status === 'Wait to start'"
                        effect="dark"
                        content="Edit"
                        placement="top"
                        :enterable="false"
                    >
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="Delete" placement="top" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeTaskById(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="Details" placement="top" :enterable="false">
                        <el-button type="info" icon="el-icon-more-outline" size="mini" @click="MethodDetail(scope.row.id)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import 'echarts-gl';
import qs from 'qs';
import fileDownload from 'js-file-download';
import JSZip from 'jszip';
import { number } from 'echarts';
export default {
    // props: ['taskList'],
    props: {
        taskList: {
            type: Array,
            require: true
        },
        is_root: {
            type: String,
            require: true
        },
        show_point_preview: {
            type: Number,
            require: false
        },
        show_image_preview: {
            type: Number,
            require: false
        }
    },
    methods: {
        //     async generate_change(type) {
        //         if (type == '本用户') {
        //             let search_params = '/task/augmentation_method/search/?augmentation_method=' + this.generate_func_self;
        //             const { data: data } = await this.$http.get(search_params);
        //             if (data.code !== 20000) {
        //                 return this.$message.error('未搜索到该任务！');
        //             }
        //             this.taskList_Self = data.data.details;
        //             this.totalPageNum = data.data.pages;
        //         } else {
        //             let search_params = '/task/augmentation_method/admin/search/?augmentation_method=' + this.generate_func_all;
        //             const { data: data } = await this.$http.get(search_params);
        //             if (data.code !== 20000) {
        //                 return this.$message.error('未搜索到该任务！');
        //             }
        //             this.taskList_All = data.data.details;
        //             this.totalPageNum = data.data.pages;
        //         }
        //     },
        //     changeAxios_xz() {
        //         for (var i in this.originalPointCloudData) {
        //             [this.originalPointCloudData[i][0], this.originalPointCloudData[i][2]] = [
        //                 this.originalPointCloudData[i][2],
        //                 this.originalPointCloudData[i][0]
        //             ];
        //         }
        //         for (var i in this.generatePointCloudData) {
        //             [this.generatePointCloudData[i][0], this.generatePointCloudData[i][2]] = [
        //                 this.generatePointCloudData[i][2],
        //                 this.generatePointCloudData[i][0]
        //             ];
        //         }
        //         this.get_preview();
        //     },
        //     changeAxios_yz() {
        //         for (var i in this.originalPointCloudData) {
        //             [this.originalPointCloudData[i][1], this.originalPointCloudData[i][2]] = [
        //                 this.originalPointCloudData[i][2],
        //                 this.originalPointCloudData[i][1]
        //             ];
        //         }
        //         for (var i in this.generatePointCloudData) {
        //             [this.generatePointCloudData[i][1], this.generatePointCloudData[i][2]] = [
        //                 this.generatePointCloudData[i][2],
        //                 this.generatePointCloudData[i][1]
        //             ];
        //         }
        //         this.get_preview();
        //     },
        //     changeAxios_xy() {
        //         for (var i in this.originalPointCloudData) {
        //             [this.originalPointCloudData[i][0], this.originalPointCloudData[i][1]] = [
        //                 this.originalPointCloudData[i][1],
        //                 this.originalPointCloudData[i][0]
        //             ];
        //         }
        //         for (var i in this.generatePointCloudData) {
        //             [this.generatePointCloudData[i][0], this.generatePointCloudData[i][1]] = [
        //                 this.generatePointCloudData[i][1],
        //                 this.generatePointCloudData[i][0]
        //             ];
        //         }
        //         this.get_preview();
        //     },
        //     async taskException() {
        //         this.$confirm('是否确定将该任务标记成异常状态？')
        //             .then(async _ => {
        //                 var adddata = new FormData();
        //                 adddata.append('task_id', this.methodDetail.id);
        //                 const { data: data } = await this.$http({
        //                     url: '/task/exception/',
        //                     data: adddata,
        //                     method: 'post'
        //                 });
        //                 if (data.code !== 20000) {
        //                     return this.$message.error('添加生成任务失败！' + '错误原因：' + data.msg);
        //                 }
        //                 this.$message.success('标记成异常成功！');
        //             })
        //             .catch(_ => {});
        //     },
        async getTaskList_Self() {
            this.$emit('getList', 0);
        },
        async getTaskList_All() {
            this.$emit('getList', 1);
        },

        removeTaskById(task_id) {
            console.log('task_id:', task_id);
            this.$emit('delete', task_id);
        },
        showEditDialog(row) {
            console.log('row:', row);
            this.$emit('showEditDialog', row);
        },
        editDialogClosed() {
            this.$emit('editDialogClosed');
        },
        originalfileDownload(task_id, flag) {
            var data = {
                task_id: task_id,
                flag: flag
            };
            this.$emit('originalfileDownload', data);
        },
        generatefileDownload(task_id, flag) {
            var data = {
                task_id: task_id,
                flag: flag
            };
            this.$emit('generatefileDownload', data);
        },

        point_cloud_preview(task_id) {
            this.$emit('point_cloud_preview', task_id);
        },
        image_preview(task_id) {
            this.$emit('image_preview', task_id);
        },
        isBlank_num(scope) {
            let key = scope.column.property,
                item = scope.row[key],
                value = '-- --';
            if (item === 0 || item === false || item) {
                value = item;
            }
            return value;
        },
        isBlank_start(scope) {
            let key = scope.column.property,
                item = scope.row[key],
                value = 'Wait to start';
            if (item === 0 || item === false || item) {
                value = item;
            }
            if (typeof value == 'string') value = value.split('+')[0].split('.')[0];
            return value;
        },
        isBlank_end(scope) {
            let key = scope.column.property,
                item = scope.row[key],
                value = 'Processing';
            if (item === 0 || item === false || item) {
                value = item;
            }
            if (typeof value == 'string') value = value.split('+')[0].split('.')[0];
            return value;
        },
        MethodDetail(id) {
            this.$emit('MethodDetail', id);
        },
        methodDialogClose() {
            this.$emit('methodDialogClose');
        }
    },
    mounted() {
        console.log('taskList:', this.taskList);
    }
};
</script>
<style scoped>
.juzhog {
    width: 600px;
    height: 530px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -265px;
    background-color: #fff;
}
.search {
    margin-bottom: 10px !important;
}
.right {
    margin-right: 5px !important;
}
.right10 {
    margin-right: 10px !important;
}
.user-info-list {
    padding-left: 10px;
    background-color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    color: #000;
    line-height: 25px;
}
.el-input__inner {
    width: 600px !important;
}
.view1 {
    width: 600px;
    height: 530px;
    margin: 0 10px 0 0;
    background-color: #fff;
    float: left;
}
.el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
}
/* .inlineBlock {
    display: inline-block;
} */
</style>
