define(function(require, exports, module){

  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store = require('store');

  var BrandModelDef = Backbone.Model.extend({
    url: '/public/getFilterBrandList',
    initialize: function(){ }
  });

  var SeriesListDef = Backbone.Model.extend({
    // url: '/cases/getSeriesList/',
    setId : function(id){
      this.url = '/public/getFilterSeriesList/'+ id;
    },
    initialize: function(){ }
  });

  var BrandViewDef = Backbone.View.extend({
    // 原有
    // el: "#filter-brand",
    el: "#case-filter-brand",
    BrandlistTemplate: _.template( $("#case-tmpl-brand").html() ),
    //listTemplate: _.template( $("#tmpl-brand").html() ),
    events: {
      "tap #case-filter-brand-list li": "btnItem",
      "touchstart #case-filter-brand-list li": "touchstart",
      "touchend #case-filter-brand-list li": "touchcancle",
      "touchcancle #case-filter-brand-list li": "touchcancle",

      //右侧滚轴
      "touchstart #indexDIV_CasecontentDIV": "touchstartalpha",
      "touchend #indexDIV_CasecontentDIV": "touchcanclealpha",
      "touchcancle #indexDIV_CasecontentDIV": "touchcanclealpha"
    },
    touchstart: function(e) { $(e.currentTarget).addClass('touching'); },
    touchcancle: function(e) { $(e.currentTarget).removeClass('touching'); },
    touchstartalpha: function(e) { $(e.currentTarget).addClass('touchings'); },
    touchcanclealpha: function(e) { $(e.currentTarget).removeClass('touchings'); },

    initialize: function()
    {
      //$.ui.showMask("品牌加载中...");
      BrandModel.on('change', this.renderAll, this);
      BrandModel.fetch();
    },

    renderAll: function(model)
    {
      $.ui.hideMask();

      var _html = this.BrandlistTemplate({"data": model.toJSON() });
      //console.log(model);

      // console.log(this.el);
      this.$el.find(".brand-list").append(_html);
    },

    // 选择car品牌
    btnItem: function(e)
    {
      var _id = $(e.currentTarget).attr('data-id');
//      console.log(_id);
      $.ui.showMask("加载车系数据...");
      SeriesList.setId(_id);
      SeriesList.fetch();

//      var search = require('./case-dosearch');
//
////      search.SearchKey.set({'brand_id': ''}, {silent: true}); // fixed bug
////      search.SearchKey.set({'brand_id': _id});
////
////      window.search = search;
    }
  });


  var SeriesViewDef = Backbone.View.extend({

    el: $('#case-brand-list'),
    events: {
      "tap #series_id": "btnItem"
    },

    homeSeriesListTemplate: _.template($('#tmpl-series').html()),
    initialize: function() {
      SeriesList.on("change", this.renderAll, this);
    },

    renderAll: function(data)
    {
      //console.log(data);
      var _html = '';
      var _data = data.toJSON();
      //console.log(_data.body);
      var _html = this.homeSeriesListTemplate({"data": _data.body});
      if(_html.length < 1) _html = '<h5 class="no-data">暂无数据！</h5>';

      this.$el.find(".chexi-names-list").html(_html);
      $.ui.loadContent("#case-brand-list");
    },

    // 选择car车系
    btnItem: function(e)
    {
      //console.log(e);
      e.preventDefault();
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      var _title = _e.html();

      var search = require('./case-dosearch');
      search.SearchKeyTitle.set('filter-brand', _title);

      search.SearchKey.set({'series_id': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'series_id': _id});

      window.search = search;
    }
  });

  var PartViewDef = Backbone.View.extend({

    el: '#case-filter-part',
    events: {
      "tap #case-filter-part li": "btnItem"
    },

    // 故障位置id
    btnItem: function(e)
    {
      e.preventDefault();
      var _e = $(e.currentTarget);
      var _id = _e.attr('data-id');
      var _title = _e.html();
      // console.log(_id);

      var search = require('./case-dosearch');
      search.SearchKeyTitle.set('filter-part', _title);
      search.SearchKey.set({'trouble_location': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'trouble_location': _id});

      window.search = search;

    }
  });

  var OrderViewDef = Backbone.View.extend({

    el: '#case-filter-order',
    events: {
      "tap #case-filter-order li": "btnItem"
    },

    // 选择car车系
    btnItem: function(e)
    {
      e.preventDefault();
      var _e = $(e.currentTarget);
      var _val = _e.attr('data-val');
      var _title = _e.html();
      // console.log(_val);

      var search = require('./case-dosearch');
      search.SearchKeyTitle.set('filter-order', _title);

      search.SearchKey.set({'order': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'order': _val});

      window.search = search;
    }
  });

  var MoreViewDef = Backbone.View.extend({

    el: '#case-filter-more',
    events: {
      "tap #case-filter-more li": "btnItem"
    },

    // 更多下属
    btnItem: function(e)
    {
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-id');
      if(_val == 'to_year') $.ui.loadContent('#case-filter-year');
      else if(_val == 'to_cc') $.ui.loadContent('#case-filter-cc');
      else $.ui.loadContent('#case-filter-transmission');
    }
  });

  var YearViewDef = Backbone.View.extend({

    el: '#case-filter-year',
    events: {
      "tap #case-filter-year li": "btnItem"
    },

    // 选择年份
    btnItem: function(e)
    {
      $.ui.hideModal("#popup_year");
      store.set('is_showModal',0);
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-id');
      var _title = $(e.currentTarget).html();
      // console.log(_val);

      var search = require('./case-dosearch');
      search.SearchKeyTitle.set({'filter-more': _title});

      search.SearchKey.set({'year': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'year': _val});

      window.search = search;
    }
  });


  var TransmissionViewDef = Backbone.View.extend({

    el: '#case-filter-transmission',
    events: {
      "tap #case-filter-transmission li": "btnItem"
    },

    // 选择变速箱
    btnItem: function(e)
    {
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-id');
      var _title = $(e.currentTarget).html();

      var search = require('./case-dosearch');
      search.SearchKeyTitle.set({'filter-more': _title});

      search.SearchKey.set({'transmission': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'transmission': _val});

      window.search = search;
    }
  });

  var CcViewDef = Backbone.View.extend({

    el: '#case-filter-cc',
    events: {
      "tap #case-filter-cc li": "btnItem"
    },

    // 选择变速箱
    btnItem: function(e)
    {
      e.preventDefault();
      var _val = $(e.currentTarget).attr('data-id');
      var _title = $(e.currentTarget).html();

      var search = require('./case-dosearch');

      search.SearchKeyTitle.set({'filter-more': _title});

      search.SearchKey.set({'cc': ''}, {silent: true}); // fixed bug
      search.SearchKey.set({'cc': _val});

      window.search = search;
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

  //更多
  new MoreViewDef();

  // 更多筛选
  new YearViewDef();
  new TransmissionViewDef();
  new CcViewDef();

});