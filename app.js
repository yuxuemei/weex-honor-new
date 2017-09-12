import foo from './src/foo.vue'
import router from './src/router'
foo.el = '#root'
foo.router = router
export default new Vue(foo);
