<template>
    <el-form :rules="rules" class="login-container" label-position="left"
             label-width="0px" v-loading="loading">
        <h3 class="login_title">系统登录</h3>
        <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.name" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
        <el-form-item style="width: 100%">
            <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>

//导入 request 工具类，发出Axios 请求
import request from "@/utils/request";
//导入提示消息组件
import {ElMessage} from 'element-plus'

export default {
    data() {
        return {
            rules: {
                account: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                checkPass: [{required: true, message: '请输入密码', trigger: 'blur'}]
            },
            checked: true,
            loginForm: {
                name: 'Jools_He',
                password: 'hzx'
            },
            loading: false
        }
    },
    methods: {
        submitClick() {
            //发送请求登录
            request.post(
                "/api/admin/login",
                JSON.parse(JSON.stringify(this.loginForm))
            ).then(
                res => {
                    if (res.code === "200") {
                        ElMessage({
                            message: '登录成功',
                            type: 'success',
                        });
                        this.$router.replace({path: '/home'});
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
<style>
.login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}

.login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
}

.login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
}
</style>