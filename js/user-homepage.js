define(function(require, exports, module){

  // 好友列表页面
  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store = require('store');
  var ui       = require('ui');

  var HomepageModel = new Backbone.Model();

  // 设置关注或者取消关注
  var SetFollowModelDef = Backbone.Model.extend({
    url: "/user/setFollow",
    notAuth: true // 如果不需要对Post 请求做认证，notAuth设置true, 默认false
  });
  var SetFollow = new SetFollowModelDef();

  // ---------------------
  var HomebaseViewDef = Backbone.View.extend({
    el: "#personal-homepage",
    events: {
      "tap #to-fans-list ": "showFanslist",
      "tap #to-following-list ": "showFollowing",
      "tap #to-information ": "showInformation",
      "tap #isfollow": "setFollow",
      "tap #friend-list-home li": "alertmessage",

    },
    homeBaseTemplate: _.template($('#tmpl-homepage-base').html()),

    homeListTemplate: _.template($('#tmpl-homepage-weibo-items').html()),

    initialize: function()
    {
      $.ui.showMask("正在加载用户信息...");
      HomepageModel.on('change', this.renderHomepage, this);
      //做后退标记
      store.set('this_location','personal-homepage');

    },

    alertmessage:function()
    {
      $.ui.popup({title:"系统提示",
        message:'客户端暂不支持查看微博详情，请登陆web版！',
        cancelText:"知道了",
        cancelOnly:true});
    },

    showFanslist: function(e)
    {

      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      // console.log(_id);

      require.async('./user-fans', function(mod){
        mod.showFanslist(_id);
      });
    },

    showFollowing:function(e)
    {
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      // console.log(_id);

      require.async('./user-following', function(mod){
        mod.showFollowinglist(_id);
      });

    },

    showInformation:function(e)
    {
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      // console.log(_id);

      require.async('./user-information', function(mod){
        mod.showUserInformation(_id);
      });

    },

    showArticle: function(id)
    {
      // 客户端登陆用户id
      var userinfo = store.get('userinfo');
      my_uid = userinfo.user_id;

      HomepageModel.url = '/user/getMyHomepage?uid='+ id + '&my_uid='+my_uid;

      HomepageModel.fetch();
      // console.log(HomepageModel);
    },

    // 个人信息部分
    renderHomepage: function(list)
    {

      var data = list.toJSON();
      var personal = data.body.personal;
      var userinfo = store.get('userinfo');
      //给模板追加用是否可编辑个人信息以及是否可以看到收藏等权限的值
      if(userinfo.user_id == personal.uid) personal.auth = 1;
      else personal.auth = 0;

      var personal_html = this.homeBaseTemplate({"data": personal});
      $("#homepage-base").html( personal_html );

      weibo = data.body.weibo;
      console.log(weibo);
      var weibo_html = this.homeListTemplate({"data": weibo});
      // console.log(weibo_html);
      $("#friend-list-home").html( weibo_html );

      //微博总数的数字
      $("#personal-homepage .weibo_number").text(data.body.personal.weibocount + "条微博");

      $.ui.loadContent("#personal-homepage");
      //做后退标记
      store.set('this_location','personal-homepage');
    },

    // login button
    setFollow: function(e)
    {
      var it = this;

      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      transdata = _id.split("-");

      // 关注关系 - 对方id
      follow_user_id = parseInt(transdata['1']);
      // 关注关系状态，1为已经关注，0为未关注
      follow_status = parseInt(transdata['0']);

      ui.loading.show();
      var userinfo = store.get('userinfo');
      var data = {"password": userinfo.password,"user_id":userinfo.user_id,"follow_user_id":follow_user_id,"status":follow_status};
      // console.log(data);

      SetFollow.save(data, {
        "error": function(model, xhr, options)
        {
          ui.alert("系统错误！");
          ui.loading.hide();
        },
        "success": function(model, response)
        {
          // ui.loading.hide();
          if (response.head.code !== 200)
          {
            $.ui.showMask("关注添加成功");
            $.ui.loadContent("#personal-homepage");
          }
          else if (response.head.code !== 300)
          {
            $.ui.showMask("关注移除成功");
            $.ui.loadContent("#personal-homepage");
          }
          else
          {
            ui.alert(response.head.msg);
          }
        }
      });

      this.showArticle(follow_user_id);
    }

  });

  module.exports = new HomebaseViewDef();

});