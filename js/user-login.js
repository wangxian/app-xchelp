define(function(require, exports, module){
  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store    = require('store');
  var ui       = require('ui');
  var md5      = require('md5');


  // 登陆
  // ---------------------
  var LoginModelDef = Backbone.Model.extend({
    url: "/user/login",
    notAuth: true // 如果不需要对Post 请求做认证，notAuth设置true, 默认false
  });
  var LoginModel = new LoginModelDef();

  var LoginViewDef = Backbone.View.extend({
    'el': '#jQUi',
    events: {
      'tap #loginSubmit': 'btnLogin',
      'tap #loginout': 'btnLoginOut'
    },

    initialize: function()
    {
//      var userinfo = store.get('userinfo');
//
//      // 已登录
//      if(userinfo) $.ui.loadContent("#usercenter");

    },

    loginRedirect: function()
    {
      $.ui.loadContent("#usercenter");
    },

    // login button
    btnLogin: function()
    {
      var it = this;
      //用户名
      var _username = $('#username').val();
      // 密码
      var _password = $('#password').val();

      if(_username == '' || _username == '请输入用户名或者邮箱')
      { 
        ui.alert('用户名必须输入');
        document.getElementById("username").focus();
        return false;
      }
      else
      {
        var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;    
         flag = pattern.test(_username);    
         if(flag)    
         {    
          _type = '1';  
         }    
         else    
         {    
          _type = '2';   
         }    
      }

      if(_password == '' || _password == '请输入密码')
      {
        ui.alert('密码必须输入');
        document.getElementById("password").focus();
        return false;
      }
      var _password = md5(_password);

      ui.loading.show();
      var _userinfo = {"username": _username, "password": _password, "type":_type};
      LoginModel.save(_userinfo, {
        "error": function(model, xhr, options)
        {
          ui.alert("系统错误！");
          ui.loading.hide();
        },
        "success": function(model, response)
        {
          ui.loading.hide();
          if (response.head.code !== 200) { ui.alert( response.head.msg ); }
          else
          {
            // console.log(response.body.user_id);
            _userinfo['user_id'] = response.body.user_id;
            _userinfo['username'] = response.body.username;
            // 登陆成功
            store.set('userinfo', _userinfo);
            it.loginRedirect();
          }
        }
      });
    },

    // 登出
    btnLoginOut: function()
    {
      store.remove('userinfo');
      // this.loginRedirect();
      $.ui.loadContent("#login");
    }



  });
  new LoginViewDef();
});