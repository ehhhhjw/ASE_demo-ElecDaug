<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-user"></i> 个人信息 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card class="bgi mgb20" shadow="hover" style="height:530px;">
            <div class="user-info">
                <img src="../../assets/img/4.png" class="user-avator" alt />
                <div class="user-info-cont">
                    <div class="user-info-name">{{ name }}</div>
                    <div>{{ role }}</div>
                </div>
                <el-tooltip effect="dark" content="编辑个人信息" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(name)"></el-button>
                </el-tooltip>
            </div>
            <div class="user-info-list">
                账户名：
                <span>{{ Info.username }}</span>
            </div>
            <div class="user-info-list">
                加入时间：
                <span>{{ Info.join_datetime | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                上一次登录时间：
                <span>{{ Info.last_login_datetime | dateFormat }}</span>
            </div>
        </el-card>
        <el-dialog title="编辑用户信息" :visible.sync="editDialogVisible" width="50%" @closed="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="110px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="new_password">
                    <el-input v-model="editForm.new_password"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="new_nickname">
                    <el-input v-model="editForm.new_nickname"></el-input>
                </el-form-item>
                <el-form-item label="用户权限" prop="new_user_group" v-if="role === '超级管理员'">
                    <el-select v-model="editForm.new_user_group" placeholder="请选择用户权限">
                        <el-option label="普通用户" value="普通用户"></el-option>
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import qs from 'qs';
import fileDownload from 'js-file-download';
export default {
    data() {
        return {
            Info: [],
            name: '',
            role: '',
            editDialogVisible: false,
            editForm: {
                username: '',
                new_password: '',
                new_nickname: '',
                new_user_group: ''
            },
            editFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    {
                        min: 3,
                        max: 10,
                        message: '用户名的长度在3~10个字符之间',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        async getSelfInfo() {
            const { data: data } = await this.$http.get('/user/');
            if (data.code !== 20000) {
                return this.$message.error('获取个人信息失败！' + '错误原因：' + data.msg);
            }

            this.Info = data.data;
        },
        async showEditDialog(username) {
            this.editForm.username = username;
            this.editDialogVisible = true;
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;

                var adddata = new FormData();
                adddata.append('username', this.editForm.username);
                if (this.editForm.new_password) {
                    adddata.append('new_password', this.editForm.new_password);
                }
                if (this.editForm.new_nickname) {
                    adddata.append('new_nickname', this.editForm.new_nickname);
                }
                if (this.editForm.new_user_group) {
                    var num = this.editForm.new_user_group === '超级管理员' ? 1 : 0;
                    adddata.append('new_user_group', num);
                }
                const { data: data } = await this.$http({
                    url: '/user/',
                    data: adddata,
                    method: 'put'
                });
                if (data.code !== 20000) {
                    return this.$message.error('修改用户失败！' + '错误原因：' + data.msg);
                }
                this.$message.success('修改用户成功！');
                this.editDialogVisible = false;
                this.getUserList();
            });
        }
    },
    mounted() {
        this.getSelfInfo();
    },
    created() {
        this.name = this.$store.state.nickname;
        this.role = this.$store.state.user_group_name;
    }
};
</script>
<style scoped>
.bgi {
    background-image: url('../../assets/img/Self_Info_BG3.jpg');
    background-size: cover;
    background-position: bottom left;
}
.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}
.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}
.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #000;
}
.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}
.user-info-list {
    padding-left: 10px;
    background-color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    color: #000;
    line-height: 25px;
}
</style>
