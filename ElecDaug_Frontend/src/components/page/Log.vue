<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-reading"></i> 平台日志管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="24小时内日志数据" name="first">
                    <el-table :data="logShow_new_one" style="width: 99%" stripe>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column type="expand" style="background:rgba(150, 154, 184,0.05);">
                            <template slot-scope="scope">
                                <el-table :data="scope.row.children" style="width: 62%">
                                    <el-table-column prop="label4" label="生成方法名" width="180"> </el-table-column>
                                    <el-table-column prop="finish_task_number" label="已完成任务数量" width="180"> </el-table-column>
                                    <el-table-column prop="ran_task_number" label="运行中任务数量" width="180"> </el-table-column>
                                    <el-table-column prop="generate_data_number" label="生成数据数量" width="180"> </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column prop="label1" label="日志记录时间" align="left"> </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="近15天系统日志数据" name="second">
                    <el-table :data="logShow_new_two" style="width: 99%" stripe>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column type="expand" style="background:rgba(150, 154, 184,0.05);">
                            <template slot-scope="scope">
                                <el-table :data="scope.row.children" style="width: 62%">
                                    <el-table-column prop="label4" label="生成方法名" width="180"> </el-table-column>
                                    <el-table-column prop="finish_task_number" label="已完成任务数量" width="180"> </el-table-column>
                                    <el-table-column prop="ran_task_number" label="运行中任务数量" width="180"> </el-table-column>
                                    <el-table-column prop="generate_data_number" label="生成数据数量" width="180"> </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column prop="label1" label="日志记录时间" align="left"> </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="近6个月系统日志数据" name="third">
                    <el-table :data="logShow_new_three" style="width: 99%" stripe>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column type="expand" style="background:rgba(150, 154, 184,0.05);">
                            <template slot-scope="scope">
                                <el-table :data="scope.row.children" style="width: 62%">
                                    <el-table-column prop="label4" label="生成方法名" width="180"> </el-table-column>
                                    <el-table-column prop="finish_task_number" label="已完成任务数量" width="180"> </el-table-column>
                                    <el-table-column prop="ran_task_number" label="运行中任务数量" width="180"> </el-table-column>
                                    <el-table-column prop="generate_data_number" label="生成数据数量" width="180"> </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column prop="label1" label="日志记录时间" align="left"> </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script>
import qs from 'qs';
import fileDownload from 'js-file-download';
export default {
    name: 'baseform',
    data() {
        return {
            activeName: 'first',
            logData: {},
            logShow_old: [],
            logShow_new_one: [],
            logShow_new_two: [],
            logShow_new_three: [],
            logDownload: ''
        };
    },
    methods: {
        async getOne() {
            const { data: data } = await this.$http.get('log/recent_twenty_four_hours/');
            if (data.code !== 20000) {
                return this.$message.error('获取24小时内日志数据失败！' + '错误原因：' + data.msg);
            }
            this.logData = data.data;
            this.showData(1);
        },
        async getTwo() {
            const { data: data } = await this.$http.get('log/recent_fifteen_days/');
            if (data.code !== 20000) {
                return this.$message.error('获取近15日系统日志数据失败！' + '错误原因：' + data.msg);
            }
            this.logData = data.data;

            this.showData(2);
        },
        async getThree() {
            const { data: data } = await this.$http.get('log/recent_six_months/');
            if (data.code !== 20000) {
                return this.$message.error('获取近6个月系统日志数据失败！' + '错误原因：' + data.msg);
            }
            this.logData = data.data;
            this.showData(3);
        },
        handleClick(tab, event) {},
        fileDownload() {
            fileDownload(this.logDownload, 'logData.json');
        },
        showData(num) {
            var logShow = [];
            for (var date in this.logData) {
                var units2_new = [];
                for (var method in this.logData[date]) {
                    var unit4 = {};
                    unit4 = JSON.parse(JSON.stringify(this.logData[date][method]));
                    unit4.label4 = method;
                    units2_new.push(unit4);
                }
                var unit1_new = {};
                unit1_new.label1 = date;
                unit1_new.children = units2_new;
                logShow.push(unit1_new);
            }

            if (num === 1) {
                this.logShow_new_one = logShow;
            } else if (num === 2) {
                this.logShow_new_two = logShow;
            } else {
                this.logShow_new_three = logShow;
            }
        }
    },
    mounted() {
        this.getOne();
        this.getTwo();
        this.getThree();
    }
};
</script>
<style scoped>
.el-table,
.el-table__expanded-cell {
    background-color: #409eff;
}
.el-table th,
.el-table tr {
    background-color: #409eff;
}
</style>
