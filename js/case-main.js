define(function(require, exports, module){

  var _        = require('underscore');
  var Backbone = require('backbone');
  var store    = require('store');

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

      "tap #img-ads-subject": "showDetail",

      //加载品牌
      "tap #case-item-filter": "btnBrand",
      //加载part
      "tap #case-item-part": "btnPart",
      //加载order
      "tap #case-item-order": "btnOrder",
      //加载more
      "tap #case-item-more": "btnMore",

      "tap #case-back-index": "backIndex"

    },

    touchstart: function(e) { $(e.currentTarget).addClass('touching'); },
    touchcancle: function(e) { $(e.currentTarget).removeClass('touching'); },

    homeListTemplate: _.template($('#tmpl-case-home-items').html()),
    homeCasesAdsTemplate: _.template($('#tmpl-cases-ads-items').html()),

    initialize: function()
    {
      it = this;
      this.page = 1;
      $.ui.showMask("正在加载...");
      CasesList.on('reset', this.renderCasesList, this);
      CasesList.on('reset', this.renderCasesAds, this);
      setTimeout(function(){ it.pull(); },300);
    },

    btnPart:function()
    {
      require.async('./case-filter');
      $.ui.loadContent("#case-filter-part");
    },

    btnOrder:function()
    {
      require.async('./case-filter');
      $.ui.loadContent("#case-filter-order");
    },

    btnMore:function()
    {
      require.async('./case-filter');
      $.ui.loadContent("#case-filter-more");
    },

    btnBrand:function()
    {
      require.async('./case-filter');
      $.ui.loadContent("#case-filter-brand");
    },

    backIndex: function()
    {
      $.ui.loadContent('#index');
      $.ui.toggleHeaderMenu();
      $("#cases-main li").each(function(k,v){ if(k>=15) $(v).remove(); });
      $.ui.scrollToTop("case-home");
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

      if(cases_data.length === 0 || cases_data.length < 15)
      {
        $("#case-home .main-load-more").hide();
      }

      var _html = this.homeListTemplate({"data": cases_data});

      if(this.page == 2)
      {
        $("#cases-main").empty();
      }
      $("#cases-main").append( _html );
      $(".main-load-more").html('<div class="load-more" id="case-main-load-more"><p>查看更多</p></div>');

      store.set('back_location',1);

    },

    // 渲染首页列表
    renderMajorCasesList: function(list)
    {
      //console.log(list);
      if(list.length === 0 || list.length < 15)
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
  });
  module.exports = new PageViewDef();
});