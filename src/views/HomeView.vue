<template>
    <div>

        <div style="margin: 10px 0">
            <el-button type="primary">新增</el-button>
            <el-button>其它</el-button>
        </div>

        <!-- 搜索-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder=" 请 输 入 关 键 字 " style="width:30%"></el-input>
            <el-button style="margin-left: 10px" type="primary">查询</el-button>
        </div>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" sortable label="编号"></el-table-column>
            <el-table-column prop="name" label="站点名称"></el-table-column>
            <el-table-column prop="operator" label="运营商"></el-table-column>
            <el-table-column prop="price" sortable label="实时价格"></el-table-column>
            <el-table-column prop="availableCharger" sortable label="空闲桩数目"></el-table-column>
            <el-table-column prop="totalCharger" label="总充电桩数目"></el-table-column>
            <el-table-column prop="location" label="位置信息"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                    <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
                    <el-button type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

// 引入头部组件
import Header from '@/components/Header.vue'
// 引入导航栏
import Aside from "@/components/Aside.vue";

//导入 request 工具类，发出Axios 请求
import request from "@/utils/request";
//导入提示消息组件
import {ElMessage} from 'element-plus'

export default {
    name: 'HomeView',
    components: {
        // HelloWorld
        Header,
        Aside
    },
    data() {
        return {
            tableData: []
        }
    },
    created() {
        this.list();
    },
    methods: {
        list() {
            request.get("/api/stations/list").then(
                res => {
                    if (res.code === "200") {
                        this.tableData = res.data;
                    } else {
                        //弹出提示失败
                        ElMessage.error(res.msg);
                    }
                }
            )
        }
    }
}
</script>
