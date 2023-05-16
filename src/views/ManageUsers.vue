<template>
    <div>
        <div style="margin: 10px 0">
            <el-button type="primary">新增</el-button>
            <el-button>其它</el-button>
        </div>

        <!-- 搜索 By User name -->
        <div style="margin: 10px 0">
            <el-input v-model="chargerId" placeholder="--TODO:待实现[名称查找]--" style="width:30%"></el-input>
            <el-button style="margin-left: 10px" type="primary" @click="list">查询</el-button>
        </div>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" sortable label="用户ID"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="email" label="电子邮箱"></el-table-column>
            <el-table-column prop="phone" label="手机号码"></el-table-column>
            <el-table-column prop="balance" label="用户余额"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button @click="handleEdit(scope.row)" type="text">注销</el-button>
                    <el-popconfirm title="确定注销该用户吗？" @confirm="handleDel(scope.row.id)">
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页控件 -->
        <div style="margin: 10px 0">
            <el-pagination
                    @size-change="handlePageSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[6,10]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
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
            tableData: [],
            currentPage: 1,
            pageSize: 6,
            total: 0,
        }
    },
    created() {
        this.list();
    },
    methods: {
        handlePageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.list();
        },
        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.list();
        },
        list() {
            request.get(
                "/api/users/listUsersByPage",
                {
                    params: {
                        "pageNum": this.currentPage,
                        "pageSize": this.pageSize
                    }
                }
            ).then(
                res => {
                    if (res.code === "200") {
                        this.tableData = res.data.records;
                        this.total = res.data.total;
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
