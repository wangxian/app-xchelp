define(function(require, exports, module){
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store = require('store');
  var ui       = require('ui');

  var CaseDetail = new Backbone.Model({});
  var AddCollectionModelDef = Backbone.Model.extend({
    url: "/public/addCollectInfo",
    notAuth: true // 如果不需要对Post 请求做认证，notAuth设置true, 默认false
  });
  var AddCollection = new AddCollectionModelDef();

  var PageViewDef = Backbone.View.extend({
    el: "#jQUi",
    events: {
      'tap #submit_comment': "btnComment",
      'tap .collection':"collection",
      "tap #refresh": "refreshdetail",
      "tap #pingluntodetail": "refreshdetail",
      "tap #detail-back": "backmain"
    },

    CaseDetailTemplate: _.template( $('#tmpl-cases-detail').html() ),

    initialize: function()
    {
      CaseDetail.on('change', this.renderCaseDetail, this);
    },

    backmain:function()
    {
      $.ui.goBack(1);
    },

    refreshdetail:function()
    {
      this.showArticle(store.get('detailCase').article.id);
    },

    showDetail:function(case_id)
    {
      this.showArticle(case_id);
    },

    // 收藏信息
    collection:function()
    {
      var userinfo = store.get('userinfo');

      if(userinfo)
      {
        // 用户id
        user_id =  userinfo.user_id;
        // 案例id
        case_id = String(store.get('detailCase').article.id);
        var _data = {"app_id": case_id, "user_id": user_id, "type_id":"1"};
        AddCollection.save(_data, {
          "error": function(model, xhr, options)
          {
            $.ui.popup({
              "title": "错误信息",
              "message": "数据未提交成功",
              "doneText": "确认",
              "doneCallback": function(){},
              "cancelText":"取消"
            });
            ui.loading.hide();
          },
          "success": function(model, response)
          {
            $.ui.popup({title:"系统提示",
              message:response.head.msg,
              cancelText:"知道了",
              cancelOnly:true});
          }
        });
      }
      else
      {
        $.ui.loadContent("#login");
      }
    },

    showArticle: function(id)
    {
      //console.log(id);
      $.ui.loadContent("#cases-detail", true, false, "fade");
      CaseDetail.url = '/cases/getIdCase/'+ id;
      CaseDetail.fetch();
      // 跳转过来之后先给  che-list-main 的 id 给重置成 加载状态
      $("#che-list-main").html('<div class="current"><p><img src="res/img/loading-a.gif"><span>正在加载中...</span></p></div>');

    },

    // 渲染详细页面
    renderCaseDetail: function(model)
    {
      var _data = model.toJSON();
      var _html = this.CaseDetailTemplate(_data);

      $("#che-list-main").html(_html);

      //拿进入之前的位置，之后返回时候进行比对
      //小米不支持 #main .jqmScrollPanel 拿元素
      if(store.get('back_location') == 1)
      {
        var locations_main = $("#case-home .jqmScrollPanel").attr('style');
        var pattern = /translate3d\(.+px\)/;
        if(locations_main == undefined)
        {
          _data.locations = 'undefined';
        }
        else
        {
          var temp = locations_main.match(pattern);
          if(temp)
          {
            _data.locations = temp[0];
          }
          else
          {
            _data.locations = 'undefined';
          }
        }
      }
      else if(store.get('back_location') == 2)
      {
        var locations_list = $("#case-che-list .jqmScrollPanel").attr('style');
        var pattern = /translate3d\(.+px\)/;
        if(locations_list == undefined)
        {
          _data.locations = 'undefined';
        }
        else
        {
          var temp = locations_list.match(pattern);
          if(temp)
          {
            _data.locations = temp[0];
          }
          else
          {
            _data.locations = 'undefined';
          }
        }
      }
      else if(store.get('back_location') == 3)
      {
        var locations_major = $("#case-major .jqmScrollPanel").attr('style');
        var pattern = /translate3d\(.+px\)/;
        if(locations_major == undefined)
        {
          _data.locations = 'undefined';
        }
        else
        {
          var temp = locations_major.match(pattern);
          if(temp)
          {
            _data.locations = temp[0];
          }
          else
          {
            _data.locations = 'undefined';
          }
        }
      }
      //我收藏的案例进入
      else if(store.get('back_location') == 4)
      {
        var locations_collection_case = $("#my-collection-case .jqmScrollPanel").attr('style');
        var pattern = /translate3d\(.+px\)/;
        if(locations_collection_case == undefined)
        {
          _data.locations = 'undefined';
        }
        else
        {
          var temp = locations_collection_case.match(pattern);
          if(temp)
          {
            _data.locations = temp[0];
          }
          else
          {
            _data.locations = 'undefined';
          }
        }
      }
      store.set("detailCase",_data);
      //console.log(_data);
      $.ui.updateBadge('#jumpComment',_data.comments_count,'tl');
    },

    //插入评论
    InsertComment: function(_reply,_case_id)
    {
      var userinfo = store.get('userinfo');
      uid = userinfo.user_id;

      var opts={
        type:"POST",
        success:function(data){
          if (data == '1'){
            $.ui.showMask("发布成功");
            setTimeout(function(){
              $.ui.hideMask();
            }, 800);

            $("#reply_comment").val("");
          }
        },
        url:"http://api.tiaoloula.com/cases/insertComment",
        data:{cases_id:_case_id , user_id:uid, reply_content: _reply}
      };

      $.ajax(opts);
      //发布成功后重新show页面

      //this.showArticle(_case_id);
      //$.ui.loadContent("#pinglun");
      require.async('./case-comment', function(mod){
        mod.detailJumpComment(_case_id);
      });

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

    btnComment: function(e)
    {
      var userinfo = store.get('userinfo');
      if(!userinfo)
      {
        $.ui.popup( { title:"登陆提示！",
          message:"登陆后才可以进行评论！",
          cancelText:"现在登陆",
          cancelCallback: function(){
            location.href='./usercenter.html#login';
          },
          doneText:"暂不登陆",
          doneCallback: function(){},
          cancelOnly:false
        });
      }

      var _e = $(e.currentTarget);
      //回复内容
      var _reply = _e.parent().find('#reply_comment').val();
      //评论案例的id
      var _case_id = store.get('detailCase').article.id;
      //过滤空格
      _reply = this.trimSpace(_reply);
      if(_reply == '')
      {
        $.ui.popup( { title:"评论提示！",
          message:"写点什么吧，评论是不可为空的！",
          cancelText:"好的",
          cancelCallback: function(){
          },
          cancelOnly:true
        });

        $("#reply_comment").val("");
        document.getElementById("reply_comment").focus();
        return false;
      }
      this.InsertComment(_reply,_case_id);
    }
    //使用 scroller 的时候安卓下面会显示拖拽到最下方往上的时候反白
//    Scroller:function()
//    {
//      var myScroller;
//      $.ui.ready(function(){
//      myScroller=$("#cases-detail").scroller();
//      myScroller.addInfinite();
//      $("#cases-detail").css("overflow","auto");
//      });
//    }
  });
  module.exports = new PageViewDef();
});