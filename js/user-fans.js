define(function(require,exports,module){var _=require("underscore");var Backbone=require("backbone");var store=require("store");var FanslistModel=new Backbone.Model;var FanslistViewDef=Backbone.View.extend({el:"#fans-list",events:{"tap #friend-main-fanslist li":"showHomepage","touchstart #friend-main-fanslist li":"touchstart","touchend #friend-main-fanslist li":"touchcancle","touchcancle #friend-main-fanslist li":"touchcancle"},touchstart:function(e){$(e.currentTarget).addClass("touching")},touchcancle:function(e){$(e.currentTarget).removeClass("touching")},fansListTemplate:_.template($("#tmpl-fans-items").html()),initialize:function(){$.ui.showMask("正在加载粉丝信息...");FanslistModel.on("change",this.renderFanslist,this)},showFanslist:function(id){FanslistModel.url="/user/getFollowers?uid="+id;FanslistModel.fetch()},renderFanslist:function(list){var data=list.toJSON();fans_data=data.body.data;var fans_html=this.fansListTemplate({data:fans_data});$("#friend-main-fanslist").html(fans_html);$.ui.loadContent("#fans-list")},showHomepage:function(e){var _e=$(e.currentTarget);var _id=_e.attr("data-id");require.async("./user-homepage",function(mod){mod.showArticle(_id)})}});module.exports=new FanslistViewDef});