<template>
    <div>
        <el-card>
            <el-row :gutter="20" class="search">
                <el-col :span="4">
                    <el-input placeholder="请输入扩增类型id" v-model="searchAugId" @clear="getAugList" clearable> </el-input>
                </el-col>
                <el-col :span="6">
                    <el-input placeholder="请输入扩增类型名称" v-model="searchAugName" @clear="getAugList" clearable>
                        <el-button slot="append" size="mini" @click="PreciseSearchAug"
                            >精确<i class="el-icon-search el-icon--right"></i
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4"> </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true" v-if="this.userRight === '超级管理员'"
                        >添加生成类型</el-button
                    >
                </el-col>
            </el-row>
            <el-table :data="augTypeList" border stripe>
                <el-table-column label="id" prop="id" width="50px"></el-table-column>
                <el-table-column label="生成类型名称" prop="name"></el-table-column>
                <el-table-column label="生成类型描述" prop="details"></el-table-column>
                <el-table-column label="数据更新时间" prop="update_datetime">
                    <template slot-scope="scope">
                        {{ scope.row.update_datetime | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px" v-if="this.userRight === '超级管理员'">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showEditDialog(scope.row.id, scope.row.name, scope.row.details)"
                            ></el-button>
                        </el-tooltip>
                        <!-- <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAugById(scope.row.id)"></el-button>
                        </el-tooltip> -->
                    </template>
                </el-table-column>
                <el-table-column label="详情" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="查看方法" placement="top" :enterable="false">
                            <el-button
                                type="info"
                                icon="el-icon-more-outline"
                                size="mini"
                                @click="augMethodsById(scope.row.id)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="添加生成类型" :visible.sync="addDialogVisible" width="30%" @closed="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="生成类型名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="生成类型描述" prop="details">
                    <el-input v-model="addForm.details"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAugType" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="编辑生成类型信息"
            :visible.sync="editDialogVisible"
            width="50%"
            @closed="editDialogClosed"
            v-loading="fullscreenLoading"
        >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="110px">
                <el-form-item label="生成类型id">
                    <el-input v-model="editForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="生成类型名称" prop="new_password">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="生成类型描述" prop="new_nickname">
                    <el-input v-model="editForm.details"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAugTypeInfo" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="'生成方法详情'" :visible.sync="methodDialogVisible" width="90%" @closed="MethodsDialogClosed">
            <el-row :gutter="20" class="search">
                <el-col :span="4">
                    <el-button type="primary" @click="addMethodDialogVisible = true" v-if="this.userRight === '超级管理员'"
                        >添加生成方法</el-button
                    >
                </el-col>
            </el-row>
            <el-table :data="augMethodList" border stripe>
                <el-table-column label="id" prop="id" width="50px"></el-table-column>
                <el-table-column label="生成方法名称" prop="name"></el-table-column>
                <el-table-column label="生成方法描述" prop="details"></el-table-column>
                <el-table-column label="数据更新时间" prop="update_datetime">
                    <template slot-scope="scope">
                        {{ scope.row.update_datetime | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px" v-if="this.userRight === '超级管理员'">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showMethodEditDialog(scope.row.id, scope.row.name, scope.row.details)"
                            ></el-button>
                        </el-tooltip>
                        <!-- <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="removeAugMethodById(scope.row.id)"
                            ></el-button>
                        </el-tooltip> -->
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="methodDialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加生成方法" :visible.sync="addMethodDialogVisible" width="30%" @closed="addMethodDialogClosed">
            <el-form :model="addMethodForm" :rules="addMethodFormRules" ref="addMethodFormRef" label-width="70px">
                <el-form-item label="生成方法名称" prop="name">
                    <el-input v-model="addMethodForm.name"></el-input>
                </el-form-item>
                <el-form-item label="生成方法描述" prop="details">
                    <el-input v-model="addMethodForm.details"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addMethodDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAugMethod" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑生成方法信息" :visible.sync="editMethodDialogVisible" width="50%" @closed="editMethodDialogClosed">
            <el-form :model="editMethodForm" :rules="editMethodFormRules" ref="editMethodFormRef" label-width="110px">
                <el-form-item label="生成方法id">
                    <el-input v-model="editMethodForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="生成方法名称" prop="new_password">
                    <el-input v-model="editMethodForm.name"></el-input>
                </el-form-item>
                <el-form-item label="生成方法描述" prop="new_nickname">
                    <el-input v-model="editMethodForm.details"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editMethodDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAugMethodInfo" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import qs from 'qs';
export default {
    data() {
        return {
            id: '',
            name: '',
            augTypeList: [],
            addDialogVisible: false,
            addForm: {
                name: '',
                details: ''
            },
            addFormRules: {
                name: [{ required: true, message: '请输入生成类型名', trigger: 'blur' }]
            },
            editDialogVisible: false,
            editForm: {
                id: '',
                name: '',
                details: ''
            },
            editFormRules: {
                name: [{ required: true, message: '请输入生成类型名', trigger: 'blur' }]
            },
            searchAugName: '',
            searchAugId: '',
            augMethodList: [],
            methodDialogVisible: false,
            addMethodDialogVisible: false,
            addMethodForm: {
                name: '',
                details: '',
                augmentation_type: 0
            },
            addMethodFormRules: {
                name: [{ required: true, message: '请输入生成方法名', trigger: 'blur' }]
            },
            editMethodDialogVisible: false,
            editMethodForm: {
                id: '',
                name: '',
                details: '',
                augmentation_type: 0
            },
            editMethodFormRules: {
                name: [{ required: true, message: '请输入生成类型名', trigger: 'blur' }]
            },
            userRight: '',
            fullscreenLoading: false
        };
    },
    created() {
        this.userRight = this.$store.state.user_group_name;

        this.getAugList();
    },
    methods: {
        async getAugList() {
            var param = '';
            if (this.name !== '') {
                param = '?name=' + this.name;
            }
            const { data: data } = await this.$http.get('/augmentation_type/' + param);
            console.log('data:', data);
            if (data.code !== 20000) {
                return this.$message.error('获取生成类型失败！' + '错误原因：' + data.msg);
            }

            this.augTypeList = data.data;
        },
        async PreciseSearchAug() {
            if (this.searchAugName === '' && this.searchAugId === '') {
                return this.$message.error('请输入搜索内容！');
            }
            var params = '';
            if (this.searchAugName && this.searchAugId) {
                params = params + '?name=' + this.searchAugName + '&id=' + this.searchAugId;
            } else if (this.searchAugName) {
                params = params + '?name=' + this.searchAugName;
            } else if (this.searchAugId) {
                params = params + '?id=' + this.searchAugId;
            }
            const { data: data } = await this.$http.get('/augmentation_type/' + params);
            if (data.code !== 20000) {
                return this.$message.error('未精确搜索到该生成类型！');
            }

            this.augTypeList = [];
            this.augTypeList.push(data.data);
        },
        addAugType() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    loading.close();
                    return;
                }
                if (this.addForm.details === '') {
                    this.addForm.details = '暂无';
                }
                const { data: data } = await this.$http.post('/augmentation_type/', qs.stringify(this.addForm));
                loading.close();
                if (data.code !== 20000) {
                    return this.$message.error('添加生成类型失败！请检查生成类型名是否重复');
                }
                this.$message.success('添加生成类型成功！');
                this.addDialogVisible = false;
                this.getAugList();
            });
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        async removeAugById(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该生成类型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除');
            }
            if (this.augTypeList.length == 1) {
                return this.$message.error('删除生成类型失败！' + '错误原因：系统至少需有一种生成类型');
            }
            const { data: data } = await this.$http.delete('/augmentation_type/' + '?id=' + id);
            if (data.code !== 20000) {
                return this.$message.error('删除生成类型失败！' + '错误原因：' + data.msg);
            }
            this.$message.success('删除生成类型成功！');
            this.getAugList();
        },
        async showEditDialog(id, name, details) {
            this.editForm.id = id;
            this.editForm.name = name;
            this.editForm.details = details;
            this.editDialogVisible = true;
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 修改扩增类型
        editAugTypeInfo() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            // this.fullscreenLoading = true;
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) {
                    loading.close();
                    return;
                }
                var temp_form = {};
                temp_form['id'] = this.editForm.id;
                if (this.editForm.name) {
                    temp_form['name'] = this.editForm.name;
                }
                if (this.editForm.details) {
                    temp_form['details'] = this.editForm.details;
                }
                console.log('temp_form:', temp_form);
                console.log('this.editForm:', this.editForm);
                const { data: data } = await this.$http.put('/augmentation_type/', qs.stringify(this.temp_form));
                loading.close();
                console.log('data:', data);
                if (data.code !== 20000) {
                    return this.$message.error('修改生成类型失败！' + '错误原因：' + data.msg);
                }
                this.$message.success('修改生成类型成功！');
                this.editDialogVisible = false;
                this.getAugList();
            });
        },
        async augMethodsById(id) {
            this.methodDialogVisible = true;
            const { data: data } = await this.$http.get('/augmentation_method/?augmentation_type=' + id);
            if (data.code === 45000) {
                return this.$message.error('该生成类型暂无方法！');
            }
            if (data.code !== 20000) {
                return this.$message.error('查询生成方法失败！' + '错误原因：' + data.msg);
            }

            this.augMethodList = data.data;
            var str = JSON.stringify(this.augMethodList);
        },
        addMethodDialogClosed() {
            this.$refs.addMethodFormRef.resetFields();
        },
        async addAugMethod() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$refs.addMethodFormRef.validate(async valid => {
                if (!valid) {
                    loading.close();
                    return;
                }

                if (this.addMethodForm.details === '') {
                    this.addMethodForm.details = '暂无';
                }
                this.addMethodForm.augmentation_type = this.augMethodList[0].augmentation_type_id;

                const { data: data } = await this.$http.post('/augmentation_method/', qs.stringify(this.addMethodForm));
                loading.close();
                if (data.code !== 20000) {
                    return this.$message.error('添加生成方法失败！请检查生成方法名是否重复');
                }
                this.$message.success('添加生成方法成功！');
                this.addMethodDialogVisible = false;
                this.augMethodsById(this.augMethodList[0].augmentation_type_id);
            });
        },
        showMethodEditDialog(id, name, details) {
            this.editMethodForm.id = id;
            this.editMethodForm.name = name;
            this.editMethodForm.details = details ? details : '暂无';
            this.editMethodForm.augmentation_type = this.augMethodList[0].augmentation_type_id;
            this.editMethodDialogVisible = true;
        },
        editAugMethodInfo() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$refs.editMethodFormRef.validate(async valid => {
                if (!valid) {
                    loading.close();
                    return;
                }
                var temp_form = {};
                temp_form['id'] = this.editMethodForm.id;
                if (this.editMethodForm.name) {
                    temp_form['name'] = this.editMethodForm.name;
                }
                if (this.editMethodForm.details) {
                    temp_form['details'] = this.editMethodForm.details;
                }
                // console.log('temp_form:', temp_form);
                // console.log('this.editMethodForm:', this.editMethodForm);
                const { data: data } = await this.$http.put('/augmentation_method/', qs.stringify(temp_form));
                loading.close();
                if (data.code !== 20000) {
                    return this.$message.error('修改生成方法失败，请添加修改！' + '错误原因：' + data.msg);
                }
                this.$message.success('修改生成方法成功！');
                this.editMethodDialogVisible = false;
                this.augMethodsById(this.editMethodForm.augmentation_type);
            });
        },
        editMethodDialogClosed() {
            this.$refs.editMethodFormRef.resetFields();
        },
        async removeAugMethodById(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该生成方法, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除');
            }
            if (this.augMethodList.length == 1) {
                return this.$message.error('删除生成方法失败！' + '错误原因：生成类型至少需有一种生成方法');
            }
            const { data: data } = await this.$http.delete('/augmentation_method/' + '?id=' + id);
            if (data.code !== 20000) {
                return this.$message.error('删除生成方法失败！' + '错误原因：' + data.msg);
            }
            this.$message.success('删除生成方法成功！');
            this.augMethodsById(this.augMethodList[0].augmentation_type_id);
        },
        MethodsDialogClosed() {
            this.augMethodList = [];
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
