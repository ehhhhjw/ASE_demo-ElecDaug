<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-s-tools"></i> Tool Management </el-breadcrumb-item>
                <el-breadcrumb-item>User Management</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card>
            <el-row :gutter="20" class="search">
                <el-col :span="13">
                    <el-form :inline="true" :model="formInline_Self" class="demo-form-inline">
                        <el-form-item label="Query Mode">
                            <el-select v-model="formInline_Self.searchType" placeholder="Please select query mode" prop="searchType">
                                <el-option label="User id" value="用户id"></el-option>
                                <el-option label="Username" value="用户名"></el-option>
                                <el-option label="Nickname" value="用户昵称"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Query Content">
                            <el-input
                                placeholder="Please enter the query content"
                                v-model="formInline_Self.searchTaskInfo"
                                clearable
                                @clear="getUserList"
                            >
                                <el-button
                                    slot="append"
                                    @click="
                                        pageReflash();
                                        SearchUser();
                                    "
                                    size="mini"
                                    ><i class="el-icon-search el-icon--right"></i
                                ></el-button>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">Add user</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="username" prop="username"></el-table-column>
                <el-table-column label="nickname" prop="nickname"></el-table-column>
                <el-table-column label="user group" prop="user_group_name"></el-table-column>
                <el-table-column label="join time" prop="join_datetime">
                    <template slot-scope="scope">
                        {{ scope.row.join_datetime | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="last login time" prop="last_login_datetime">
                    <template slot-scope="scope">
                        {{ isBlank_login(scope) | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="operation" width="200px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="Edit" placement="top" :enterable="false">
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showEditDialog(scope.row.username)"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="Delete" placement="top" :enterable="false">
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="removeUserById(scope.row.username)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.page"
                :page-size="10"
                layout="prev, pager, next"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <el-dialog title="Add user" :visible.sync="addDialogVisible" width="30%" @closed="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
                <el-form-item label="username" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="password" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="nickname" prop="nickname">
                    <el-input v-model="addForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="user group" prop="user_group">
                    <el-select v-model="addForm.user_group" placeholder="Please select user group">
                        <el-option label="Ordinary users" value="0"></el-option>
                        <el-option label="Super administrator" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">cancel</el-button>
                <el-button type="primary" @click="addUser">OK</el-button>
            </span>
        </el-dialog>
        <el-dialog title="Edit user information" :visible.sync="editDialogVisible" width="50%" @closed="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="110px">
                <el-form-item label="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="password" prop="new_password">
                    <el-input v-model="editForm.new_password"></el-input>
                </el-form-item>
                <el-form-item label="nickname" prop="new_nickname">
                    <el-input v-model="editForm.new_nickname"></el-input>
                </el-form-item>
                <el-form-item label="user group" prop="new_user_group">
                    <el-select v-model="editForm.new_user_group" placeholder="Please select user group">
                        <el-option label="Ordinary users" value="普通用户"></el-option>
                        <el-option label="Super administrator" value="超级管理员"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">cancel</el-button>
                <el-button type="primary" @click="editUserInfo">OK</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import qs from 'qs';
export default {
    data() {
        return {
            queryInfo: {
                page: 1
            },
            userList: [],
            total: 0,
            totalPageNum: 0,
            addDialogVisible: false,
            addForm: {
                username: '',
                password: '',
                nickname: '',
                user_group: ''
            },
            addFormRules: {
                username: [
                    { required: true, message: 'Please enter the user name', trigger: 'blur' },
                    {
                        min: 3,
                        max: 10,
                        message: 'The length of the user name is between 3 and 10 characters',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { required: true, message: 'Please input the password', trigger: 'blur' },
                    {
                        min: 6,
                        max: 15,
                        message: 'The length of the password is between 6 and 15 characters',
                        trigger: 'blur'
                    }
                ]
            },
            editDialogVisible: false,
            editForm: {
                username: '',
                new_password: '',
                new_nickname: '',
                new_user_group: ''
            },
            editFormRules: {
                username: [
                    { required: true, message: 'Please enter the username', trigger: 'blur' },
                    {
                        min: 3,
                        max: 10,
                        message: 'The length of the user name is between 3 and 10 characters',
                        trigger: 'blur'
                    }
                ]
            },
            searchUserName: '',
            visibleSubmit: '',
            userRight: '',
            colomnHiden: true,
            value: '100',
            formInline_Self: {
                searchType: '',
                searchTaskInfo: ''
            }
        };
    },
    created() {
        this.getUserList();
        this.userRight = this.$store.state.user_group_name;
        this.colomnHiden = this.userRight === '超级管理员' ? false : true;
    },
    methods: {
        pageReflash() {
            this.queryInfo.page = 1;
        },
        async SearchUser() {
            if (this.formInline_Self.searchType === '') {
                return this.$message.error({
                    showClose: true,
                    message: 'Please select query mode',
                    offset: 70
                });
            }
            if (this.formInline_Self.searchTaskInfo === '') {
                return this.$message.error({
                    showClose: true,
                    message: 'Please enter the query content',
                    offset: 70
                });
            }
            var search_params = '';
            if (this.formInline_Self.searchType === '用户id') {
                search_params = '/user/id/admin/search/?user_id=' + this.formInline_Self.searchTaskInfo;
            } else if (this.formInline_Self.searchType === '用户名') {
                search_params = '/user/username/admin/search/?username=' + this.formInline_Self.searchTaskInfo + '&search_type=1';
            } else if (this.formInline_Self.searchType === '用户昵称') {
                search_params = '/user/nickname/admin/search/?nickname=' + this.formInline_Self.searchTaskInfo + '&search_type=1';
            }

            const { data: data } = await this.$http.get(search_params);
            if (data.code !== 20000) {
                return this.$message.error({
                    showClose: true,
                    message: 'The user was not searched!',
                    offset: 70
                });
            }

            if (this.formInline_Self.searchType === '用户id') {
                this.userList = [];
                this.userList.push(data.data);
            } else {
                this.userList = data.data.details;
            }
            this.total_Self = this.userList ? this.userList.length : 0;
            this.totalPageNum = data.data.pages;
        },
        temp() {},
        async getUserList() {
            const { data: data } = await this.$http.get('/user/all/admin/search/' + '?page=' + this.queryInfo.page);
            if (data.code !== 20000) {
                return this.$message.error({
                    showClose: true,
                    message: 'Failed to get user list!: ' + data.msg,
                    offset: 70
                });
            }
            this.userList = data.data.details;
            console.log('this.userList:', this.userList);
            this.total = data.data.pages * 10;
        },
        async FuzzySearvhchUser() {
            if (this.searchUserName === '') {
                return this.$message.error({
                    showClose: true,
                    message: 'Please enter the query content',
                    offset: 70
                });
            }
            const { data: data } = await this.$http.get(
                '/user/username/admin/search/' + '?username=' + this.searchUserName + '&search_type=1'
            );
            if (data.code !== 20000) {
                return this.$message.error({
                    showClose: true,
                    message: 'The user was not searched!',
                    offset: 70
                });
            }

            this.userList = data.data.details;
            this.total = this.userList.length;
            this.totalPageNum = data.data.pages;
        },
        async PreciseSearchUser() {
            if (this.searchUserName === '') {
                return this.$message.error({
                    showClose: true,
                    message: 'Please enter the query content',
                    offset: 70
                });
            }
            const { data: data } = await this.$http.get(
                '/user/username/admin/search/' + '?username=' + this.searchUserName + '&search_type=0'
            );
            if (data.code !== 20000) {
                return this.$message.error({
                    showClose: true,
                    message: 'The user was not searched!',
                    offset: 70
                });
            }

            this.userList = [];
            this.userList.push(data.data);
            this.total = this.userList ? this.userList.length : 0;
            this.totalPageNum = data.data.pages;
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.page = newPage;
            this.getUserList();
        },
        async removeUserById(username) {
            const confirmResult = await this.$confirm('This operation will permanently delete the user. Do you want to continue?', 'Tip', {
                confirmButtonText: 'OK',
                cancelButtonText: 'cancel',
                type: 'warning'
            }).catch(err => err);
            if (confirmResult !== 'confirm') {
                return this.$message.info({
                    showClose: true,
                    message: 'Deletion cancelled',
                    offset: 70
                });
            }
            if (this.userList.length == 1) {
                return this.$message.error({
                    showClose: true,
                    message: 'Failed to delete user!: The system must have at least one user!',
                    offset: 70
                });
            }
            const { data: data } = await this.$http.delete('/user/delete/' + '?username=' + username);
            if (data.code !== 20000) {
                return this.$message.error({
                    showClose: true,
                    message: 'Failed to delete user!: ' + data.msg,
                    offset: 70
                });
            }
            this.$message.success({
                showClose: true,
                message: 'User deleted successfully!',
                offset: 70
            });
            this.getUserList();
        },
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                const { data: data } = await this.$http.post('/user/register/', qs.stringify(this.addForm));
                if (data.code !== 20000) {
                    return this.$message.error({
                        showClose: true,
                        message: 'Failed to add user!: ' + data.msg,
                        offset: 70
                    });
                }
                this.$message.success({
                    showClose: true,
                    message: 'User added successfully!',
                    offset: 70
                });
                this.addDialogVisible = false;
                this.getUserList();
            });
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
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
                    return this.$message.error({
                        showClose: true,
                        message: 'Failed to edit user!: ' + data.msg,
                        offset: 70
                    });
                }
                this.$message.success({
                    showClose: true,
                    message: 'Edit user succeeded!',
                    offset: 70
                });
                this.editDialogVisible = false;
                this.getUserList();
            });
        },
        isBlank_login(scope) {
            let key = scope.column.property,
                item = scope.row[key],
                value = 'Never logged in';
            if (item === 0 || item === false || item) {
                value = item;
            }
            return value;
        }
    },
    mounted() {
        this.$store.commit('setUserId', sessionStorage.getItem('userId'));
    }
};
</script>
<style scoped>
.search {
    margin-bottom: 10px !important;
}
.right {
    margin-right: 5px !important;
}
</style>
