<template>
    <div class="wrapper">
        <v-head></v-head>
        <div>
            <v-sidebar></v-sidebar>
            <!-- :style="'width:' + w + 'px'" -->
            <!-- :class="{ 'content-collapse': collapse }" -->
            <div class="content-box">
                <!-- <v-tags></v-tags> -->
                <div class="content">
                    <transition name="move" mode="out-in">
                        <keep-alive :include="tagsList">
                            <router-view></router-view>
                        </keep-alive>
                    </transition>
                    <el-backtop target=".content"></el-backtop>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import vFoot from './Footer.vue';
import bus from './bus';
export default {
    data() {
        return {
            tagsList: [],
            collapse: true
            // userList: [],
            // w: window.screen.width - 180
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags,
        vFoot
    },
    created() {
        // bus.$on('collapse-content', msg => {
        //     this.collapse = msg;
        //     // if (!msg) {
        //     //     this.w = window.screen.width - 180;
        //     //     // this.w = document.body.offsetWidth - 180;
        //     //     // console.log('document.body.offsetWidth - 180:', document.body.offsetWidth - 180);
        //     // } else {
        //     //     this.w = window.screen.width - 64;
        //     //     // this.w = document.body.offsetWidth - 64;
        //     //     // console.log('document.body.offsetWidth - 180:', document.body.offsetWidth - 180);
        //     // }
        // });
        // bus.$on('tags', msg => {
        //     let arr = [];
        //     for (let i = 0, len = msg.length; i < len; i++) {
        //         msg[i].name && arr.push(msg[i].name);
        //     }
        //     this.tagsList = arr;
        // });
    }
};
</script>
<style scoped>
.content-box {
    left: 0px !important;
    width: 100%;
    height: 100%;
}
.wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
