define(function(require,exports,module){var _=require("underscore");var Backbone=require("backbone");var store=require("store");var ui=require("ui");var md5=require("md5");var insert_image_data="";var BrandModelDef=Backbone.Model.extend({url:"/public/getBrandList",initialize:function(){}});var SeriesListDef=Backbone.Collection.extend({setId:function(id){this.url="/public/getSeriesList/"+id},initialize:function(){}});var TypeListDef=Backbone.Collection.extend({setId:function(id){this.url="/public/getTypeList/"+id},initialize:function(){}});var BrandViewDef=Backbone.View.extend({el:"#publish-tech",events:{"change #publish-right-brand":"btnItem"},listTemplate:_.template($("#publish-tmpl-brand").html()),initialize:function(){BrandModel.on("change",this.renderAll,this);BrandModel.fetch()},renderAll:function(model){$.ui.hideMask();var _html=this.listTemplate({data:model.toJSON()});this.$el.find("#publish-right-brand").append(_html)},btnItem:function(e){var _id=$(e.currentTarget).val();SeriesList.setId(_id);SeriesList.fetch()}});var SeriesViewDef=Backbone.View.extend({el:"#publish-tech",events:{"change #publish-right-series":"btnItem"},listTemplate:_.template($("#publish-tmpl-series").html()),initialize:function(){SeriesList.on("reset",this.renderAll,this)},renderAll:function(model){$.ui.hideMask();var _html=this.listTemplate({data:model.toJSON()});this.$el.find("#publish-right-series").html(_html)},btnItem:function(e){var _id=$(e.currentTarget).val();TypeList.setId(_id);TypeList.fetch()}});var TypeViewDef=Backbone.View.extend({el:$("#publish-tech"),listTemplate:_.template($("#publish-tmpl-type").html()),initialize:function(){TypeList.on("reset",this.renderAll,this)},renderAll:function(model){$.ui.hideMask();var _html=this.listTemplate({data:model.models[0].attributes.body.data});this.$el.find("#publish-right-type").html(_html)}});var PublishModelDef=Backbone.Model.extend({url:"/seek/insertSeek",notAuth:true});var PublishModel=new PublishModelDef;var PublishViewDef=Backbone.View.extend({el:"#jQUi",events:{"tap #submitseek":"publishseek","tap #submitpub":"publishseek","tap #takephoto":"takephoto"},publishseek:function(e){var it=this;var _brand_id=$("#publish-right-brand").val();var _series_id=$("#publish-right-series").val();_year=$("#year").val();_transmission=$("#transmission").val();var _trouble_location=$("#trouble_location").val();_score=$("#score").val();var _description=$("#description").val();_cc=$("#cc").val();if(_cc==""||_cc=="请选择排量"){_cc=""}_vin=$("#vin").val();if(_vin==""||_vin=="请输入vin号"){_vin=""}if(_brand_id==""||_brand_id=="品牌"){ui.alert("品牌必须选择");document.getElementById("publish-right-brand").focus();return false}if(_series_id==""||_series_id=="车系"){ui.alert("车系必须选择");document.getElementById("publish-right-series").focus();return false}if(_year==""||_year=="年份"){ui.alert("年份必须选择");document.getElementById("year").focus();return false}if(_transmission==""||_transmission=="请选择变速箱"){ui.alert("变速箱必须选择");document.getElementById("transmission").focus();return false}if(_trouble_location==""||_trouble_location=="请选择故障部位"){ui.alert("故障部位必须选择");document.getElementById("trouble_location").focus();return false}if(_description==""||_description=="请输入您的求助内容"){ui.alert("求助内容必须填写");document.getElementById("description").focus();return false}if(_description.length<60){ui.alert("求助内容过短，请完善！");document.getElementById("description").focus();return false}var _description="<p>"+_description+"</p>";if(insert_image_data==""){$.ui.popup({title:"您确认不拍一张故障照片？",message:"确认之后求助信息将以无照片状态发布！",cancelText:"确认不拍照",cancelCallback:function(){ui.loading.show();var userinfo=store.get("userinfo");var _data={password:userinfo.password,user_id:userinfo.user_id,brand_id:_brand_id,series_id:_series_id,year:_year,transmission:_transmission,cc:_cc,trouble_location:_trouble_location,score:_score,description:_description,vin:_vin,iamge_code:insert_image_data};PublishModel.save(_data,{error:function(model,xhr,options){ui.alert("系统错误！");ui.loading.hide()},success:function(model,response){ui.loading.hide();if(response.head.code!==200){ui.alert(response.head.msg)}else{$.ui.showMask("求助信息发布成功！");$.ui.loadContent("#technical-main")}}})},doneText:"我来拍一张",doneCallback:function(){},cancelOnly:false})}},takephoto:function(){var captureService=MobinWeaver.requestService(MobinWeaver.SERVICE_MEDIACAPTURE);captureService.captureImage({sourceType:captureService.CAPTURE_IMAGE_SOURCE_CAMERA,picSize:captureService.CAPTURE_IMAGE_SIZE_NORMAL,encodeType:captureService.CAPTURE_IMAGE_ENCODE_B64,destDir:"photo/camera"},function(data){if(data.status===captureService.CAPTURE_IMAGE_STATUS_OK){var imageb64=$("<img width='100'></img>");imageb64.attr("src","data:image/png;base64,"+data.encodedData);insert_image_data=data.encodedData;$("#showphoto").append(imageb64)}else if(data.status===captureService.CAPTURE_IMAGE_STATUS_CANCEL){}else{}})}});new PublishViewDef;var BrandModel=new BrandModelDef;new BrandViewDef;var SeriesList=new SeriesListDef;new SeriesViewDef;var TypeList=new TypeListDef;new TypeViewDef});