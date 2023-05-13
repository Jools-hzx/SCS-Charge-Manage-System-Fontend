<template>
    <div>

    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

// 引入头部组件
import Header from '@/components/Header.vue'
// 引入导航栏
import Aside from "@/components/Aside.vue";

export default {
    name: 'HomeView',
    components: {
        // HelloWorld
        Header,
        Aside
    }
}
</script>
