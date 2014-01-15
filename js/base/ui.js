define(function(require, exports, module) {

  /**
   * [alert description]
   * @return {String} [description]
   */
  exports.alert = function(msg, callback)
  {
    if(typeof callback !== 'function') callback = function(){};
    $.ui.popup({
      // title:" ",
      cancelText: "确定",
      message: msg,
      cancelOnly: true,
      cancelCallback: callback,
      suppressTitle: true
    });
  };

  // 显示 Loading 状态
  exports.loading = {
    show: function()
    {
      $.ui.showMask("正在加载...");
    },

    hide: function()
    {
      $.ui.hideMask();
    }
  };

});