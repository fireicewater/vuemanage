<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import auth from '../../auth'

    export default {
        components: {
            vHead, vSidebar
        },
        beforeCreate() {
//        如果没有token的话需要重新登录
            if (!auth.authenticated) {
                this.$router.push('/manager/login')
            }
        },

    }
</script>
