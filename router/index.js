import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [
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
      path: '/loginblank',
      name: 'loginblank',
      hidden: true,
      component: (resolve) => require(['@/assets/Blank/LoginBlank'], resolve)
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
      isuser: true,
      iconCls: 'fa fa-bar-chart',
      redirect: '/UserHome',
      meta: {
        keepAlive: false,
        icon: 'shouye'
      },
      children: [
        {
          path: '/UserHome',
          name: '首页',
          component: (resolve) => require(['@/components/UserHome'], resolve),
          meta: {
            keepAlive: false,
            icon: 'shouye'
          }
        }
      ]
    },
    {
      path: '/blogDetail',
      name: '博客详情',
      component: (resolve) => require(['@/components/BlogDetail'], resolve),
      hidden: true,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/home',
      component: (resolve) => require(['@/components/Home'], resolve),
      iconCls: 'fa fa-bar-chart',
      isuser: true,
      children: [
        {
          path: '/collectionlist',
          name: '我的收藏',
          component: (resolve) => require(['@/components/CollectionList'], resolve),
        },
      ]
    },
    {
      path: '/home',
      component: (resolve) => require(['@/components/Home'], resolve),
      name: '浏览历史',
      isuser: true,
      iconCls: 'fa fa-bar-chart',
      children: [
        {
          path: '/history',
          name: '浏览历史',
          component: (resolve) => require(['@/components/History'], resolve),
        },
      ]
    },
    {
      path: '/home',
      component: (resolve) => require(['@/components/Home'], resolve),
      name: '文章管理',
      isuser: true,
      iconCls: 'icon-Chevrons',
      children: [
        {
          path: '/ArticleList',
          name: '文章列表',
          component: (resolve) => require(['@/components/ArticleList'], resolve),
          meta: {
            keepAlive: false
          }
        },
        {
          path: '/postArticle',
          name: '发表文章',
          component: (resolve) => require(['@/components/PostArticle'], resolve),
          meta: {
            keepAlive: false
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
    {
      path: '/home',
      component: (resolve) => require(['@/components/Home'], resolve),
      name: '管理员功能',
      isuser: false,
      isAd: true,
      iconCls: 'fa fa-file-text-o',
      children: [
        {
          path: '/usermange',
          name: '管理员功能',
          component: (resolve) => require(['@/components/UserMana'], resolve),
          meta: {
            keepAlive: false
          }
        },
      ]
    },
  ],
  routes1: [

  ]
})

