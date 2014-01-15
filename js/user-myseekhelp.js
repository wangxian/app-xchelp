define(function(require, exports, module){

  // 我的求助界面
  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store = require('store');

  // --------------
  var MySeekhelpListModel = Backbone.Model.extend({
  });

  // ---------------------
  var MySeekhelpListCollection = Backbone.Collection.extend({
    model: MySeekhelpListModel,

    setPage: function(page,uid)
    {
      this.url = '/user/getMySeekhelp?uid='+ uid + '&pageid=' + page;
      return this;
    },

    initialize: function()
    {
      var userinfo = store.get('userinfo');
      // console.log(userinfo.user_id);
      this.setPage(1,userinfo.user_id);
    }
  });
  var MySeekhelpList = new MySeekhelpListCollection();
  window.MySeekhelp = MySeekhelpList;

  // ---------------------
  var MySeekhelpViewDef = Backbone.View.extend({
    el: "#my-help",
    events: {
      //"tap #my-help .load-more": "loadMore",
      "tap #seekhelp-main li": "showMyDetail",
      "touchstart #seekhelp-main li": "touchstart",
      "touchend #seekhelp-main li": "touchcancle",
      "touchcancle #seekhelp-main li": "touchcancle"

    },
    touchstart: function(e) { $(e.currentTarget).addClass('touching'); },
    touchcancle: function(e) { $(e.currentTarget).removeClass('touching'); },
    homeMySeekListTemplate: _.template($('#tmpl-tech-items').html()),

    initialize: function()
    {
      $.ui.showMask("正在加载求助内容列表...");
      MySeekhelp.on('reset', this.renderMySeekhelp, this);

      this.page = 1;
      var userinfo = store.get('userinfo');
      // console.log(userinfo.user_id);
      this.uid = userinfo.user_id;
      this.pull();
    },

    // 拉取数据
    pull: function()
    {
      MySeekhelp.setPage( this.page++,this.uid ).fetch({
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

    renderMySeekhelp: function(list)
    {
      if(list.length === 0 || list.length < 11)
      {
        $("#my-help .load-more").hide();
        // return false;
      }

      // console.log(list.toJSON()[0].body.data);
      var _data = list.toJSON()[0].body.data;
      var _html = this.homeMySeekListTemplate({"data": _data});
      //console.log(_data);
      //$("#seekhelp-main").empty();
      $("#seekhelp-main ul").append( _html );
    },

    showMyDetail: function(e)
    {
      var _e = $(e.currentTarget);
      //console.log(_e);
      var _id = _e.attr('data-id');
      require.async('./technical-detail', function(mod){
        mod.showArticle(_id);
      });
    }

  });

  new MySeekhelpViewDef();

});