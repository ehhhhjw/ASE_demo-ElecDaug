<template>
    <div>
        <!-- 方法信息 -->
        <el-card shadow="hover" style="height: 290px">
            <!-- <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-1">
                    <img src="../../assets/peoples.png" class="lidarPic" alt="" />
                    <div class="grid-cont-right">
                        <div class="grid-num" :title="OnlineUsersNum">{{ OnlineUsersNum }}</div>
                        <div>在线用户</div>
                    </div>
                </div>
            </el-card> -->
            <el-card shadow="hover" style="margin: 8px 0" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-1">
                    <img src="../../assets/FGSM.png" class="lidarPic" alt="" />
                    <div class="grid-cont-right">
                        <div class="grid-num">{{ Lidar_A }}</div>
                        <div>{{ 'FGSM' }}</div>
                    </div>
                </div>
            </el-card>
            <el-card shadow="hover" style="margin: 8px 0" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-2">
                    <img src="../../assets/lidar_t.png" class="lidarPic" alt="" />
                    <div class="grid-cont-right">
                        <div class="grid-num">{{ Lidar_T }}</div>
                        <div>{{ 'I-FGSM(BIM)' }}</div>
                    </div>
                </div>
            </el-card>
            <el-card shadow="hover" style="margin: 8px 0" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-3">
                    <img src="../../assets/BIM.png" class="lidarPic" alt="" />
                    <div class="grid-cont-right">
                        <div class="grid-num">{{ Image_A }}</div>
                        <div>{{ 'JSMA' }}</div>
                    </div>
                </div>
            </el-card>
            <!-- <el-card shadow="hover" style="margin: 8px 0" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-4">
                    <img src="../../assets/JSMA.png" class="lidarPic" alt="" />
                    <div class="grid-cont-right">
                        <div class="grid-num">{{ Image_T }}</div>
                        <div>{{ '合成孔径雷达蜕变' }}</div>
                    </div>
                </div>
            </el-card> -->
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            OnlineUsersNum: 0,
            RunningTask_final: [],
            Lidar_A: -1,
            Lidar_T: -1,
            Image_A: -1,
            Image_T: -1
        };
    },
    mounted() {
        // this.getOnlineUser();
        this.getRunningTask();
        this.timer = setInterval(() => {
            // this.getOnlineUser();
            this.getRunningTask();
        }, 1000 * 60);
    },
    methods: {
        async getRunningTask() {
            const { data: data } = await this.$http.get('/system_status/running_task/');
            // console.log('getRunningTask_data:', data);
            console.log('getRunningTaskdata:', data);
            if (data.code !== 20000) {
                return this.$message.error('获取正在运行各生成任务失败！' + '错误原因：' + data.msg);
            }
            this.RunningTask = data.data;
            this.Lidar_A = data.data['FGSM-激光雷达'] + data.data['I-FGSM(BIM)-激光雷达'] + data.data['JSMA-激光雷达'];
            this.Lidar_T =
                data.data['场景物体旋转蜕变-激光雷达'] + data.data['场景物体添加蜕变-激光雷达'] + data.data['极端场景蜕变-激光雷达'];
            this.Image_A =
                data.data['FGSM-合成孔径雷达'] +
                data.data['I-FGSM(BIM)-合成孔径雷达'] +
                data.data['JSMA-合成孔径雷达'] +
                data.data['SIMBA-合成孔径雷达'];
            this.Image_T = data.data['通用蜕变系列方法-合成孔径雷达'] + data.data['领域蜕变系列方法-合成孔径雷达'];
            // console.log('Lidar_A, Lidar_T, Image_A, Image_T:', this.Lidar_A, this.Lidar_T, this.Image_A, this.Image_T);
            // console.log('data.data["FGSM-激光雷达"]:', data.data['FGSM-激光雷达']);
            // console.log('data.data["I-FGSM(BIM)-激光雷达"]:', data.data['I-FGSM(BIM)-激光雷达']);
            // console.log('data.data["JSMA-激光雷达"]:', data.data['JSMA-激光雷达']);
            // this.RunningTask_name = Object.keys(this.RunningTask);
            // this.RunningTask_num = Object.values(this.RunningTask);
            // let rf = [];
            // for (var i = 0; i < this.RunningTask_name.length; i++) {
            //     var x = {};
            //     x.name = this.RunningTask_name[i];
            //     x.num = this.RunningTask_num[i];
            //     rf.push(x);
            // }
            // this.RunningTask_final = rf;
        },
        async getOnlineUser() {
            const { data: data } = await this.$http.get('/system_status/online_user/');
            if (data.code !== 20000) {
                return this.$message.error('获取在线人数失败！' + '错误原因：' + data.msg);
            }
            this.OnlineUsersNum = data.data.online_user;
        }
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
.grid-content {
    display: flex;
    align-items: center;
    height: 70px;
}
.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}
.grid-num {
    font-size: 30px;
    font-weight: bold;
}
.grid-con-icon {
    font-size: 50px;
    width: 70px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}
.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}
.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}
.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}
.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
}
.grid-con-3 .grid-con-icon {
    background: #e6a23c;
}
.grid-con-3 .grid-num {
    color: #e6a23c;
}
.grid-con-4 .grid-con-icon {
    background: #f56c6c;
}
.grid-con-4 .grid-num {
    color: #f56c6c;
}
.lidarPic {
    width: 50px;
    height: 50px;
    text-align: center;
    margin-left: 8px;
}
.table-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    background: #f4f4f5;
    width: 100%;
    height: 100px;
    border-radius: 4px;
}
.table-icon:hover {
    background: lightgrey;
}
a {
    color: rgb(83, 83, 83);
    text-decoration: none;
}
</style>
