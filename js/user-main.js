define(function(require, exports, module){

  // -------------------  关注列表
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store = require('store');

  // ---------------------
  var FollowinglistViewDef = Backbone.View.extend({
    el: "#following-list",
    events: {
      "tap #friend-main-followinglist li": "showHomepage",
      // "tap #friend-list .cases-list a": "showDetail"
    },
    followinglistTemplate: _.template($('#tmpl-following-items').html()),

    initialize: function()
    {
      $.ui.showMask("正在加载关注用户列表信息...");
      FollowinglistModel.on('change', this.renderFollowinglist, this);
    },

    showFollowinglist: function(id)
    {
      FollowinglistModel.url = '/user/getFollowinglist?uid='+ id;
      FollowinglistModel.fetch();
    },

    // 个人信息部分
    renderFollowinglist: function(list)
    {
      var data = list.toJSON();
      following_data = data.body.data;
      var following_html = this.followinglistTemplate({"data": following_data});
      $("#friend-main-followinglist").html( following_html );
      $.ui.loadContent("#following-list");
    },

    showHomepage: function(e)
    {
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      // console.log(_id);

      require.async('./user-homepage', function(mod){
        mod.showArticle(_id);
      });
    }

  });

  module.exports = new FollowinglistViewDef();

});