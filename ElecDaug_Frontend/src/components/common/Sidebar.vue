<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" active-text-color="#20a0ff" :default-active="onRoutes" :collapse="collapse" unique-opened router>
            <template v-for="item in items">
                <!-- 如果有子菜单  -->
                <template v-if="item.subs">
                    <!-- :class="{ margin_left: is_margin_left }" -->
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <div style="display: inline; float: left">
                                <i :class="item.icon"></i>
                            </div>
                            <div style="display: inline float: left">
                                <span slot="title" v-html="item.title"> </span>
                            </div>
                            <!-- <span slot="title">{{ item.title }}</span> -->
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <!-- style="padding-left: 80px !important;" -->
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <!-- 管理员可见部分 -->
                            <el-menu-item
                                v-else-if="subItem.index !== 'user_manage' || showUserManage"
                                :index="subItem.index"
                                :key="subItem.index"
                                >{{ subItem.title }}</el-menu-item
                            >
                        </template>
                    </el-submenu>
                </template>
                <!-- 没有子菜单 style="padding: 0px 40px 0px 8px !important; text-align-last: justify;"-->
                <template v-else>
                    <!-- :class="{ margin_left: is_margin_left }" -->
                    <el-menu-item :index="item.index" :key="item.index">
                        <div style="display: inline; float: left">
                            <i :class="item.icon"></i>
                        </div>
                        <div style="display: inline float: left">
                            <span slot="title">{{ item.title }}</span>
                        </div>
                        <!-- <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span> -->
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-circle-plus',
                    index: 'dashboard',
                    title: 'Home Page'
                },
                {
                    icon: 'el-icon-circle-plus',
                    index: 'Lidar_A_Augmentation_Add',
                    title: 'Start Augmentation'
                },
                {
                    icon: 'el-icon-s-help',
                    index: 'Lidar_A_Augmentation_Task',
                    title: 'Task List'
                },
                {
                    icon: 'el-icon-picture',
                    index: 'Lidar_A_Input_Data',
                    title: 'Data Visualization'
                },
                // {
                //     icon: 'el-icon-reading',
                //     index: 'Log',
                //     title: '平台日志管理'
                // },
                {
                    icon: 'el-icon-user-solid',
                    index: 'user_manage',
                    title: 'User Management'
                },
                // {
                //     index: 'augmentation_manage',
                //     title: 'Augmentation Management'
                // },
                {
                    icon: 'el-icon-s-tools',
                    index: 'system_setting',
                    title: 'System Setting'
                }
                // {
                //     icon: 'el-icon-s-tools',
                //     index: 'Management_System',
                //     title: 'Platform settings',
                //     subs: [

                //     ]
                // }
            ],
            // items: [
            //     {
            //         icon: 'el-icon-s-home',
            //         index: 'dashboard',
            //         title: '系\u3000统\u3000首\u3000页'
            //     },
            //     {
            //         icon: 'el-icon-help',
            //         index: 'lidar_a_data',
            // title: '\u0020激\u0020光\u0020雷\u0020达\u0020对\u0020抗',
            //         subs: [
            //             {
            //                 index: 'Lidar_A_Augmentation_Add',
            //                 title: '添加生成任务'
            //             },
            //             {
            //                 index: 'Lidar_A_Augmentation_Task',
            //                 title: '生成任务查询'
            //             },
            //             {
            //                 index: 'Lidar_A_Input_Data',
            //                 title: '数据可视化'
            //             }
            //         ]
            //     },
            //     {
            //         icon: 'el-icon-s-help',
            //         index: 'lidar_t_data',
            //         title: '\u0020激\u0020光\u0020雷\u0020达\u0020蜕\u0020变',
            //         subs: [
            //             {
            //                 index: 'Lidar_T_Augmentation_Add',
            //                 title: '添加生成任务'
            //             },
            //             {
            //                 index: 'Lidar_T_Augmentation_Task',
            //                 title: '生成任务查询'
            //             },
            //             {
            //                 index: 'Lidar_T_Input_Data',
            //                 title: '数据可视化'
            //             }
            //         ]
            //     },
            //     {
            //         icon: 'el-icon-picture-outline',
            //         index: 'Image_a_data',
            //         title: 'SAR\u0020雷\u0020达\u0020对\u0020抗',
            //         subs: [
            //             {
            //                 index: 'Image_A_Augmentation_Add',
            //                 title: '添加生成任务'
            //             },
            //             {
            //                 index: 'Image_A_Augmentation_Task',
            //                 title: '生成任务查询'
            //             }
            //         ]
            //     },
            //     {
            //         icon: 'el-icon-picture',
            //         index: 'Image_t_data',
            //         title: 'SAR\u0020雷\u0020达\u0020蜕\u0020变',
            //         subs: [
            //             {
            //                 index: 'Image_T_Augmentation_Add',
            //                 title: '添加生成任务'
            //             },
            //             {
            //                 index: 'Image_T_Augmentation_Task',
            //                 title: '生成任务查询'
            //             }
            //         ]
            //     },
            //     {
            //         icon: 'el-icon-reading',
            //         index: 'Log',
            //         title: '日\u3000志\u3000管\u3000理'
            //     },
            //     {
            //         icon: 'el-icon-s-tools',
            //         index: 'Management_System',
            //         title: '\u0020\u0020\u0020\u0020\u0020管\u3000理\u3000系\u3000统',
            //         subs: [
            //             {
            //                 index: 'user_manage',
            //                 title: '用户管理'
            //             },
            //             {
            //                 index: 'augmentation_manage',
            //                 title: '生成管理'
            //             }
            //             // {
            //             //     index: 'system_setting',
            //             //     title: '系统设置'
            //             // }
            //         ]
            //     }
            // ],
            showUserManage: false
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        },
        is_margin_left() {
            return this.collapse ? false : true;
        }
    },
    created() {
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    },
    mounted() {
        if (this.$store.state.user_group_name === '超级管理员') {
            this.showUserManage = true;
        } else {
            this.showUserManage = false;
        }
    }
};
</script>
<style scoped>
.margin_left {
    margin-left: -12px !important;
    /* text-align-last: justify; */
}
.el-menu {
    background-color: #ecf5ff;
}
.el-submenu .el-menu-item {
    padding-left: 50px !important;
}
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
    margin-bottom: -15px;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 180px;
    /* text-align-last: justify; */
}
.sidebar > ul {
    height: 100%;
}
</style>
