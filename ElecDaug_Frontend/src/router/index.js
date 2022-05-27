import Vue from 'vue';
import Router from 'vue-router';
const Lidar_A_AugTaskAdd = () => import( '../components/page/Lidar_A_AugTaskAdd.vue')
const Lidar_A_AugTaskList = () => import( '../components/page/Lidar_A_AugTaskList.vue')
const Lidar_A_Input_Data = () => import('../components/page/Lidar_A_Input_Data.vue')

const Lidar_T_AugTaskAdd = () => import( '../components/page/Lidar_T_AugTaskAdd.vue')
const Lidar_T_AugTaskList = () => import( '../components/page/Lidar_T_AugTaskList.vue')
const Lidar_T_Input_Data = () => import('../components/page/Lidar_T_Input_Data.vue')

const Image_A_AugTaskAdd = () => import('../components/page/Image_A_AugTaskAdd.vue')
const Image_A_AugTaskList = () => import( '../components/page/Image_A_AugTaskList.vue')
// const Image_A_Input_Data = () => import('../components/page/Image_A_Input_Data.vue')

const Image_T_AugTaskAdd = () => import('../components/page/Image_T_AugTaskAdd.vue')
const Image_T_AugTaskList = () => import( '../components/page/Image_T_AugTaskList.vue')
// const Image_T_Input_Data = () => import('../components/page/Image_T_Input_Data.vue')

const AugmentationManage = () => import( '../components/page/AugmentationManage.vue')
const Log = () => import( '../components/page/Log.vue')
const SelfInfo = () => import( '../components/page/SelfInfo.vue')
const UserManage = () => import( '../components/page/User_Manage.vue')
const SystemSetting = () => import( '../components/page/System_Setting.vue')
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/Image_T_Augmentation_Add'
        },

        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/',
            component: () => import( '../components/common/Home.vue'),
            meta: { title: 'Home Page' },
            children: [
                // {
                //     path: '/dashboard',
                //     component: () => import( '../components/page/Dashboard.vue'),
                //     meta: { title: 'Home Page' }
                // },
                // {
                //     path: '/Lidar_A_Augmentation_Add',
                //     component: Lidar_A_AugTaskAdd,
                //     name:Lidar_A_AugTaskAdd,
                //     meta: { title: 'Start Augmentation' }
                // },
                // {
                //     path: '/Lidar_A_Augmentation_Task',
                //     component: Lidar_A_AugTaskList,
                //     name:Lidar_A_AugTaskList,
                //     meta: { title: 'Task List' }
                // },
                // {
                //     path: '/Lidar_A_Input_Data',
                //     component: Lidar_A_Input_Data,
                //     name: Lidar_A_Input_Data,
                //     meta: { title: 'Data Visualization' }
                // },


                // {
                //     path: '/Lidar_T_Augmentation_Add',
                //     component: Lidar_T_AugTaskAdd,
                //     name:Lidar_T_AugTaskAdd,
                //     meta: { title: '激光-蜕变-添加' }
                // },
                // {
                //     path: '/Lidar_T_Augmentation_Task',
                //     component: Lidar_T_AugTaskList,
                //     name:Lidar_T_AugTaskList,
                //     meta: { title: '激光-蜕变-查询' }
                // },
                // {
                //     path: '/Lidar_T_Input_Data',
                //     component: Lidar_T_Input_Data,
                //     name: Lidar_T_Input_Data,
                //     meta: { title: '激光-蜕变-可视化' }
                // },


                // {
                //     path: '/Image_A_Augmentation_Add',
                //     component: Image_A_AugTaskAdd,
                //     name:Image_A_AugTaskAdd,
                //     meta: { title: 'SAR-对抗-添加' }
                // },
                // {
                //     path: '/Image_A_Augmentation_Task',
                //     component: Image_A_AugTaskList,
                //     name:Image_A_AugTaskList,
                //     meta: { title: 'SAR-对抗-查询' }
                // },
                // {
                //     path: '/Image_A_Input_Data',
                //     component: Image_A_Input_Data,
                //     name: Image_A_Input_Data,
                //     meta: { title: 'SAR-对抗-可视化' }
                // },

                {
                    path: '/Image_T_Augmentation_Add',
                    component: Image_T_AugTaskAdd,
                    name:Image_T_AugTaskAdd,
                    meta: { title: 'SAR-蜕变-添加' }
                },
                // {
                //     path: '/Image_T_Augmentation_Task',
                //     component: Image_T_AugTaskList,
                //     name:Image_T_AugTaskList,
                //     meta: { title: 'SAR-蜕变-查询' }
                // },
                // {
                //     path: '/Image_T_Input_Data',
                //     component: Image_T_Input_Data,
                //     name: Image_T_Input_Data,
                //     meta: { title: 'SAR-蜕变-可视化' }
                // },


                // {
                //     path: '/user_manage',
                //     component: UserManage,
                //     name:UserManage,
                //     meta: { title: 'User Management' }
                // },
                // {
                //     path: '/augmentation_manage',
                //     component: AugmentationManage,
                //     name:AugmentationManage,
                //     meta: { title: '生成管理' }
                // },
                // {
                //     path: '/system_setting',
                //     component: SystemSetting,
                //     name:SystemSetting,
                //     meta: { title: 'System Setting' }
                // },
                // {
                //     path: '/Log',
                //     component: Log,
                //     name:Log,
                //     meta: { title: '平台日志管理' }
                // },
                // {
                //     path: '/SelfInfo',
                //     component: SelfInfo,
                //     name:SelfInfo,
                //     meta: { title: 'Your Information' }
                // },
                {
                    path: '/404',
                    component: () => import( '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import( '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        }
    ]
});
