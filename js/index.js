define(function(require, exports, module){

  // Load dependence Moudles
  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store = require('store');

  require.async('./user-login');
  require.async('./user-register');

  var IndexViewDef = Backbone.View.extend({
    'el': '#wrapper',
    events: {
      //用户中心部分
      'click #ucenter': 'isLogin',
      "touchstart #ucenter": "touchstart_ucenter",
      "touchend #ucenter": "touchcancle_ucenter",
      "touchcancle #ucenter": "touchcancle_ucenter",

      //案例
      'click #anli': 'jumpCase',
      "touchstart #anli": "touchstart_anli",
      "touchend #anli": "touchcancle_anli",
      "touchcancle #anli": "touchcancle_anli",

      //零部件
      'click #lingbujian': 'jumpLingbujian',
      "touchstart #lingbujian": "touchstart_lingbujian",
      "touchend #lingbujian": "touchcancle_lingbujian",
      "touchcancle #lingbujian": "touchcancle_lingbujian",

      //维修资料
      'click #ziliao': 'jumpZiliao',
      "touchstart #ziliao": "touchstart_ziliao",
      "touchend #ziliao": "touchcancle_ziliao",
      "touchcancle #ziliao": "touchcancle_ziliao",

      //设置
      'click #setting_module': 'jumpSetting',
      "touchstart #setting_module": "touchstart_setting",
      "touchend #setting_module": "touchcancle_setting",
      "touchcancle #setting_module": "touchcancle_setting",

      //关于
      'click #about_module': 'jumpAbout',
      "touchstart #about_module": "touchstart_about",
      "touchend #about_module": "touchcancle_about",
      "touchcancle #about_module": "touchcancle_about",

      //招聘部分
      "touchstart #job": "touchstart_job",
      "touchend #job": "touchcancle_job",
      "touchcancle #job": "touchcancle_job",
      'click #job': 'jumpJob',

      //技术求助
      "touchstart #tech-help": "touchstart_tech",
      "touchend #tech-help": "touchcancle_tech",
      "touchcancle #tech-help": "touchcancle_tech",
      'click #tech-help': 'jumpTech'

    },

    //给触碰时候追加样式
    touchstart_ucenter: function(e) { $(e.currentTarget).addClass('touch_ucenter'); },
    touchcancle_ucenter: function(e) { $(e.currentTarget).removeClass('touch_ucenter'); },

    touchstart_anli: function(e) { $(e.currentTarget).addClass('touch_anli'); },
    touchcancle_anli: function(e) { $(e.currentTarget).removeClass('touch_anli'); },

    touchstart_lingbujian: function(e) { $(e.currentTarget).addClass('touch_lingbujian'); },
    touchcancle_lingbujian: function(e) { $(e.currentTarget).removeClass('touch_lingbujian'); },

    touchstart_ziliao: function(e) { $(e.currentTarget).addClass('touch_ziliao'); },
    touchcancle_ziliao: function(e) { $(e.currentTarget).removeClass('touch_ziliao'); },

    touchstart_setting: function(e) { $(e.currentTarget).addClass('touch_setting'); },
    touchcancle_setting: function(e) { $(e.currentTarget).removeClass('touch_setting'); },

    touchstart_about: function(e) { $(e.currentTarget).addClass('touch_about'); },
    touchcancle_about: function(e) { $(e.currentTarget).removeClass('touch_about'); },

    touchstart_job: function(e) { $(e.currentTarget).addClass('touch_job'); },
    touchcancle_job: function(e) { $(e.currentTarget).removeClass('touch_job'); },

    touchstart_tech: function(e) { $(e.currentTarget).addClass('touch_tech'); },
    touchcancle_tech: function(e) { $(e.currentTarget).removeClass('touch_tech'); },

    initialize: function()
    {
      setTimeout(function(){
        $.ui.loadContent("#index",false,false,"slide")},
      1000);
    },

    isLogin: function()
    {
      var userinfo = store.get('userinfo');
      // 已登录
      if(userinfo)
      {
        require.async('./user-mypublish');
        require.async('./user-information');
        require.async('./user-homepage');
        require.async('./user-company-info');
        require.async('./user-integral-rules');
        require.async('./user-score');
        require.async('./user-friend');
        require.async('./user-mycase');
        require.async('./user-myseekhelp');
        require.async('./user-interview');
        require.async('./user-apply-position-list');
        require.async('./user-my-collection-case');
        require.async('./user-my-collection-seek');

        $.ui.loadContent("#usercenter",false,false,"fade");
        $.ui.toggleHeaderMenu(true);
      }
      else
      {
        $.ui.loadContent("#login",false,false,"fade");
        $.ui.toggleHeaderMenu(true);
      }
    },

    jumpCase:function()
    {
      // 案例部分
      require.async('./case-main');
      require.async('./case-search');
      require.async('./case-comment');
      require.async('./case-detail');
      require.async('./case-photo');

      $.ui.toggleHeaderMenu(true);
      $.ui.loadContent("#case-home",false,false,"fade");

    },

    jumpLingbujian:function()
    {
      $.ui.popup( { title:"暂时未开放！",
        message:"手机设备零部件模块功能目前正在内部测试，尚未开放！如有需要，请登陆web版！",
        cancelText:"知道了",
        cancelCallback: function(){},
        cancelOnly:true
      });
    },

    jumpTech:function()
    {
      // 求助部分
      require.async('./technical-main');
      require.async('./technical-filter');
      require.async('./technical-detail');
      require.async('./technical-comment');
      require.async('./technical-publishseek');

      $.ui.loadContent("technical-main",false,false,"fade");
      $.ui.toggleHeaderMenu(true);
    },

    jumpZiliao:function()
    {
      $.ui.popup( { title:"暂时未开放！",
        message:"手机维修资料模块功能目前正在内部测试，尚未开放！如有需要，请登陆web版！",
        cancelText:"知道了",
        cancelCallback: function(){},
        cancelOnly:true
      });
      //location.href = './information.html';
    },

    jumpSetting:function()
    {

      require.async('./setting-feedback');
      require.async('./setting-checkversion');

      require.async('./leading');

      $.ui.loadContent("#setting",false,false,"fade");
      $.ui.toggleHeaderMenu(true);
    },

    jumpAbout:function()
    {
      $.ui.loadContent("#about",false,false,"fade");
      $.ui.toggleHeaderMenu(true);
    },

    jumpJob:function()
    {
      $.ui.popup( {
        "title":"暂时未开放！",
        "message":"手机招聘模块功能目前正在内部测试，尚未开放！如有需要，请登陆web版！",
        "cancelText":"知道了",
        "cancelOnly": true
      });
    }

  });

  new IndexViewDef();
});