define(function(require, exports, module){

  var _        = require('underscore');
  var Backbone = require('backbone');
  var store    = require('store');
  var ui    = require('ui');

  var TechnicalListModel = Backbone.Model.extend({
  });

  var TechnicalListCollection = Backbone.Collection.extend({
    model: TechnicalListModel,

    setPage: function(page)
    {
      this.url = '/seek/getSeekPageList/'+ page;
      return this;
    },

    initialize: function()
    {
      this.setPage(1);
    }
  });

  var TechnicalList = new TechnicalListCollection();
  window.TechnicalList = TechnicalList;

  var PageViewDef = Backbone.View.extend({
    el: "#jQUi",
    events: {
      "tap #technical-main .load-more": "loadMore",
      "tap #technical-main .tech-list li": "showDetail",
      "touchstart .tech-list li": "touchstart",
      "touchend .tech-list li": "touchcancle",
      "touchcancle .tech-list li": "touchcancle",
      // 页脚
      "tap #to-center": "tocenter",
      "tap #to-friend": "tofriend",
      "tap #to-help": "tohelp",
      "tap #to-collection": "Redirectcollection",
      //跳转至发布页面
      'tap #publishseek': 'tohelp'
    },
    touchstart: function(e) { $(e.currentTarget).addClass('touching'); },
    touchcancle: function(e) { $(e.currentTarget).removeClass('touching'); },

    homeListTemplate: _.template($('#tmpl-tech-items').html()),

    initialize: function()
    {
      $.ui.showMask("正在加载...");
      TechnicalList.on('reset', this.renderTechnicalList, this);

      this.page = 1;
      this.pull();
    },

    tocenter: function()
    {
      var userinfo = store.get('userinfo');

      if(userinfo)
      {
        $.ui.loadContent("#usercenter",false,false,"fade");
      }
      else
      {
        $.ui.loadContent("#login");
      }
    },

    tofriend: function()
    {
      var userinfo = store.get('userinfo');

      if(userinfo)
      {
        $.ui.loadContent("#friend-list",false,false,"fade");
      }
      else
      {
        $.ui.loadContent("#login");
      }
    },

    tohelp: function()
    {
      var userinfo = store.get('userinfo');

      if(userinfo)
      {
        $.ui.loadContent("#publish-tech",false,false,"fade");
      }
      else
      {
        $.ui.popup( { title:"登陆提示！",
          message:"如须继续查看求助回复详情，请登陆！",
          cancelText:"现在登陆",
          cancelCallback: function(){
            $.ui.loadContent("#login");
          },
          doneText:"暂不登陆",
          doneCallback: function(){},
          cancelOnly:false
        });
      }
    },

    Redirectcollection: function()
    {
      var userinfo = store.get('userinfo');

      if(userinfo) 
      {
        $.ui.loadContent("#my-collection",false,false,"fade");
      }
      else
      { 
        ui.alert('您尚未登陆，请先登录！');
        $.ui.loadContent("#login");
      }
    },

    // 拉取数据
    pull: function()
    {
      TechnicalList.setPage( this.page++ ).fetch({
        success: function(){ $.ui.hideMask(); },
        error: function(){
          $.ui.hideMask();
          $.ui.popup({
            "title": "错误信息",
            "message": "服务器异常, 或许数据解析错误，请稍候重试！",
            "doneText": "确认",
            "doneCallback": function(){},
            "cancelText":"取消"
          });
        }
      });
    },

    // 渲染首页列表
    renderTechnicalList: function(list)
    {
      list = list.toJSON();
      //console.log(list);
      if(list.length === 0 || list.length < 10)
      {
        $("#technical-main .load-more").hide();
      }
      //console.log(list);
      var _html = this.homeListTemplate({"data": list});
      $("#tech-list-main").append( _html );
    },

    loadMore: function()
    {
      this.pull();
    },

    showDetail: function(e)
    {
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');

      require.async('./technical-detail', function(mod){
        mod.showArticle(_id);
      });
    }
  });

  new PageViewDef();
});