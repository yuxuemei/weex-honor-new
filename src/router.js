import Router from 'vue-router'
import Home from './home.vue'
import Detail from './detail.vue'
import Login from './login.vue'
import Meal from './meal.vue'
import My from './my.vue'
import Exchange from './exchange.vue'
import Register from './register.vue'
import Bind from './bind.vue'
import Recharge from './recharge.vue'
import List from './list.vue'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      component: Home
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/detail',
      component: Detail
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/meal',
      component: Meal
    },
    {
      path: '/my',
      component: My
    },
    {
      path: '/exchange',
      component: Exchange
      
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/bind',
      component: Bind
    },
    {
      path: '/recharge',
      component: Recharge
    },
    { 
      path: '/list',
      component: List
    }
  ]
})
