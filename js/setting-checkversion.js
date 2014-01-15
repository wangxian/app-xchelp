define(function(require, exports, module){
  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var ui = require('ui');

  var CheckModel = new Backbone.Model();

  var CheckViewDef = Backbone.View.extend({
    "el": "#setting",
    "events": {
      "tap #check-version": "checkversioncode"
    },

    checkversioncode: function()
    {
      //版本号
//      $.getJSON(".././MOBINAPP.json", function(json){
//        version_code = json.version;
//      });
      version_code = '0.9.799';
      //系统版本
      if($.os.android)
      {
        var os_system = 0;
        var url_str = 'http://api.tiaoloula.com/setting/checkversion/' + version_code;
      }
      else if($.os.iphone)
      {
        var os_system = 1;
        var url_str = 'http://api.tiaoloula.com/setting/checkiosversion/' + version_code;
      }


      $.ajax({

        url: url_str,
        success:function(data){
          //alert(typeof(data));
          if(data == '0')
          {
            $.ui.showMask("正在为您检测软件版本，请稍等！");
            setTimeout(function(){
              $.ui.hideMask();
              ui.alert("您当前即为最新版本！");
            }, 500);
          }
          else
          {
            $.ui.popup({
              "title": "软件有新版本！",
              "message": "建议您下载我们的最新版本",
              "doneText": "暂不下载",
              "doneCallback": function(){
                window.localStorage.setItem('check_version','no');
              },
              "cancelText":"立即下载",
              "cancelCallback": function(){
                //弹开下载界面
                data = $.parseJSON(data);
                window.open(data.body.url);
                //记录这次下载行为
                $.ajax({
                  type: 'GET',
                  url: 'http://api.tiaoloula.com/setting/recordDownloads/'+os_system
                });
              }
            });
            ui.loading.hide();
          }
        }
      });
    }
  });
  new CheckViewDef();
});