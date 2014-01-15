define(function(require,exports,module){var _=require("underscore");var Backbone=require("backbone");var store=require("store");var SearchKeyTitleDef=Backbone.Model.extend({defaults:{"filter-brand":"","filter-part":"","filter-order":"","filter-more":""}});var SearchKeyTitle=new SearchKeyTitleDef;var SearchKeyDef=Backbone.Model.extend({defaults:{series_id:"",year:"",trouble_location:"",transmission:"",cc:"",keyword:"",order:"",page:1},serializeURL:function(){var _validData={};_.each(this.toJSON(),function(v,k){if(v!=="")_validData[k]=v});return $.param(_validData)}});var SearchKey=new SearchKeyDef;var SearchResultListDef=Backbone.Collection.extend({url:"/cases/getSearchList",resetURL:function(){this.url="/cases/getSearchList?"+SearchKey.serializeURL()},initialize:function(){}});var SearchResultList=new SearchResultListDef;var SearchViewDef=Backbone.View.extend({el:"#case-che-list",events:{"tap .load-more":"loadMore","tap .cases-list ul li":"showDetail","touchstart .cases-list ul li":"touchstart","touchend .cases-list ul li":"touchcancle","touchcancle .cases-list ul li":"touchcancle"},touchstart:function(e){$(e.currentTarget).addClass("touching")},touchcancle:function(e){$(e.currentTarget).removeClass("touching")},SearchKey:SearchKey,SearchKeyTitle:SearchKeyTitle,listTemplate:_.template($("#tmpl-case-home-items").html()),initialize:function(){SearchKey.on("change",function(model){SearchResultList.resetURL();if(SearchKeyTitle.get("case-filter-brand")){setTimeout(function(){$("#set-filter-brand a").html(SearchKeyTitle.get("filter-brand"))},100)}if(SearchKeyTitle.get("case-filter-part")){setTimeout(function(){$("#set-filter-part a").html(SearchKeyTitle.get("filter-part"))},100)}if(SearchKeyTitle.get("case-filter-order")){setTimeout(function(){$("#set-filter-order a").html(SearchKeyTitle.get("filter-order"))},100)}if(SearchKeyTitle.get("case-filter-more")){setTimeout(function(){$("#set-filter-more a").html(SearchKeyTitle.get("filter-more"))},100)}SearchResultList.fetch()},this);SearchResultList.on("reset",this.doSearch,this);this.page=1},doSearch:function(list){if(list.length<20){if(list.length===0){$("#che-list-box").html('<h5 class="no-data">暂无相关数据！</h5>');$.ui.loadContent("#case-che-list");$("#case-che-list .load-more").hide();return false}else{$("#case-che-list .load-more").hide()}}$("#case-che-list .load-more").hide();var _data=list.toJSON();var _html=this.listTemplate({data:_data});if(this.page==1)$("#che-list-box").empty();$("#che-list-box").append(_html);if(location.hash!="#case-che-list")$.ui.loadContent("#case-che-list")},loadMore:function(){this.SearchKey.set("page",++this.page)},showDetail:function(e){var _e=$(e.currentTarget);var _id=_e.attr("data-id");store.set("back_location",2);require.async("./case-detail",function(mod){mod.showArticle(_id)})}});module.exports=new SearchViewDef});