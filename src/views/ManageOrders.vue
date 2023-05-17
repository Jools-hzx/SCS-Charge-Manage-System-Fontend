<template>
    <div>
        <div style="margin: 10px 0">
            <el-button>其它</el-button>
        </div>

        <!-- 搜索 By User name -->
        <div style="margin: 10px 0">
            <el-input v-model="chargerId" placeholder="--TODO:待实现[订单号查找]--" style="width:30%"></el-input>
            <el-button style="margin-left: 10px" type="primary" @click="list">查询</el-button>
        </div>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="orderId" sortable label="订单ID"></el-table-column>
            <el-table-column prop="createTime" sortable label="创建时间" width="180"></el-table-column>
            <el-table-column prop="userId" label="用户ID"></el-table-column>
            <el-table-column prop="chargerId" label="充电桩ID"></el-table-column>
            <el-table-column prop="stationId" label="站点ID"></el-table-column>
            <el-table-column prop="price" label="订单金额(￥)"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button @click="handleEdit(scope.row)" type="text">修改状态</el-button>
                    <el-popconfirm title="确定要删除该订单吗？" @confirm="handleDel(scope.row.id)">
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
import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
    name: 'ManageOrdersView',
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
                "/api/orders/queryOrdersPage",
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
                        //获取到数据后动态的显示状态
                        this.showStatus();
                        this.showCreateTime();
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
                    return '未支付';
                case 1:
                    return '已支付';
                default:
                    return '未知状态';
            }
        },
        showStatus() {
            this.tableData.forEach(item => {
                item.status = this.getStatusText(item.status);
                // console.log("status:", item.status);
            })
        },
        showCreateTime() {
            this.tableData.forEach(item => {
                item.createTime = this.formatDateTime(item.createTime);
                // console.log("status:", item.status);
            })
        },
        formatDateTime(datetime) {
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Asia/Shanghai', // 设置中国时区
            };

            const formatter = new Intl.DateTimeFormat('zh-CN', options);
            return formatter.format(new Date(datetime));
        }
    }
}
</script>
