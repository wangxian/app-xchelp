define(function(require, exports, module){
  // -------------------
  var _        = require('underscore');
  var Backbone = require('backbone');
  var store    = require('store');
  var ui       = require('ui');
  var md5      = require('md5');

  // 登陆
  // ---------------------
  var RegisterModelDef = Backbone.Model.extend({
    url: "/user/register",
    notAuth: true // 如果不需要对Post 请求做认证，notAuth设置true, 默认false
  });
  var RegisterModel = new RegisterModelDef();

  var RegisterViewDef = Backbone.View.extend({
    'el': '#jQUi',
    events: {
      'tap #registerSubmit': 'btnRegister'
    },

    // login button
    btnRegister: function(e)
    {
      //用户名
      var username = $('#re_username').val();
      // 密码
      var passwd = $('#re_password').val();
      // 确认密码
      var verify_passwd = $("#re_reg_password").val();
      //邮箱
      var email = $("#re_email").val();

      if(username == '' || username == '请输入用户名')
      { 
        ui.alert('用户名必须输入');
        document.getElementById("re_username").focus();
        return false;
      }
      else
      {
        var pattern = /[^x00-xff]/;
        flag = pattern.test(username);
        if(flag)
        {
          ui.alert('用户名不可为中文');
          return false;
        }

        var is_number = /^[0-9]*$/;
        username_one = is_number.test(username.substr(0,1));
        if(username_one)
        {
          ui.alert('用户名首位不可为数字');
          return false;
        }
      }


      if(email == '' || email == '请填写邮箱')
      {
        ui.alert('邮箱必须填写');
        return false;
      }
      else
      {
        var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        flag = pattern.test(email);
        if(!flag)
        {
          ui.alert('您填写的邮箱格式不正确');
          return false;
        }
      }

      if(passwd == '' || passwd == '请输入密码')
      {
        ui.alert('密码必须输入');
        document.getElementById("re_password").focus();
        return false;
      }

      if(verify_passwd == '' || verify_passwd == '请输入确认密码')
      {
        ui.alert('确认密码必须输入');
        document.getElementById("re_reg_password").focus();
        return false;
      }

      if(verify_passwd != passwd)
      {
        ui.alert('两次填写的密码不一致');
        document.getElementById("re_reg_password").focus();
        return false;
      }

      var password = md5(passwd);

      ui.loading.show();
      var re_userinfo = {"username": username, "password": password, "email":email};

      console.log(re_userinfo);
      RegisterModel.save(re_userinfo, {
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
            $.ui.showMask('注册成功');
            //console.log(response.body.user_id);
            var _userinfo = {};
            _userinfo['user_id'] = response.body.user_id;
            _userinfo['username'] = response.body.username;
            // 登陆成功
            store.set('userinfo', _userinfo);
            //ui.alert("注册成功，立刻去登陆");
            setTimeout(function(){ $.ui.loadContent("#usercenter",false,false,"slide")}, 600);
          }
        }
      });
    }

  });
  new RegisterViewDef();
});