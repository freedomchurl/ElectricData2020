import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


const route = [
    // {
    //   path:'/a',
    //   //component:InitialHeaderVue
    // },
    // {
    //   path:'/b',
    //   //com`1ponent:InitialFormVue
    // },
    {
      path:'',
      component:this
    },
    {
      path:'/loginProject',
      component:LoginPage,
      name:'login'
    },
    {
      path:'/main',
      component:MainPage,
      name:'main',
      children:[
        {
          path:'list',
          component:MenuList
        },
        {
          path:'admin',
          component:MenuManager
        },
        {
          path:'analytic',
          component:MenuAnalytic
        },
        {
          path:'group',
          component:MenuGroup
        }
      ]
    },
    {
      path:'/initProject',
      component:InitialPage,
      name:'init'
    }
];


const router = new VueRouter({
  mode: 'history',
    routes:route
})

export default router