<template>
    <div class="login-wrap">
        <div class="box">
            <!-- <div class="ms-title" style="line-height:30px">基于对抗生成技术的激光雷达<br>点云测试数据扩增系统</div> -->
            <div class="ms-title">智能系统软件测试数据生成平台</div>
            <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="loginForm.password" @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-s-goods"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button
                        type="primary"
                        @click="submitForm()"
                        :loading="loading"
                        element-loading-spinner="el-icon-loading"
                        element-loading-text="登录中"
                        >登录</el-button
                    >
                </div>
                <p class="login-tips">Tips : 本系统暂未开放注册功能。</p>
            </el-form>
        </div>
    </div>
</template>
<script>
import qs from 'qs';
import { setInterval, clearInterval } from 'timers';
export default {
    inject: ['reload'],
    data: function() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginFormRules: {
                username: [{ required: true, message: '账号不可为空', trigger: 'blur' }],
                password: [{ required: true, message: '密码不可为空', trigger: 'blur' }]
            },
            loading: false,
            flag: true,
            lastTime: new Date().getTime(),
            currentTime: new Date().getTime(),
            timeOut: 10 * 1000,
            last_time_upgrade: true
        };
    },
    mounted() {
        this.timer = setInterval(
            function() {
                var that = this;
                this.currentTime = new Date().getTime();
                if (this.last_time_upgrade == true) {
                    this.lastTime = new Date().getTime();
                }

                if (this.currentTime - this.lastTime > this.timeOut) {
                    this.last_time_upgrade = true;
                    this.loading = false;
                    this.flag === true;
                    this.reload();
                    return this.$message.error('登录超时,请检查网络并刷新');
                }
            }.bind(this),
            5000
        );
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        cancelRequest() {
            if (typeof this.source === 'function') {
                this.source('终止请求');
            }
        },
        submitForm() {
            var that = this;
            var CancelToken = this.$http.CancelToken;
            var source = CancelToken.source();
            this.loading = true;

            this.$refs.loginFormRef.validate(async valid => {
                if (valid) {
                    if (this.flag === true) {
                        this.flag = false;
                        this.last_time_upgrade = false;

                        this.cancelRequest();
                        console.log('$axios.defaults.baseURL:', this.$http.defaults.baseURL);
                        const { data: data } = await this.$http.post('/user/login/', qs.stringify(this.loginForm), {
                            cancelToken: new this.$http.CancelToken(function executor(c) {
                                that.source = c;
                            })
                        });

                        if (data.code !== 20000) {
                            this.loginForm.password = '';
                            this.loading = false;
                            this.last_time_upgrade = true;
                            this.loading = false;
                            this.reload();
                            return this.$message.error('登录失败,请检查用户名或密码是否正确');
                        } else {
                            this.$store.commit('setToken', null);

                            window.sessionStorage.setItem('username', this.loginForm.username);
                            window.sessionStorage.setItem('password', this.loginForm.password);
                            this.$store.commit('setUserId', data.data.profile.id);
                            this.$store.commit('setUserId', data.data.profile.id);

                            this.$store.commit('setToken', data.data.token);
                            // console.log('data.data.token:', data.data.token);
                            this.$store.commit('setUsername', this.loginForm.username);

                            this.$store.commit('setUser_group_name', data.data.profile.user_group_name);
                            this.getUserRight();
                            this.$message.success('登录成功');

                            this.$router.push('/dashboard');
                            this.loading = false;
                            this.flag = true;
                        }
                    }
                }
            });
        },
        async getUserRight() {
            const { data: data } = await this.$http.get('/user/');

            this.$store.commit('setNickName', data.data.nickname);
        }
    }
};
</script>
<style scoped>
.login-wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    /* background: url(../../assets/img/bgd1.png) no-repeat; */

    background: url(../../assets/img/bgd4.jpg) no-repeat;
    background-size: cover;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 22px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(172, 105, 105, 0.6);
}
.ms-content {
    padding: 30px 0px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 10px;
    color: #fff;
}
body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    background-size: cover;
}
.box {
    position: absolute;
    top: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    padding: 40px 40px 20px 40px;
    background: rgba(0, 0, 0, 0.6);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
}
.box h2 {
    margin: 0 0 30px;
    padding: 0;
    color: #fff;
    text-align: center;
    font-size: 22px;
}
.box .inputBox {
    position: relative;
}
.box .inputBox input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    letter-spacing: 1px;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
    background: transparent;
}
.box .inputBox label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 0;
    letter-spacing: 1px;
    font-size: 16px;
    color: #fff;
    pointer-events: none;
    transition: 0.5s;
}
.box .inputBox input:focus ~ label,
.box .inputBox input:valid ~ label {
    top: -18px;
    left: 0;
    color: #03a9f4;
    font-size: 12px;
}
.box input[type='submit'] {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    background: #03a9f4;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
}
</style>
