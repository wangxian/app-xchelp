// module loader
// ------------------------------------------------
;(function(m, o, d, u, l, a, r) {
  if(m[d]) return;
  function f(n, t) { return function() { r.push(n, arguments); return t } }
  m[d] = a = { args: (r = []), config: f(0, a), use: f(1, a) };
  m.define = f(2);
  u = o.createElement('script');
  u.id = d + 'node';
  u.src = './js/base/sea-1.2.1.js';
  l = o.getElementsByTagName('head')[0];
  a = o.getElementsByTagName('base')[0];
  a ? l.insertBefore(u, a) : l.appendChild(u);
})(window, document, 'seajs');

//var _filename = window.location.pathname.slice(window.location.pathname.lastIndexOf('/')+1, -5);

//var _hashname = window.location.slice(window.location.lastIndexOf('#')+1);
// load page moudle
seajs.use('./js/index.js');
seajs.config({ 'debug': 2});

//默认是检测版本
//window.localStorage.setItem('check_version','yes');

// load mobinweaver
seajs.use('./mobinweaverlibs/mobinweaver.js', function(){
  if(typeof MobinWeaver === "undefined") return false;

  MobinWeaver.UIScreen.setStatusBarVisible(MobinWeaver.UIScreen.SCREEN_STATUSBAR_SHOWN);
  MobinWeaver.KeyManager.addKeyListener(MobinWeaver.KeyManager.BACK_KEY, function(){

    if(window.location.hash == "#index")
    {
      $.ui.popup( { title:"退出提示！",
        message:"您是否真的要退出修车帮客户端？",
        cancelText:"退出",
        cancelCallback: function(){
          //退出前把check_version重置为yes，这样用户下次打开还是会check
          window.localStorage.setItem('check_version','yes');
          window.localStorage.removeItem('is_show_case_home');
          MobinWeaver.exit();
        },
        doneText:"取消",
        doneCallback: function(){},
        cancelOnly:false
      });
    }
    else if(window.location.hash == "#case-home")
    {
      window.localStorage.removeItem('is_show_case_home');
      $.ui.loadContent('#index');
      $.ui.toggleHeaderMenu(false);
      $("#cases-main li").each(function(k,v){ if(k>=15) $(v).remove(); });
      $.ui.scrollToTop("case-home");
    }
    else if(window.location.hash == "#usercenter" || window.location.hash == "#about" ||
       window.location.hash == "#technical-main" || window.location.hash == "#setting" ||
       window.location.hash == "#login")
    {
      window.localStorage.removeItem('is_show_case_home');
      $.ui.loadContent('#index',false,false,"fade");
      $.ui.toggleHeaderMenu(false);
    }
    else if(window.location.hash == "#case-major")
    {
      $.ui.loadContent('#case-home',false,false,"fade");
      window.localStorage.removeItem('is_show_case_home');
    }
    else if(window.location.hash == "#leading")
    {
      $.ui.loadContent('#setting');
      $.ui.toggleHeaderMenu();
    }
    else $.ui.goBack();
  });
});


// include touch.js on desktop browsers for debug
// --------------------------------------------
if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window)){
  var script = document.createElement("script");
  script.src = "./js/touch.js";
  var tag = $("head").append(script);
  $.os.android = true;
  $.os.desktop = true;
}


// start app
// ----------------------------------------------------------------------------------------

// default webroot
// var webRoot = "./";

// By default, it is set to true and you're app will run right away.
// We set it to false to show a splashscreen
// $.ui.autoLaunch = true;

if($.ui) $.ui.loadDefaultHash = false;

//如果check_version 为 yes 的之后，自动启动一遍软件版本检测
if(window.localStorage.getItem('check_version') == 'yes')
{
    window.setTimeout(function ()
    {
       //版本号
//       $.getJSON("./MOBINAPP.json", function(json){
//         version_code = json.version;
//       });
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
           if(data == '0')
           {
             window.localStorage.setItem('check_version','no');
           }
           else
           {
             $.ui.popup({
               "title": "软件有新版本！",
               "message": "我们检测到您当前的软件不是最新版本，建议您下载我们最新版本！",
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
           }
         }
       });
    }, 6000);
}

// $.ui.showBackbutton = false;
// $.ui.removeFooterMenu();

// This will run when the body is loaded
// document.addEventListener("DOMContentLoaded", function() {

//   // We override the back button text to always say "Back"
//   $.ui.backButtonText = "返回";

//   // We wait 1.5 seconds to call $.ui.launch after DOMContentLoaded fires
//   window.setTimeout(function () {
//       $.ui.launch();
//   }, 1500);

// }, false);

// This function will get executed when $.ui.launch has completed
// $.ui.ready(function () {
// });


// device ready
// document.addEventListener("appMobi.device.ready", function() {
//   AppMobi.device.setRotateOrientation("portrait");
//   AppMobi.device.setAutoRotate(false);
//   webRoot = AppMobi.webRoot + "/";

//   // hide splash screen
//   AppMobi.device.hideSplashScreen();
// }, false);