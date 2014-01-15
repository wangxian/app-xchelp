define(function(require, exports, module){
  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store    = require('store');
  var ui       = require('ui');
  var md5      = require('md5');

  var AddCollectInfoModelDef = Backbone.Model.extend({
    url: "/public/addCollectInfo",
    notAuth: true // 如果不需要对Post 请求做认证，notAuth设置true, 默认false
  });
  var AddCollect = new AddCollectInfoModelDef();

  //求助信息回复模型
  var SeekReplyModelDef = Backbone.Model.extend({
    url: "/seek/insertSeekReply",
    notAuth: true // 如果不需要对Post 请求做认证，notAuth设置true, 默认false
  });
  var SeekReplyModel = new SeekReplyModelDef();


  var SeekDetail = new Backbone.Model();

  var PageViewDef = Backbone.View.extend({
    el: "#jQUi",

    events: {
      //'tap #submit_comment': "btnComment",
      'tap .collection-a':"collection",

      'tap #todiscuss': 'showDiscuss',

      'tap #refresh_tech_detail': 'refresh_tech_detail',
      "tap #toTechDetail": "refresh_tech_detail",

      'tap #tech_first_detail_to_user': 'showUserDetail',
      'tap #tech_other_detail_to_user': 'showUserDetail'

    },

    SeekDetailTemplate: _.template( $('#tmpl-tech-detail').html() ),

    initialize: function()
    {
      SeekDetail.on('change', this.renderSeekDetail, this);
      // $.ui.showMask("正在加载...");
    },

    // 收藏信息
    collection:function()
    {
      // 用户id
      var user_id =  String(store.get('userinfo').user_id);
      // 求助id
      var tech_id = String(store.get('current_tech_info').id);

      var _data = {"app_id": tech_id, "user_id": user_id, "type_id":"3"};

      AddCollect.save(_data, {
        "error": function(model, xhr, options)
        {
          ui.alert("收藏数据提交失败");
          ui.loading.hide();
        },
        "success": function(model, response)
        {
          $.ui.popup({title:"系统提示",
            message:response.head.msg,
            cancelText:"确定",
            cancelOnly:true});
        }
      });
    },

    showArticle: function(id)
    {
      $.ui.loadContent("#tech-detail");
      $("#tech-detail-info").html('<div class="current"><p><img src="res/img/loading-a.gif"><span>正在加载中...</span></p></div>');

      var current_tech_info = store.get('current_tech_info');
      if(store.get('userinfo'))
      {
        if(id != '')
        {
          SeekDetail.url = '/seek/getIdSeek/'+ id +'/'+store.get('userinfo').user_id;
        }
        else
        {
          SeekDetail.url = '/seek/getIdSeek/'+ current_tech_info.id +'/'+store.get('userinfo').user_id;
        }
      }
      else
      {
        if(id != '')
        {
          SeekDetail.url = '/seek/getIdSeek/'+ id +'/0';
        }
        else
        {
          SeekDetail.url = '/seek/getIdSeek/'+ current_tech_info.id +'/0';
        }
      }
      SeekDetail.fetch();
      //做后退标记
      store.set('this_location','technical-detail');
    },

    // 渲染详细页面
    renderSeekDetail: function(model)
    {
      var _data = model.toJSON();
//      console.log(_data);
      var _html = this.SeekDetailTemplate(_data);

      $('#tech-detail .title-number').text( _data.comments_count );

      $("#tech-detail-info").html(_html);
      //当前求助信息离线存储，方便界面跳回来去时候用
      store.set('current_tech_info', _data);
//      console.log(_data);
      if(!model)
      {
        var current_tech_info = store.get('current_tech_info');
        $("#todiscuss").text(current_tech_info.rows+'回复');
      }
      else
      {
        $("#todiscuss").text(_data.rows+'回复');
      }

      if(_data['is_solve'] == 1)
      {
        $("#reply_comment").attr("disabled","disabled");
        $("#reply_comment").attr('value','已解决，不可回复！');
      }

    },

    refresh_tech_detail: function()
    {
      var current_tech_info = store.get('current_tech_info');
      //console.log(current_tech_info);
      this.showArticle(current_tech_info.id);
    },

    //过滤评论内容中的空格
    trimSpace: function(string)
    {
      var temp = "";
      string = '' + string;
      splitstring = string.split(" ");
      for(i = 0; i < splitstring.length; i++)
      {
        temp += splitstring[i];
        return temp;
      }
    },

    //快速回答
//    btnComment: function()
//    {
//      var userinfo = store.get('userinfo');
//      if(!userinfo)
//      {
//        $.ui.popup( { title:"登陆提示！",
//          message:"登陆后才可以进行评论！",
//          cancelText:"现在登陆",
//          cancelCallback: function(){
//            $.ui.loadContent("#login");
//          },
//          doneText:"暂不登陆",
//          doneCallback: function(){},
//          cancelOnly:false
//        });
//      }
//      //回复内容
//      var _reply = $('#reply_comment').val();
//      //过滤空格
//      _reply = this.trimSpace(_reply);
//      if(_reply == '')
//      {
//        $.ui.popup( { title:"评论提示！",
//          message:"写点什么吧，评论是不可为空的！",
//          cancelText:"好的",
//          cancelCallback: function(){
//          },
//          cancelOnly:true
//        });
//
//        $("#reply_comment").val("");
//        document.getElementById("reply_comment").focus();
//        return false;
//      }
//
//      // 回复所需数据： 1）回复的求助信息主id   2）用户id
//      // 3）add_type，0为第一次回复，4为后面的回复  4）第一次回复的id，如果此时是第一次，此处为o
//      // 5）回复内容
//      var insertdata = {"reply_id":store.get('current_tech_info').id,
//                        "user_id":store.get('userinfo').user_id,
//                        "add_type":4,
//                        "type":_first_reply_id,
//                        "reply_content":_reply};
//
//      var _data = insertdata;
//      //console.log(_data);
//      //return false;
//      SeekReplyModel.save(_data, {
//        "error": function(model, xhr, options)
//        {
//          ui.alert("系统错误！");ui.loading.hide();
//        },
//        "success": function(model, response)
//        {
//          ui.loading.hide();
//          if (response.head.code !== 200) { ui.alert( response.head.msg ); }
//          else
//          {
//            $.ui.showMask('信息回复成功！');
//            setTimeout(
//              function(){$.ui.loadContent("#answer-list",false,false,"fade");
//                SeekComment.url = '/seek/replySeekList/'+ store.get('current_tech_info').id;
//                SeekComment.fetch();}, 300);
//          }
//        }
//      });
//
//      this.refresh_tech_detail();
//    },

    //显示评论
    showDiscuss:function()
    {
      if(store.get("userinfo"))
      {
        var current_tech_info = store.get('current_tech_info');
        require.async('./technical-comment', function(mod){
          mod.showComment(current_tech_info.id);
        });
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

    showUserDetail: function(e)
    {
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      // console.log(_id);

      require.async('./user-homepage', function(mod){
        mod.showArticle(_id);
      });
    }

  });

  module.exports = new PageViewDef();

});