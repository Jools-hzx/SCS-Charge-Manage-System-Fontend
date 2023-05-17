<template>
    <div>

        <div style="margin: 10px 0">
            <el-button type="primary" @click="add">新增</el-button>
            <el-button>其它</el-button>
        </div>

        <!-- 搜索-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder="--请输入站点名称关键字查找--" style="width:30%"></el-input>
            <el-button style="margin-left: 10px" type="primary" @click="list">查询</el-button>
        </div>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" sortable label="编号"></el-table-column>
            <el-table-column prop="name" label="站点名称"></el-table-column>
            <el-table-column prop="operator" label="运营商"></el-table-column>
            <el-table-column prop="price" sortable label="实时价格"></el-table-column>
            <el-table-column prop="availableCharger" sortable label="空闲桩数目"></el-table-column>
            <el-table-column prop="totalCharger" label="总充电桩数目"></el-table-column>
            <el-table-column prop="location" label="位置信息"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
                    <!-- 增加 popcomfirm 控件，确认删除 -->
                    <el-popconfirm title="确定删除吗？" @confirm="handleDel(scope.row.id)">
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>


        <!--注册站点的表单-->
        <el-dialog title="注册站点" v-model="dialogVisible" width="30%">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="站点名称" prop="name">
                    <el-input v-model="form.name" style="width: 80%" @blur="validName"></el-input>
                    <!--提示站点名称信息是否唯一-->
                    {{ this.validMsg.name }}
                </el-form-item>
                <el-form-item label="运营商" prop="operator">
                    <el-input v-model="form.operator" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="实时价格" prop="price">
                    <el-input v-model="form.price" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="总桩数目" prop="totalCharger">
                    <el-input v-model="form.totalCharger" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="位置信息" prop="location">
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

        <!--更新站点的表单-->
        <el-dialog title="更新站点信息" v-model="updateDialogVisible" width="30%">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="站点名称" prop="name">
                    <el-input v-model="form.name" style="width: 80%"></el-input>
                    <!--提示站点名称信息是否唯一-->
                    {{ this.validMsg.name }}
                </el-form-item>
                <el-form-item label="运营商" prop="operator">
                    <el-input v-model="form.operator" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="实时价格" prop="price">
                    <el-input v-model="form.price" style="width: 80%"></el-input>
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
            dialogVisible: false,   //标记注册表单是否可见
            form: {},      //记录注册表单信息
            updateDialogVisible: false, //记录更新表单是否可见
            pageSize: 6,    //页面显示的数据量
            currentPage: 1, //当前显示的页码
            total: 0,    //动态获取
            search: "",
            validMsg: {},
            rules: {
                name: [{required: true, message: '请输入称站点名称', trigger: 'blur'}],
                operator: [{required: true, message: '请输入运营商', trigger: 'blur'}],
                price: [{required: true, message: '请输入价格', trigger: 'blur'}, {
                    pattern: /^(([1-9]\d*)|(0))(\.\d+)?$/,
                    message: '请输入数字',
                    trigger: 'blur'
                }],
                totalCharger: [{required: true, message: '请输入数字', trigger: 'blur'}, {
                    pattern: /^(([1-9]\d*)|(0))$/,
                    message: '请输入数字',
                    trigger: 'blur'
                }],
                location: [{required: true, message: '请输入位置信息', trigger: 'blur'}]
            }

        }
    },
    created() {
        this.list();
    },
    methods: {
        validName() {
            console.log("name:", this.form.name);
            request.get("/api/stations/nameValid/" + this.form.name).then(
                res => {
                    if (res.code === "200" && res.data === "invalid") {
                        this.validMsg.name = "名称已经存在，请重新输入"
                    } else if (res.code === "200" && res.data === "valid") {
                        //如果站点名称合法，则清楚验证信息
                        this.validMsg.name = ""
                    } else {
                        ElMessage.error("网络连接错误");
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
        handleDel(id) {
            console.log("待删除的站点 id:", id);
            request.delete("/api/stations/del/" + id).then(
                res => {
                    if (res.code === "200") {
                        //添加成功...
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
        handleEdit(row) {    //该方法用于编辑站点信息
            request.get(
                "/api/stations/queryById/" + row.id
            ).then(
                res => {
                    if (res.code === "200") {
                        //重新请求所有数据
                        //清空本次存储的数据
                        this.form = res.data;
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
            );
            this.$refs['form'].resetFields();
        },
        update() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    request.put(
                        "/api/stations/update",
                        JSON.parse(JSON.stringify(this.form))
                    ).then(
                        res => {
                            if (res.code === "200") {
                                //添加成功...
                                ElMessage({
                                    message: '更新成功',
                                    type: 'success',
                                });
                                //重新请求所有数据
                                //清空本次存储的数据
                                this.updateDialogVisible = false;
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
                } else {
                    //弹出提示失败
                    ElMessage.error("表单信息输入有误");
                    //重新请求所有数据
                    //清空本次存储的数据
                    return false;
                }
            })
        },
        add() {     //该方法显示添加表单
            this.form = {}; //每次清空表单
            this.dialogVisible = true;
            //将上传验证消息，清空
            this.$refs['form'].resetFields();
            this.validMsg.name = "";
        },
        save() {
            this.$refs['form'].validate((valid) => {
                if (valid && (this.validMsg.name === "")) {
                    //如果表单信息验证通过并且站点名称不重复
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
                                console.log("errors:", res)
                                //重新请求所有数据
                                //清空本次存储的数据
                                this.form = {};
                            }
                        }
                    )
                } else {
                    //弹出提示失败
                    ElMessage.error("表单信息输入有误");
                    //重新请求所有数据
                    //清空本次存储的数据
                    this.form = {};
                    return false;
                }
            })
        },
        list() {
            // request.get("/api/stations/list").then(
            //     res => {
            //         if (res.code === "200") {
            //             this.tableData = res.data;
            //         } else {
            //             //弹出提示失败
            //             ElMessage.error(res.msg);
            //         }
            //     }
            // )

            request.get(
                "/api/stations/listByPage",
                {
                    withCredentials: true,
                    params: {
                        "pageNum": this.currentPage,
                        "pageSize": this.pageSize,
                        "search": this.search
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
