<template>
    <div>

        <div style="margin: 10px 0">
            <el-button type="primary" @click="add">新增</el-button>
            <el-button>其它</el-button>
        </div>

        <!-- 搜索-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder="--请输入站点名称关键字查找--" style="width:30%"></el-input>
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


        <!--注册站点的表单-->
        <el-dialog title="提示" v-model="dialogVisible" width="30%">
            <el-form :model="form" label-width="120px">
                <el-form-item label="站点名称">
                    <el-input v-model="form.name" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="运营商">
                    <el-input v-model="form.operator" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="实时价格">
                    <el-input v-model="form.price" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="总桩数目">
                    <el-input v-model="form.totalCharger" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="位置信息">
                    <el-input v-model="form.location" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
            </span>
            </template>
        </el-dialog>

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
            dialogVisible: false,   //标记注册表单是否可见
            form: {}                 //记录注册表单信息
        }
    },
    created() {
        this.list();
    },
    methods: {
        add() {     //该方法显示添加表单
            this.form = {}; //每次清空表单
            this.dialogVisible = true;
        },
        save() {
            //该方法进行站点注册
            request.post(
                "/api/stations/save",
                JSON.parse(JSON.stringify(this.form))
            ).then(
                res => {
                    if (res.code === "200") {
                        //添加成功...
                        ElMessage({
                            message: '添加成功',
                            type: 'success',
                        });
                        //重新请求所有数据
                        //清空本次存储的数据
                        this.dialogVisible = false;
                        this.list();    //更新数据
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
