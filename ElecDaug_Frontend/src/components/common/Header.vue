<template>
    <div class="header">
        <slot></slot>
        <!-- 侧边栏折叠按钮 -->
        <div class="header-left">
            <!-- <div class="collapse-btn">
                <i v-if="!collapse" class="el-icon-s-fold"></i>
                <i v-else class="el-icon-s-unfold"></i>
            </div> -->
            <div class="nothing"></div>
            <img src="../../assets/radar_hjw.png" alt="" class="lidarPic" />
            <div class="logo">ElecDaug</div>
        </div>
        <!-- 顶侧右部全屏-消息-用户信息区域 -->
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <!-- <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div> -->
                <!-- 消息中心 -->
                <!-- <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message ? `有${message}条未读消息` : `消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div> -->
                <!-- 用户头像 -->
                <div class="user-avator">
                    <!-- <img src="../../assets/img/4.png" /> -->
                </div>
                <!-- 用户名下拉菜单 -->
                <!-- <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ nickname }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <a href="#/SelfInfo">
                            <el-dropdown-item><i class="el-icon-user"></i>Your Information</el-dropdown-item>
                        </a>
                        <el-dropdown-item divided command="logout"><i class="el-icon-close"></i>Logout</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
            </div>
        </div>
    </div>
</template>
<script>
// 引入EventBus机制（总线），功能类似于Vuex
import bus from '../common/bus';
import { mapState, mapMutations } from 'vuex';
export default {
    data() {
        return {
            // 折叠导航栏
            collapse: false,
            // 是否全屏
            fullscreen: false,
            // 默认用户名
            // nickname: '',
            // 未读消息数量
            message: 2
        };
    },
    // 计算属性
    computed: {
        ...mapState(['nickname'])
    },
    methods: {
        // 用户名下拉菜单选择事件[含登出]
        async handleCommand(command) {
            // 如果是登出命令则跳转至登录页
            if (command == 'logout') {
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
        },
        // 侧边栏折叠
        collapseChage() {
            // 侧边栏状态取反即可
            this.collapse = !this.collapse;
            // 向组件传值，更新侧边栏状态
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    // exitFullscreen() 退出全屏模式。
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    // requestFullscreen() 请求进入全屏模式
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            // 全屏状态取反
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        // document.body.clientWidth表示HTML文档所在窗口的当前宽度。
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    },
    created() {
        // this.nickname = this.$store.state.nickname;
        // this.nickname = sessionStorage.getItem('nickname');
        // console.log('this.nickname:');
        // console.log(this.nickname);
    }
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    /* border-box对元素指定宽度width和高度height包括了 padding 和 border */
    width: 100%;
    height: 70px;
    font-size: 22px;
    /* 此处控制的为icon和字体的颜色，而非header的bgc */
    color: #fff;
    background-color: rgb(230, 162, 60);
}

.nothing {
    float: left;
    padding: 0 21px;
    line-height: 70px;
}

/* 侧边栏折叠按钮样式 */
.collapse-btn {
    float: left;
    padding: 0 21px;
    /* 悬浮时的鼠标图标为手指 */
    /* cursor: pointer; */
    line-height: 70px;
}

.lidarPic {
    width: 50px;
    height: 50px;
    text-align: center;
    margin-top: 8px;
}

.header .logo {
    font-size: 40px;
    float: left;
    width: 220px;
    line-height: 70px;
}

.header-left {
    display: flex;
    justify-content: flex-start;
    text-align: center;
}

.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
