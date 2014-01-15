define(function(require, exports, module){

  var _        = require('underscore');
  var Backbone = require('backbone');
  var store = require('store');
  var ui = require('ui');

  var SeekComment = new Backbone.Model();

  //求助信息回复模型
  var SeekReplyModelDef = Backbone.Model.extend({
    url: "/seek/insertSeekReply",
    notAuth: true // 如果不需要对Post 请求做认证，notAuth设置true, 默认false
  });
  var SeekReplyModel = new SeekReplyModelDef();

  //设置求助为最佳模型
  var SetReplyModelDef = Backbone.Model.extend({
    url: "/seek/setSeekStatus",
    notAuth: true // 如果不需要对Post 请求做认证，notAuth设置true, 默认false
  });
  var SetReplyModel = new SetReplyModelDef();

  var CommentViewDef = Backbone.View.extend({
    el: "#jQUi",
    events: {
      //跳转至用户个人主页
      "tap #comment_to_user": "showDetail",
      "tap #comment_to_top_user": "showDetail",
      "tap #continue-answer": "showAnswerTextarea",

      //发布回复数据
      "tap #reply_seek_button":"reply_seek",
      //从详情界面继续回答跳转至回复框界面
      'tap #detail_continue_textarea': "detail_continue_textarea",
      //从详情界面首次回答去回复框界面
      'tap #detail_first_textarea': "detail_first_textarea",
      //从求助回复列表的上方的“我要回答”按钮点击进入
      'tap #comment-my-first-answer': "comment_my_first_answer",
      //从求助列表页面的求助身份用户的“继续追问”按钮点击进入
      'tap #comment-my-question': "comment_my_question",
      //从求助列表页面的回答用户身份的“继续回答”按钮点击进入
      'tap #comment-my-continue-answer': "comment_my_continue_answer",

      //继续追问数据
      "tap #continue-question": "showAnswerTextarea",

      //跳至回复输入框界面 --- 求助详情之我要回答按钮
      "tap #tech-my-answer": "showAnswerTextarea",

      //设置为最佳答案
      "tap #set-seek-status": "set_seek_status"
    },

    //求助回复列表
    SeekCommentTemplate: _.template($('#tech-tpml-comment').html()),
    //求助回复标题
    SeekCommentTitleTemplate:_.template($('#tech-tpml-comment-title').html()),

    initialize: function()
    {
      SeekComment.on('change', this.renderComment, this);
    },

    showComment: function(id)
    {
      //曝露全局求助id
      if(id != '')
      {
        seek_id = id;
        SeekComment.url = '/seek/replySeekList/'+ id;
      }
      else
      {
        var current_tech_info = store.get('current_tech_info');
        SeekComment.url = '/seek/replySeekList/'+ current_tech_info.id;
      }

      SeekComment.fetch();
    },

    renderComment: function(model)
    {
      var _data = model.toJSON();
      //console.log(_data.body.is_solve);
      var userinfo = store.get('userinfo');
      _data.body.userinfo = userinfo;
      $.ui.loadContent("#answer-list");

      //如果没有第一组评论数据
      if(_data.body.first_reply.length == 0)
      {
        _html = '<h5 class="no-data">此求助信息暂无相关评论！</h5>';
        //如果求职信息属于本人
        if(_data.body.car_info[0].user_id == userinfo.user_id)
        {
          _data.body.car_info[0].isdisable = 0;
        }
        else
        {
          _data.body.car_info[0].isdisable = 1;
        }
        //console.log(_data.body.car_info[0]);
      }
      else
      {
        // 检查是否应该给回答问题用户回复权限
        // isdisable为1时，没有继续回答的按钮，为0时候可以继续回答
        disable_user = _data.body.car_info[0].disable_user.split(',');
        var user_id = userinfo.user_id;
        var temp = false;
        for (var i = 0; i < disable_user.length; i++) {
          if (disable_user[i] == user_id) {
            temp = true;break;
          }
        }
        if (temp) _data.body.isdisable = 1;
        else _data.body.isdisable = 0;

        //求助者是否可追加提问以及是否可设置为最佳答案，由服务器端的 master_disable设定
        //master_disable为1时，有按钮   master_disable为0时，无按钮
        _data.body.car_info[0].my_id = userinfo.user_id;
        //该用户如果从未回答过，那么就显示我要回答的上方按钮
        //console.log(_data.body.first_reply[0]['user_id']);
        var temp2 = false;
        for (var ii = 0; ii < _data.body.first_reply.length; ii++) {
          if (_data.body.first_reply[ii]['user_id'] == user_id) {
            temp2 = true;break;
          }
        }
        //该用户如果从未回答过，而且不是求助者自己，那么就显示我要回答的上方按钮
        if (!temp2 && _data.body.car_info[0].user_id != _data.body.car_info[0].my_id)
          _data.body.car_info[0].isdisable = 1;
        else
          _data.body.car_info[0].isdisable = 0;

        if(_data.body.is_solve == 1) _data.body.car_info[0].is_solve = 1;
        else _data.body.car_info[0].is_solve = 0;

        //console.log(_data.body.car_info[0]);
        var _html = this.SeekCommentTemplate({"data": _data});
      }
      var _title = this.SeekCommentTitleTemplate({"data": _data.body.car_info[0]});

      //标题
      $("#question-title").empty();
      $("#question-title").append(_title);
      //回复列表
      $("#comment-list").empty();
      $("#comment-list").append(_html);
      //斑马线
      if(_data.body.is_solve == 1)
      {
        $("#comment-list div.answer-list").eq(1).addClass('gray-bg');
        $("#comment-list div.answer-list").eq(3).addClass('gray-bg');
        $("#comment-list div.answer-list").eq(5).addClass('gray-bg');
      }
      else
      {
        $("#comment-list div.answer-list").eq(0).addClass('gray-bg');
        $("#comment-list div.answer-list").eq(2).addClass('gray-bg');
        $("#comment-list div.answer-list").eq(4).addClass('gray-bg');
      }

    },

    showDetail: function(e)
    {
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      // console.log(_id);

      require.async('./user-homepage', function(mod){
        mod.showArticle(_id);
      });
    },

    //从详情界面的用户继续回答按钮位置进入
    detail_continue_textarea:function(e)
    {
      var _e = $(e.currentTarget);
      var _reply_id = _e.attr('data-id');
      var _first_reply_id = _e.attr('data-val');
      //reply_id：回复求助问题id；user_id:回复的用户id；add_type = 4，继续回答；type：回复该求助的首条回复的id
      var _insertdata = {"reply_id":_reply_id,"user_id":store.get('userinfo').user_id,"add_type":4,"type":_first_reply_id};
      //console.log(_insertdata);
      $.ui.loadContent("#answer");
      store.set('insertTechData',_insertdata);
    },

    //详情界面的首次回答进入回复框界面
    detail_first_textarea:function(e)
    {
      var _e = $(e.currentTarget);
      var _reply_id = _e.attr('data-id');
      //reply_id：回复求助问题id；user_id:回复的用户id；add_type = 4，继续回答；type：回复该求助的首条回复的id
      var _insertdata = {"reply_id":_reply_id,"user_id":store.get('userinfo').user_id,"add_type":0,"type":'0'};
      console.log(_insertdata);
      $.ui.loadContent("#answer");
      store.set('insertTechData',_insertdata);
    },

    //从评论列表界面上方的我来回答按钮位置进入
    comment_my_first_answer:function(e)
    {
      var _e = $(e.currentTarget);
      var _reply_id = _e.attr('data-id');
      //reply_id：回复求助问题id；user_id:回复的用户id；add_type = 4，继续回答；type：回复该求助的首条回复的id
      var _insertdata = {"reply_id":_reply_id,"user_id":store.get('userinfo').user_id,"add_type":0,"type":'0'};
      console.log(_insertdata);
      $.ui.loadContent("#answer");
      store.set('insertTechData',_insertdata);
    },

    //从评论列表界面页面的继续追问点击进入
    comment_my_question:function(e)
    {
      var _e = $(e.currentTarget);
      var _type_id = _e.attr('data-id');
      var _reply_id = _e.attr('data-val');
      //reply_id：回复求助问题id；user_id:回复的用户id；add_type = 3，继续追问；type：回复该求助的首条回复的id
      var _insertdata = {"reply_id":_reply_id,"user_id":store.get('userinfo').user_id,"add_type":3,"type":_type_id};
      //console.log(_insertdata);
      $.ui.loadContent("#answer");
      store.set('insertTechData',_insertdata);
    },

    comment_my_continue_answer:function(e)
    {
      var _e = $(e.currentTarget);
      var _type_id = _e.attr('data-id');
      var _reply_id = _e.attr('data-val');
      //reply_id：回复求助问题id；user_id:回复的用户id；add_type = 4，继续回答；type：回复该求助的首条回复的id
      var _insertdata = {"reply_id":_reply_id,"user_id":store.get('userinfo').user_id,"add_type":4,"type":_type_id};
      //console.log(_insertdata);
      $.ui.loadContent("#answer");
      store.set('insertTechData',_insertdata);
    },

    showAnswerTextarea:function(e)
    {
      //用户未登录时，跳转到登陆
      if(!store.get('userinfo'))
      {
        $.ui.popup( { title:"系统提示！",
          message:"登陆后方可回复用户求助！",
          cancelText:"登陆",
          cancelCallback: function(){
            $.ui.loadContent('#login',false,false,"fade");
          },
          doneText:"暂不",
          doneCallback: function(){},
          cancelOnly:false
        });
      }
      else
      {
        // 检查用户是第一次回复还是继续回答，还是追问，还是首次回答
        // 值 _add_type，0为回答者首次回答，3为求助者追问，4为回答者
        // published_user_list为所有发布该条回复的用户id
        var published_user_list = store.get('current_tech_info').published_user_list;
        //0为全新回复,4为继续回复
        _add_type = 0;
        for (var i=0;i<published_user_list.length;i++)
        {
          if(store.get('userinfo').user_id == published_user_list[i])
          {
            _add_type = 3;break;

          }
        }

        var _e = $(e.currentTarget);
        //console.log('本人是全新发布还是继续回复：'+_add_type);
        if(_e.attr('data-val') == 'quick_answer_textarea' || _e.attr('data-val') == 'first_answer_textarea')
        {
          first_seek_reply_id = 0;
        }
        else
        {
          first_seek_reply_id = _e.attr('data-id');
        }
        console.log("回复原帖id："+first_seek_reply_id);
        $.ui.loadContent("#answer",false,false,"fade");
      }

    },

    //设置最佳答案
    set_seek_status:function(e)
    {
      //求助回答第一个主id
      var _e = $(e.currentTarget);
      var _seekhelp_id = _e.attr('data-id');
      var _user_id = _e.attr('data-val');

      $.ui.popup( { title:"确认为最佳答案！",
        message:"确认之后状态不可更改！",
        cancelText:"继续",
        cancelCallback: function(){
          ui.loading.show();
          var _data = {"seekhelp_id":_seekhelp_id,"seekhelp_main_id":seekhelp_main_id,"user_id":_user_id};
          SetReplyModel.save(_data, {
            "error": function(model, xhr, options)
            {
              ui.alert("系统错误！");ui.loading.hide();
            },
            "success": function(model, response)
            {
              ui.loading.hide();
              if (response.head.code !== 200) { ui.alert( response.head.msg ); }
              else $.ui.showMask('最佳回复设置成功！');
            }
          });
        },
        doneText:"取消",
        doneCallback: function(){},
        cancelOnly:false
      });
    },
    // 回复求助信息
    reply_seek: function()
    {
      // 回复求助内容
      var _reply_content = $('#reply_content').val();
      if(_reply_content == '')
      {
        ui.alert('回复内容必填！');
        document.getElementById("reply_content").focus();
        return false;
      }
      var insertData = store.get('insertTechData');
      insertData['reply_content'] = _reply_content;

      ui.loading.show();
      var _data = insertData;
      //console.log(_data);
      //return false;
      SeekReplyModel.save(_data, {
        "error": function(model, xhr, options)
        {
          ui.alert("系统错误！");ui.loading.hide();
        },
        "success": function(model, response)
        {
          ui.loading.hide();
          if (response.head.code !== 200) { ui.alert( response.head.msg ); }
          else
          {
            $.ui.showMask('信息回复成功！');
            setTimeout(
              function(){$.ui.loadContent("#answer-list",false,false,"fade");
                         SeekComment.url = '/seek/replySeekList/'+ store.get('current_tech_info').id;
                         SeekComment.fetch();}, 300);
          }
        }
      });
    }
  });
  module.exports = new CommentViewDef();
});