<template>
    <div>
        <!-- 快捷方式 -->
        <el-card shadow="hover" style="height: 360px">
            <div slot="header" class="clearfix" style="font-size: 700">
                <span>快捷方式</span>
            </div>
            <el-row :gutter="20" style="margin-left: 10px; margin-right: 10px">
                <el-col :span="6"
                    ><div>
                        <a href="#/Lidar_A_Augmentation_Add" style="margin-left: 0 !important">
                            <div class="table-icon">
                                <i class="el-icon-help"></i>
                                <p style="font-size: 14px; margin-top: 16px">添加-激光-对抗</p>
                            </div>
                        </a>
                    </div></el-col
                >
                <el-col :span="6"
                    ><div>
                        <a href="#/Lidar_T_Augmentation_Add">
                            <div class="table-icon">
                                <i class="el-icon-s-help"></i>
                                <p style="font-size: 14px; margin-top: 16px">添加-激光-蜕变</p>
                            </div>
                        </a>
                    </div></el-col
                >
                <el-col :span="6"
                    ><div>
                        <a href="#/Image_A_Augmentation_Add">
                            <div class="table-icon">
                                <i class="el-icon-picture-outline"></i>
                                <p style="font-size: 14px; margin-top: 16px">添加-SAR-对抗</p>
                            </div>
                        </a>
                    </div></el-col
                >
                <el-col :span="6"
                    ><a href="#/Image_T_Augmentation_Add">
                        <div class="table-icon">
                            <i class="el-icon-picture"></i>
                            <p style="font-size: 14px; margin-top: 16px">添加-SAR-蜕变</p>
                        </div>
                    </a></el-col
                >
            </el-row>
            <el-row :gutter="20" style="margin-left: 10px; margin-right: 10px">
                <el-col :span="6"
                    ><div>
                        <a href="#/Log">
                            <div class="table-icon">
                                <i class="el-icon-document"></i>
                                <p style="font-size: 14px; margin-top: 16px">日志管理</p>
                            </div>
                        </a>
                    </div></el-col
                >
                <el-col :span="6"
                    ><div>
                        <a href="#/augmentation_manage">
                            <div class="table-icon">
                                <i class="el-icon-set-up"></i>
                                <p style="font-size: 14px; margin-top: 16px">生成管理</p>
                            </div>
                        </a>
                    </div></el-col
                >
                <el-col :span="6"
                    ><div>
                        <a :href="$store.state.user_group_name == '超级管理员' ? '#/user_manage' : '#/SelfInfo'">
                            <div class="table-icon">
                                <i class="el-icon-user"></i>
                                <p style="font-size: 14px; margin-top: 16px">用户管理</p>
                            </div>
                        </a>
                    </div></el-col
                >
                <el-col :span="6"
                    ><div @click="logout">
                        <a>
                            <div class="table-icon">
                                <img src="../../assets/logout.png" class="lidarPic" alt="" />
                                <!-- <i class="el-icon-setting"></i> -->
                                <p style="font-size: 14px; margin-top: 16px">用户登出</p>
                            </div>
                        </a>
                    </div></el-col
                >
            </el-row>
        </el-card>
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
    data() {
        return {};
    },
    methods: {
        // 用户名下拉菜单选择事件[含登出]
        async logout() {
            console.log('this.$store.state.username' + this.$store.state.username);
            // console.log('this.$store.state.nickname:', this.$store.state.nickname);
            console.log('this.$store.state.token登出:', this.$store.state.token);
            const { data: data } = await this.$http.delete('/user/logout/?username=' + this.$store.state.username);
            if (data.code !== 20000) {
                console.log(data.code);
                console.log(data.msg);
                return this.$message.error('用户登出失败！' + '错误原因：' + data.msg);
            }
            this.$message.success('用户登出成功！');

            // 在本地数据仓库中删除当前用户
            // sessionStorage.clear();
            console.log('sessionStorage已清除');
            // sessionStorage.removeItem('token');
            sessionStorage.clear();
            console.log(sessionStorage.getItem('token'));
            // this.isRouterAlive = false;
            // this.$nextTick(function() {
            //     this.isRouterAlive = true;
            // });
            this.$store.commit('setToken', null);
            this.$store.commit('setNickName', null);
            this.$store.commit('setUserId', null);
            console.log('$store.token已清除');
            // 确认清除
            console.log(this.$store.state.token);
            console.log(this.$store.state.nickname);
            console.log(this.$store.state.username);
            console.log(this.$store.state.userId);
            // 路由跳转
            this.$router.push('/login');
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
.lidarPic {
    width: 32px;
    height: 32px;
    text-align: center;
    margin-left: 8px;
}
</style>
