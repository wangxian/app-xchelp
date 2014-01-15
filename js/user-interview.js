define(function(require,exports,module){var _=require("underscore");var Backbone=require("backbone");var store=require("store");var MyInterviewListModel=Backbone.Model.extend({});var MyInterviewListCollection=Backbone.Collection.extend({model:MyInterviewListModel,setPage:function(page,uid){this.url="/job/getInvited?user_id="+uid+"&page="+page;return this},initialize:function(){var userinfo=store.get("userinfo");this.setPage(1,userinfo.user_id)}});var MyInterviewList=new MyInterviewListCollection;window.MyInterview=MyInterviewList;var MyInterviewDef=Backbone.View.extend({el:"#interview",events:{"tap #interview-list li":"showDetail"},initialize:function(){$.ui.showMask("正在加载求职邀请信息列表...");MyInterview.on("reset",this.renderMyInterview,this);var userinfo=store.get("userinfo");this.page=1;this.uid=userinfo.user_id;this.pull()},pull:function(){MyInterview.setPage(this.page++,this.uid).fetch({success:function(){$.ui.hideMask()},error:function(){$.ui.hideMask();$.ui.popup({title:"错误信息",message:"服务器异常, 或许数据解析错误，请稍候重试！",doneText:"确认",doneCallback:function(){},cancelText:"取消"})}})},renderMyInterview:function(list){if(list.length===0||list.length<11){$("#my-publish .load-more").hide()}var _data=list.models[0].attributes.body.data;var _html="";_.each(_data,function(v,k){_html+='<li data-id="'+v["id"]+'"><a href="#interview-detail">'+"<strong>"+v["company_name"]+"</strong>"+"<br/>"+v["message"]+"<br/>"+"<span>"+v["date_time"]+"</span></a></li> "});if(_html.length<1)_html='<p class="system-tip"><strong>暂时没有企业给您发送过面试邀请！</strong><br/>投递更多简历，收获更多面试邀请！</p> ';this.$el.find("#interview-list").html(_html)},loadMore:function(){this.pull()},showDetail:function(e){var _e=$(e.currentTarget);var _id=_e.attr("data-id");require.async("./user-company-info",function(mod){mod.showArticle(_id)})}});new MyInterviewDef});