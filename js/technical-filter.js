define(function(require, exports, module){

  // Load dependence Moudles
  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store = require('store');

  var BrandModelDef = Backbone.Model.extend({
    url: '/public/getFilterSeekBrandList',
    initialize: function(){ }
  });


  var SeriesListDef = Backbone.Model.extend({
    // url: '/cases/getSeriesList/',
    setId : function(id){
      this.url = '/public/getFilterSeekSeriesList/'+ id;
    },
    initialize: function(){ }
  });



  var BrandViewDef = Backbone.View.extend({
    el: "#filter-brand",
    listTemplate: _.template( $("#tmpl-brand").html() ),
    events: {
      "tap #filter-brand .brand-list li": "btnItem",
      "touchstart #filter-brand .brand-list li": "touchstart",
      "touchend #filter-brand .brand-list li": "touchcancle",
      "touchcancle #filter-brand .brand-list li": "touchcancle",

      //右侧滚轴
      "touchstart #indexDIV_contentDIV": "touchstartalpha",
      "touchend #indexDIV_contentDIV": "touchcanclealpha",
      "touchcancle #indexDIV_contentDIV": "touchcanclealpha",
    },

    touchstart: function(e) { $(e.currentTarget).addClass('touching'); },
    touchcancle: function(e) { $(e.currentTarget).removeClass('touching'); },

    touchstartalpha: function(e) { $(e.currentTarget).addClass('touchings'); },
    touchcanclealpha: function(e) { $(e.currentTarget).removeClass('touchings'); },
    initialize: function()
    {
      BrandModel.on('change', this.renderAll, this);
      BrandModel.fetch();
    },

    renderAll: function(model)
    {
//      $.ui.showMask("品牌加载中...");
//      $.ui.hideMask();
      var _html = this.listTemplate({"data": model.toJSON() });
      this.$el.find(".brand-list").append(_html);
    },

    // 选择car品牌
    btnItem: function(e)
    {
      var _id = $(e.currentTarget).attr('data-id');

      $.ui.showMask("正在加载车系...");
      SeriesList.setId(_id);
      SeriesList.fetch();
    }
  });

  var SeriesViewDef = Backbone.View.extend({

    el: $('#brand-list'),
    events: {
      "tap .chexi-names-list li": "btnItem"
    },

    SeekSeriesListTemplate: _.template($('#seek-tmpl-series').html()),
    initialize: function() {
      SeriesList.on("change", this.renderAll, this);
    },

    renderAll: function(dict)
    {
      var _html = '';
      var _data = dict.toJSON();
      //console.log(_data.body);
      var _html = this.SeekSeriesListTemplate({"data": _data.body});
      if(_html.length < 1) _html = '<h5 class="no-data">暂无数据！</h5>';

      this.$el.find(".chexi-names-list").html(_html);
      $.ui.loadContent("#brand-list");
    },

    // 选择car车系
    btnItem: function(e)
    {
      e.preventDefault();
      var _id = $(e.currentTarget).attr('data-id');
      // console.log(_id);

      var search = require('./technical-dosearch');
      search.SearchKey.set({'series_id': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'series_id': _id});

      window.search = search;
    }
  });

  var PartViewDef = Backbone.View.extend({

    el: '#filter-part',
    events: {
      "tap .brand li": "btnItem"
    },

    // 故障位置id
    btnItem: function(e)
    {
      e.preventDefault();
      var _id = $(e.currentTarget).attr('data-id');
      // console.log(_id);

      var search = require('./technical-dosearch');
      search.SearchKey.set({'trouble_location': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'trouble_location': _id});

      window.search = search;
    }
  });

  var OrderViewDef = Backbone.View.extend({

    el: '#filter-order',
    events: {
      "tap .brand li": "btnItem"
    },

    // 选择car车系
    btnItem: function(e)
    {
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-val');
      // console.log(_val);

      var search = require('./technical-dosearch');
      search.SearchKey.set({'order': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'order': _val});

      window.search = search;
    }
  });


  var YearViewDef = Backbone.View.extend({

    el: '#years-list',
    events: {
      "tap .brand li": "btnItem"
    },

    // 选择年份
    btnItem: function(e)
    {
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-id');
      // console.log(_val);

      var search = require('./technical-dosearch');
      search.SearchKey.set({'year': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'year': _val});

      window.search = search;
    }
  });

  // 是否解决
  var SloveViewDef = Backbone.View.extend({

    el: '#yes-no',
    events: {
      "tap .brand li": "btnItem"
    },

    // 选择年份
    btnItem: function(e)
    {
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-id');
      // console.log(_val);

      var search = require('./technical-dosearch');
      search.SearchKey.set({'is_solve': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'is_solve': _val});

      window.search = search;
    }
  });

  var ScoreViewDef = Backbone.View.extend({

    el: '#tech-score',
    events: {
      "tap .brand li": "btnItem"
    },

    // 选择年份
    btnItem: function(e)
    {
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-id');
      // console.log(_val);

      var search = require('./technical-dosearch');
      search.SearchKey.set({'score': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'score': _val});

      window.search = search;
    }
  });


  var TransmissionViewDef = Backbone.View.extend({

    el: '#transmission-list',
    events: {
      "tap .brand li": "btnItem"
    },

    // 选择变速箱
    btnItem: function(e)
    {
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-id');
      // console.log(_val);

      var search = require('./technical-dosearch');
      search.SearchKey.set({'transmission': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'transmission': _val});

      window.search = search;
    }
  });

  var CcViewDef = Backbone.View.extend({

    el: '#cc-list',
    events: {
      "tap .brand li": "btnItem"
    },

    // 选择变速箱
    btnItem: function(e)
    {
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-id');
      // console.log(_val);

      var search = require('./technical-dosearch');
      search.SearchKey.set({'cc': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'cc': _val});

      window.search = search;
    }
  });

  var MoreViewDef = Backbone.View.extend({

    el: '#filter-more',
    events: {
      "tap .brand li": "btnItem"
    },

    // 故障位置id
    btnItem: function(e)
    {
      e.preventDefault();
      var _id = $(e.currentTarget).attr('data-id');
      //console.log(_id);
      if(_id == 'yes') $.ui.loadContent('#yes-no');
      else if(_id == 'tech') $.ui.loadContent('#tech-score');
      else $.ui.loadContent('#cc-list');

    }
  });


  // initialize app
  var BrandModel = new BrandModelDef();
  new BrandViewDef();

  var SeriesList = new SeriesListDef();
  new SeriesViewDef();

  // 部位
  new PartViewDef();

  // 排序view
  new OrderViewDef();

  // 更多筛选
  new YearViewDef();
  new TransmissionViewDef();
  new CcViewDef();
  new ScoreViewDef();
  new SloveViewDef();
  new MoreViewDef();


});