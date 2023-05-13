<template>
    <div>
        <!-- 说明-->
        <!-- 先去掉, 这两个方法, 否则会报错-->
        <!-- @open="handleOpen"-->
        <!-- @close="handleClose"-->
        <el-menu
                default-active="2"
                class="el-menu-vertical-demo">
            <el-sub-menu index="1">
                <template #title>
                    <i class="el-icon-menu"></i>
                    <span>设施管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="1-1">
                        <router-link to="/home" class="no-underline">
                            充电站点管理
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="1-2">
                        <router-link to="/chargers" class="no-underline">
                            充电桩管理
                        </router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
                <template #title>
                    <i class="el-icon-menu"></i>
                    <span>用户管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="2-1">
                        <router-link to="/users" class="no-underline">
                            销户/激活
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="2-2">
                        <router-link to="/orders" class="no-underline">
                            订单管理
                        </router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </div>
</template>
<script>
export default {
    name: "Aside"
}
</script>
<style scoped>
</style>