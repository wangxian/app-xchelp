define(function(require, exports, module){

  var _        = require('underscore');
  var Backbone = require('backbone');
  var store = require('store');

  var userinfo = store.get('userinfo');
  // 所有案例
  var CasesListModel = Backbone.Model.extend({});
  // 所有案例
  var CasesListCollection = Backbone.Collection.extend({
    model: CasesListModel,
    setPage: function(page)
    {
      this.url = '/cases/getCasesPageList/'+ page;
      return this;
    },

    initialize: function()
    {
      this.setPage(1);
    }
  });
  var CasesList = new CasesListCollection();
  window.CasesList = CasesList;

  if(userinfo)
  {
    // 主修案例
    var MajorCasesListModel = Backbone.Model.extend({});
    // 主修案例
    var MajorCasesListCollection = Backbone.Collection.extend({
      model: MajorCasesListModel,
      setPage: function(page)
      {
        this.url = '/cases/getUserMajorCases/'+ userinfo['user_id'] + '/' + page;
        return this;
      },
      initialize: function()
      {
        this.setPage(1);
      }
    });
    var MajorCasesList = new MajorCasesListCollection();
    window.MajorCasesList = MajorCasesList;
  }

  var PageViewDef = Backbone.View.extend({
    el: "#jQUi",
    events: {
      "tap #case-home .load-more": "loadMore",
      //筛选用户主修车型案例
      "tap #major-cases": "showMajorCases",
      //所有案例
      //"tap #all-cases": "showAllCases",
      "tap #all-cases":"showMainCases",

      "tap #case-major .cases-list ul li": "showMajorDetail",
      "touchstart #case-major .cases-list ul li": "touchstart",
      "touchend #case-major .cases-list ul li": "touchcancle",
      "touchcancle #case-major .cases-list ul li": "touchcancle",

      "tap #case-home .cases-list ul li": "showDetail",
      "touchstart #case-home .cases-list ul li": "touchstart",
      "touchend #case-home .cases-list ul li": "touchcancle",
      "touchcancle #case-home .cases-list ul li": "touchcancle",

      "tap #img-ads-subject": "showDetail"

    },

    touchstart: function(e) { $(e.currentTarget).addClass('touching'); },
    touchcancle: function(e) { $(e.currentTarget).removeClass('touching'); },

    homeListTemplate: _.template($('#tmpl-case-home-items').html()),
    homeCasesAdsTemplate: _.template($('#tmpl-cases-ads-items').html()),

    initialize: function()
    {
      this.page = 1;
      this.time = 1;
      $.ui.showMask("正在加载...");
      CasesList.on('reset', this.renderCasesList, this);
      CasesList.on('reset', this.renderCasesAds, this);
      this.pull();
//      this.pullToRefresh();
    },

    renderCasesAds:function(list)
    {
      list = list.toJSON();
      var cases_ads = list['0'].body.cases_ads;
      var _ads_html = this.homeCasesAdsTemplate({"data": cases_ads});

      //console.log(_ads_html);
      $("#asd-cases-main").html( _ads_html );
      this.carousel();
    },

    //显示所有案例
    showAllCases:function()
    {
      $.ui.showMask("正在加载案例列表...");
      CasesList.on('reset', this.renderCasesList, this);

      this.page = 1;
      this.pull();

      this.carousel();
      $("#all-cases").addClass("all-cases-current");
      $("#major-cases").removeClass("major-cases-current");
    },

    showMainCases:function()
    {
      $.ui.loadContent("#case-home",false,false,"fade");
      $("#all-cases").addClass("all-cases-current");
      $("#major-cases").removeClass("major-cases-current");
    },

    //显示所有用户主修车型案例
    showMajorCases:function()
    {
      if(userinfo)
      {
        $.ui.showMask("正在加载您的主修案例...");
        MajorCasesList.on('reset', this.renderMajorCasesList, this);

        this.user_id = userinfo['user_id'];
        this.page = 1;
        this.pullmajorcases();
        $("#all-cases").removeClass("all-cases-current");
        $("#major-cases").addClass("major-cases-current");
      }
      else
      {
        $.ui.popup( { title:"您尚未登陆！",
          message:"您是否要去登陆？",
          cancelText:"确定",
          cancelCallback: function(){
            $.ui.showMask('未登陆无法查看您的主修案例，快去登陆吧！');
            $.ui.loadContent("#login");
          },
          doneText:"取消",
          doneCallback: function(){},
          cancelOnly:false
        });
      }
    },

    // 拉取数据
    pull: function()
    {
      //this.time++;
      //console.log(this.time);
      CasesList.setPage( this.page++ ).fetch({
        success: function(){
          $.ui.hideMask();
          $(".main-load-more").html('<div class="load-more" id="case-main-load-more"><p>查看更多</p></div>');
        },
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

    // 拉取主修案例数据
    pullmajorcases: function()
    {
      MajorCasesList.setPage( this.page++ ).fetch({
        success: function(){
          $.ui.hideMask();
          $(".main-load-more").html('<div class="load-more" id="case-main-load-more"><p>查看更多</p></div>');
        },
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
    renderCasesList: function(list)
    {
      list = list.toJSON();
      cases_data = list['0'].body.cases;
      //点击加载更多次数计数
      this.time++;
      if(store.get('casesdata'))
      {
        // 第一次上来加载数据
        if(this.time===2)
        {
          var _html = this.homeListTemplate({"data": store.get('casesdata')});
        }
        else
        {
          var _html = this.homeListTemplate({"data": cases_data});
        }
        $("#cases-main").append( _html );
        $(".main-load-more").html('<div class="load-more" id="case-main-load-more"><p>查看更多</p></div>');
      }
      else
      {
        //console.log('非离线存储分支');
        if(cases_data.length === 0 || cases_data.length < 20)
        {
          $("#case-home .main-load-more").hide();
        }

        var _html = this.homeListTemplate({"data": cases_data});
        // console.log(_html);
        if(this.page == 2)
        {
          $("#cases-main").empty();
        }
        $("#cases-main").append( _html );
        $(".main-load-more").html('<div class="load-more" id="case-main-load-more"><p>查看更多</p></div>');
        store.set('casesdata', cases_data);
      }
      store.set('back_location',1);
//      if(location.hash != "#case-home" && store.get('is_show_case_home') && location.hash != "#main")
//      {
//        //alert('加载case-home');
//        $.ui.loadContent("#case-home",false,false,"fade");
//      }
    },

    // 渲染首页列表
    renderMajorCasesList: function(list)
    {
      //console.log(list);
      if(list.length === 0 || list.length < 20)
      {
        $("#case-major .main-load-more").hide();
      }
      var _data = list.toJSON();
      //console.log(list.toJSON());
      var _html = this.homeListTemplate({"data": _data});
      if(this.page == 2)
      {
        $("#major-main").empty();
      }
      $("#major-main").append( _html );
      if(location.hash != "#case-major")
      {
        $.ui.loadContent("#case-major",false,false,"fade");
        store.set('is_show_case_home',1);
      }
      store.set('back_location',3);
    },

    // when touchstart load more
    loadMore: function()
    {
      $(".main-load-more").html('<div class="load-more-current"><p><img src="res/img/loading-a.gif"><span>正在加载中...</span></p></div>');
      this.pull();
    },

    showDetail: function(e)
    {
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      require.async('./case-detail', function(mod){
        mod.showArticle(_id);
      });
    },

    showMajorDetail: function(e)
    {
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      require.async('./case-detail', function(mod){
        mod.showArticle(_id);
      });
    },

    carousel: function(){
      $("#carousel").carousel({
        pagingDiv: "carousel-dots",
        pagingCssName: "carousel_paging2",
        pagingCssNameSelected: "carousel_paging2_selected",
        preventDefaults:false
      });
    }

    //拖拽刷新，永远清除老数据，加载最新的20条数据
//    pullToRefresh:function()
//    {
//      var locations_main = $("#case-home .jqmScrollPanel").attr('style');
//      if(locations_main != undefined)
//      {
//        myScroller=$("#case-home").scroller({
//          scrollBars: true,
//          verticalScroll: true,
//          horizontalScroll: false,
//          vScrollCSS: 150,
//          hScrollCSS: 200
//        });
//        myScroller.addPullToRefresh();
//
//        $.bind(myScroller,"refresh-release",function(){
//
//          store.remove("casesdata");
//          //console.log('我是拖拽刷新');
//          this.time = 1;
//          CasesList.setPage(1).fetch({
//            success: function(){
//              //this.page = 1;
//              $(".main-load-more").html('<div class="load-more" id="case-main-load-more"><p>查看更多</p></div>');
//              myScroller.hideRefresh();
//              //CasesList.toJSON()
//              if(CasesList.length === 0 || CasesList.length < 20)
//              {
//                $("#case-home .main-load-more").hide();
//                // return false;
//              }
//              //console.log(list.toJSON());
//              var _data = CasesList.toJSON();
//              var pull_cases_data = _data['0'].body.cases;
//              //console.log(_data);
//
//              var _html = homeReListTemplate({"data": pull_cases_data});
//              // console.log(_html);
//              $("#cases-main").empty();
//              $("#cases-main").append( _html );
//              store.set('casesdata', pull_cases_data);
//            },
//            error: function(){
//              $.ui.hideMask();
//              $.ui.popup({
//                "title": "错误信息",
//                "message": "服务器异常, 或许数据解析错误，请稍候重试！",
//                "doneText": "确认",
//                "doneCallback": function(){},
//                "cancelText":"取消"
//              });
//            }
//          });
//          homeReListTemplate= _.template($('#tmpl-home-items').html());
//          return false;
//        });
//      }
//
//    }
  });
  module.exports = new PageViewDef();
});