<template>
    <div>
        <!--      引用组件-->
        <Header v-if="!isLoginPage"/>

        <!--      主体-->
        <div style="display: flex; background-color: rgba(235, 235, 235, 0.08)">
            <!--  加入侧边栏 -->
            <Aside v-if="!isLoginPage"/>
            <!-- 如果是登陆页面，不使用flex: 1, 使用 flex: 0.4-->
            <router-view v-if="$route.path === '/'" style="flex: 0.4" />
            <router-view v-else style="flex: 1"/>
            <!-- 内容区域:这个部分是从View包下各个视图组件来的(通过路由机制)  -->
        </div>

    </div>
</template>
<style>

</style>

<script>
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";

export default {
    name: "Layout",
    components: {
        Header,
        Aside
    },
    data() {
        return {
            useFlex: true // 默认使用 flex 样式
        }
    },
    computed: {
        isLoginPage() {
            return this.$route.path === '/';
        }
    },
}
</script>