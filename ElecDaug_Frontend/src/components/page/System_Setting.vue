<template>
    <div>
        <el-card>
            <el-button v-if="this.userRight === '超级管理员'" @click="resetService" type="danger" style="margin-bottom: 10px"
                >重置所有微服务</el-button
            >
            <el-button type="primary" @click="update" style="margin-bottom: 10px">刷新</el-button>
            <el-table :data="micro_service_List" style="width: 99%" stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column type="expand" style="background: rgba(150, 154, 184, 0.05)">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.info" style="width: 360px">
                            <el-table-column prop="IP_and_port" label="IP与端口" width="180"></el-table-column>
                            <el-table-column prop="state" label="状态" width="180"> </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="micro_service_name" label="微服务名称" align="left"> </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            micro_service_List: [],
            userRight: ''
        };
    },
    created() {
        this.userRight = window.sessionStorage.getItem('user_group_name');
    },
    methods: {
        async resetService() {
            this.$confirm('!警告：该操作不可逆，是否重置所有微服务？')
                .then(async _ => {
                    const { data: data } = await this.$http({
                        url: '/micro_service/',
                        method: 'post'
                    });
                    if (data.code !== 20000) {
                        return this.$message.error('重置微服务失败！' + '错误原因：' + data.msg);
                    }
                    this.$message.success('重置微服务成功！');
                })
                .catch(_ => {});
        },
        async update() {
            this.micro_service_List = [];
            this.$store.commit('setUserId', sessionStorage.getItem('userId'));
            const { data: data } = await this.$http.get('/micro_service/');

            if (data.code !== 20000) {
                return this.$message.error('获取微服务信息失败！' + '错误原因：' + data.msg);
            }
            for (var i in data.data) {
                var temp = {},
                    info = [];
                temp['micro_service_name'] = i;
                for (var j in data.data[i]) {
                    let temp_info = {};
                    temp_info['IP_and_port'] = j;
                    if (data.data[i][j]) {
                        temp_info['state'] = '空闲';
                    } else {
                        temp_info['state'] = '忙碌';
                    }
                    info.push(temp_info);
                }
                temp['info'] = info;
                this.micro_service_List.push(temp);
            }
        }
    },
    async mounted() {
        this.update();
    }
};
</script>
<style scoped></style>
