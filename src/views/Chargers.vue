<template>
    <div>

        <div style="margin: 10px 0">
            <el-button type="primary">新增</el-button>
            <el-button>其它</el-button>
        </div>

        <!-- 搜索 By Charger Id-->
        <div style="margin: 10px 0">
            <el-input v-model="chargerId" placeholder="--请输入充电桩ID查找--" style="width:30%"></el-input>
            <el-button style="margin-left: 10px" type="primary" @click="list">查询</el-button>
        </div>

        <!-- 搜索 By Station Id-->
        <div style="margin: 10px 0">
            <el-input v-model="stationId" placeholder="--请输入站点ID查找--" style="width:30%"></el-input>
            <el-button style="margin-left: 10px" type="primary" @click="list">查询</el-button>
        </div>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" sortable label="编号"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="stationId" label="站点Id"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button @click="handleEdit(scope.row)" type="text">更新状态</el-button>
                    <el-popconfirm title="确定删除吗？" @confirm="handleDel(scope.row.id)">
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>


        <!--更新charger状态的表单-->
        <el-dialog title="更新站点信息" v-model="updateDialogVisible" width="30%">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="ChargerId" prop="id" v-model="form.id">
                    : {{ form.id }}
                </el-form-item>
                <el-form-item label="新状态" prop="status">
                    <el-select v-model="form.status" class="m-2" size="small">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="站点Id" prop="stationId" v-model="form.stationId">
                    : {{ form.stationId }}
                </el-form-item>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="update">确 定</el-button>
            </span>
            </template>
        </el-dialog>

        <!-- 分页控件 -->
        <div style="margin: 10px 0">
            <el-pagination
                    @size-change="handlePageSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[8, 12]"
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
            pageSize: 8,
            currentPage: 1,
            total: 0,
            chargerId: "",
            stationId: "",
            form: {},
            updateDialogVisible: false,
            options: [
                {
                    value: '0',
                    label: '空闲中',
                },
                {
                    value: '1',
                    label: '占用中',
                },
                {
                    value: '2',
                    label: '故障中',
                }
            ]
        }
    },
    created() {
        this.list();
    },
    methods: {
        handleDel(id) {
            // console.log("id:", id);
            //发送请求删除 charger
            request.delete("/api/chargers/delCharger/" + id).then(
                res => {
                    if (res.code === "200") {
                        //删除成功....
                        ElMessage({
                            message: '删除成功',
                            type: 'success',
                        });
                        //重新请求所有数据
                        this.list();    //更新数据
                    } else {
                        //弹出提示失败
                        ElMessage.error(res.msg);
                        //重新请求所有数据
                        this.list();
                    }
                }
            )
        },
        handleEdit(row) {
            // console.log("id:", row.id);
            //发送请求回显数据
            request.get("/api/chargers/queryById/" + row.id).then(
                res => {
                    if (res.code === "200") {
                        //重新请求所有数据
                        //清空本次存储的数据
                        this.form = res.data;
                        //根据状态数字显示状态文本信息
                        this.form.status = this.getStatusText(this.form.status);
                        //将上次验证消息，清空
                        this.updateDialogVisible = true;
                    } else {
                        //弹出提示失败
                        ElMessage.error(res.msg);
                        //重新请求所有数据
                        //清空本次存储的数据
                        this.form = {};
                    }
                }
            )
        },
        update() {  //执行更新操作
            // console.log("form:", this.form);
            request.put(
                "/api/chargers/updateStatus",
                JSON.parse(JSON.stringify(this.form))
            ).then(
                res => {
                    if (res.code === "200") {
                        //添加成功...
                        ElMessage({
                            message: '更新状态成功',
                            type: 'success',
                        });
                        //重新请求所有数据
                        //清空本次存储的数据
                        this.updateDialogVisible = false;
                        this.list();    //更新数据
                        this.form = {}; //清空提交的信息表单中的数据
                    } else {
                        //弹出提示失败
                        ElMessage.error(res.msg);
                        //重新请求所有数据
                        //清空本次存储的数据
                        this.form = {};
                    }
                }
            )
        },
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
                "/api/chargers/queryPage",
                {
                    params: {
                        "pageNum": this.currentPage,
                        "pageSize": this.pageSize,
                        "chargerId": this.chargerId,
                        "stationId": this.stationId
                    }
                }
            ).then(
                res => {
                    if (res.code === "200") {
                        this.tableData = res.data.records;
                        this.total = res.data.total;
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
                    return '故障中[用户不可选]';
                default:
                    return '未知状态';
            }
        },
        showStatus() {
            this.tableData.forEach(item => {
                item.status = this.getStatusText(item.status);
                // console.log("status:", item.status);
            })
        }
    }
}
</script>
