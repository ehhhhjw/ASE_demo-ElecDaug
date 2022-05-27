<template>
    <div>
        <!-- 平台信息 -->
        <el-card shadow="hover" class="mgb20" style="height: 290px">
            <div style="margin: 0 auto; width: 100%; box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px">
                <el-table :data="tableData" style="width: 100%; margin: 0 auto; font-size: 13px" :show-header="false" stripe>
                    <el-table-column prop="key" width="60" style="font-weight: 700"> </el-table-column>
                    <el-table-column prop="value" width="210"> </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: []
        };
    },
    methods: {},
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
        // this.getOnlineUser();
        // this.getRunningTask();
        this.timer = setInterval(() => {
            // this.getOnlineUser();
            // this.getRunningTask();
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
.mgb20 {
    margin-bottom: 20px;
}
</style>
