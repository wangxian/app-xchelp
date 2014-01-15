define(function(require, exports, module){

  // 好友列表页面
  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store= require("store");

  // --------------
  var MyCaseListModel = Backbone.Model.extend({
  });

  // ---------------------
  var MyCaseListCollection = Backbone.Collection.extend({
    model: MyCaseListModel,

    setPage: function(page,uid)
    {
      this.url = '/user/getMyCase?uid='+ uid + '&pageid=' + page;
      return this;
    },

    initialize: function()
    {
      var userinfo = store.get('userinfo');
      // console.log(userinfo.user_id);
      this.setPage(1,userinfo.user_id);
    }
  });
  var MyCaseList = new MyCaseListCollection();
  window.MyCase = MyCaseList;

  // ---------------------
  var MyCaseViewDef = Backbone.View.extend({
    el: "#my-case",
    events: {
      "tap #my-publish .load-more": "loadMore",
      "tap .friend-list li": "showDetail",
      "touchstart .friend-list li": "touchstart",
      "touchend .friend-list li": "touchcancle",
      "touchcancle .friend-list li": "touchcancle"
    },

    touchstart: function(e) { $(e.currentTarget).addClass('touching'); },
    touchcancle: function(e) { $(e.currentTarget).removeClass('touching'); },
    homeListTemplate: _.template($('#tmpl-case-items').html()),

    initialize: function()
    {
      $.ui.showMask("正在加载案例信息列表...");
      MyCase.on('reset', this.renderMyCase, this);
      var userinfo = store.get('userinfo');
      this.page = 1;
      this.uid = userinfo.user_id;
      this.pull();
    },

    // 拉取数据
    pull: function()
    {
      MyCase.setPage( this.page++,this.uid ).fetch({
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

    renderMyCase: function(list)
    {
      if(list.length === 0 || list.length < 11)
      {
        $("#my-publish .load-more").hide();
        // return false;
      }
      var _data = list.models[0].attributes.body.data;

      var _html = '';
      _.each(_data,function(v,k){
        _html += '<li data-id="' + v.id+'"><img src="http://www.xchelp.com/assets/upload/brand/' +
                        v.photo + '"><p><span class="title">' + 
                        v.title + '</span><span class="developer">' +
                        v.intro + '</span></p></li> ';
      });
      if(_html.length < 1) _html = '<h5 class="no-data">暂无数据！</h5>';
      // console.log(_html);
      this.$el.find(".friend-list").html(_html);
    },

    // when touchstart load more
    loadMore: function()
    {
      this.pull();
    },

    showDetail: function(e)
    {

      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      // alert(_id);

      require.async('./case-detail', function(mod){
        mod.showArticle(_id);
      });
    }

  });

  new MyCaseViewDef();

});