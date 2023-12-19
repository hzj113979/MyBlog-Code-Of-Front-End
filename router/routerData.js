const router1 = [
  {
    path: '/home',
    component: (resolve) => require(['@/components/Home'], resolve),
    name: '管理员功能',
    iconCls: 'fa fa-file-text-o',
    meta: {


      roles: ['admin']
    },
    children: [
      {
        path: '/usermange',
        name: '用户管理',
        component: (resolve) => require(['@/components/UserMana'], resolve),
        meta: {
          isAd: true


        },
      },


    ]
  },

]
export const commonRoute = [
  {
    path: '/Login',
    name: 'Login',
    hidden: true,
    component: (resolve) => require(['@/components/Login'], resolve)
  },
  {
    path: '/',  //默认页
    redirect: '/Login',//配置型跳转
    hidden: true
  },

  {
    path: 'register',
    name: 'register',
    hidden: true,
    component: (resolve) => require(['@/components/Register'], resolve)
  },
  {
    path: '/home',
    component: (resolve) => require(['@/components/Home'], resolve),
    name: '首页·',
    iconCls: 'fa fa-bar-chart',
    redirect: '/UserHome',
    children: [
      {
        path: '/UserHome',
        name: '首页',
        component: (resolve) => require(['@/components/UserHome'], resolve),
        meta: {
          keepAlive: false,
          isuser: true
        }
      }

    ]
  },
  {

    path: '/blogDetail',
    name: '博客详情',
    component: import(/* webpackChunkName: "group-user" */ '@/components/BlogDetail'),

    hidden: true,
    meta: {
      keepAlive: false,

    }
  },

  {
    path: '/home',
    component: (resolve) => require(['@/components/Home'], resolve),
    iconCls: 'fa fa-bar-chart',
    children: [
      {
        path: '/collectionlist',
        name: '我的收藏',
        component: (resolve) => require(['@/components/CollectionList'], resolve),
        meta: {

          isuser: true
        }
      },
    ]
  },
  {
    path: '/home',
    component: (resolve) => require(['@/components/Home'], resolve),
    name: '浏览历史',
    iconCls: 'fa fa-bar-chart',
    children: [

      {
        path: '/history',
        name: '浏览历史',
        component: (resolve) => require(['@/components/History'], resolve),
        meta: {

          isuser: true
        }
      },
    ]
  },



  {
    path: '/home',
    component: (resolve) => require(['@/components/Home'], resolve),
    name: '文章管理',
    iconCls: 'fa fa-file-text-o',
    children: [
      {
        path: '/ArticleList',
        name: '文章列表',
        component: (resolve) => require(['@/components/ArticleList'], resolve),
        meta: {
          keepAlive: false,
          isuser: true

        }
      },
      {
        path: '/postArticle',
        name: '发表文章',
        component: (resolve) => require(['@/components/PostArticle'], resolve),
        meta: {
          keepAlive: false,
          isuser: true
        }
      }, {
        path: '/editBlog',
        name: '编辑博客',
        component: (resolve) => require(['@/components/PostArticle'], resolve),
        hidden: true,
        meta: {
          keepAlive: false
        }
      }
    ]
  },



]
export default router1