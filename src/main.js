import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入全局 css
import '@/assets/global.css'

//引入 Element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//处理国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

createApp(App).use(store).use(router).use(ElementPlus,{locale: zhCn,}).mount('#app')
