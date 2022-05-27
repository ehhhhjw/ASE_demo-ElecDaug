<template>
    <div>
        <!-- 系统报告 -->
        <el-card shadow="hover" style="height: 290px" body-style="el-card__body1 el-card__body2">
            <div class="el-card__header1">
                <span>System Resource</span>
            </div>
            <div v-if="systemStatusData.GPUStatus < 0">
                <hr style="clear: both; background-color: #fff; border: none; height: 10px" />
                <div style="margin-top: 10px">
                    <h4 style="">CPU使用率</h4>
                    <el-progress :percentage="systemStatusData.CPUStatus"></el-progress>
                </div>
                <div style="margin-top: 20px">
                    <h4 style="">内存占用率</h4>
                    <el-progress :percentage="systemStatusData.memoryStatus"></el-progress>
                </div>
            </div>
            <div v-else>
                <!-- <hr style="background-color: #fff; border: none; height: 10px" /> -->
                <div style="float: left; padding-left:30px; margin-right: 30px;">
                    <h4 style="font-weight: normal; margin-top: 20px">CPU</h4>
                    <hr style="background-color: #fff; border: none; height: 5px" />
                    <!-- :text-inside="true" -->
                    <el-progress
                        type="dashboard"
                        :percentage="systemStatusData.CPUStatus"
                        color="#42b983"
                        :stroke-width="10"
                        width="160"
                    ></el-progress>
                </div>
                <!-- <hr style="clear: both; background-color: #fff; border: none; height: 15px" /> -->
                <div style="float: left; margin-right: 30px;">
                    <h4 style="font-weight: normal; margin-top: 20px">GPU</h4>
                    <hr style="background-color: #fff; border: none; height: 5px" />
                    <el-progress
                        :percentage="systemStatusData.GPUStatus"
                        color="#f1e05a"
                        :stroke-width="10"
                        type="dashboard"
                        width="160"
                    ></el-progress>
                </div>
                <!-- <hr style="clear: both; background-color: #fff; border: none; height: 15px" /> -->
                <div style="float: left">
                    <h4 style="font-weight: normal; margin-top: 20px">Memery</h4>
                    <hr style="background-color: #fff; border: none; height: 5px" />
                    <el-progress :percentage="systemStatusData.memoryStatus" :stroke-width="10" type="dashboard" width="160"></el-progress>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            systemStatusData: {
                CPUStatus: -1,
                GPUStatus: 1,
                memoryStatus: -1
            }
        };
    },
    methods: {
        async getPerformance() {
            const { data: data } = await this.$http.get('/system_status/performance/');
            if (data.code !== 20000) {
                return this.$message.error('获取当前系统性能失败！' + '错误原因：' + data.msg);
            }
            // console.log('系统性能：', data.data);
            this.systemStatusData.CPUStatus = parseInt(data.data.cpu);
            this.systemStatusData.memoryStatus = parseInt(data.data.memory);
            if (data.data.gpu) {
                this.systemStatusData.GPUStatus = parseInt(data.data.gpu);
            }
        }
    },
    mounted() {
        this.getPerformance();
        this.timer = setInterval(() => {
            this.getPerformance();
        }, 1000 * 60);
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
</style>
