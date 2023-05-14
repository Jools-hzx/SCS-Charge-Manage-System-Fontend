<template>
    <div>

        <div style="margin: 10px 0">
            <el-button type="primary">新增</el-button>
            <el-button>其它</el-button>
        </div>

        <!-- 搜索-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder="--请输入充电桩ID查找--" style="width:30%"></el-input>
            <el-button style="margin-left: 10px" type="primary">查询</el-button>
        </div>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" sortable label="编号"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="stationId" label="站点Id"></el-table-column>
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
            request.get("/api/chargers/list").then(
                res => {
                    if (res.code === "200") {
                        this.tableData = res.data;
                        //获取到数据后动态的显示状态
                        this.showStatus();
                    } else {
                        //弹出提示失败
                        ElMessage.error(res.msg);
                    }
                }
            )
        },
        getStatusText(status) { //该方法用于显示充电桩的状态
            switch (status) {
                case 0:
                    return '空闲中';
                case 1:
                    return '占用中[用户不可选]';
                case 2:
                    return '故障[用户不可选]';
                default:
                    return '未知状态';
            }
        },
        showStatus() {
            this.tableData.forEach(item => {
                item.status = this.getStatusText(item.status);
                console.log("status:", item.status);
            })
        }
    }
}
</script>
