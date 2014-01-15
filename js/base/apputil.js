define(function(require, exports, module) {
  var _alertEle = document.getElementById('alert');

  /**
   * 在节点内部的前面插入节点
   * @param  elements child
   * @param  elements parent
   * @return null
   */
  exports.prependChild = function(child, parent){
    if(parent.hasChildNodes()){ parent.insertBefore(child, parent.firstChild); }
    else{ parent.appendChild(child); }
  }

  _getAlertEle = function(){
    if(!_alertEle){
      _alertEle = document.createElement('div');
      _alertEle.id = "alert";
      _alertEle.style.position = "absolute";
      _alertEle.style.left = "0";
      _alertEle.style.top = "0";
      _alertEle.style.width = "600px";
      _alertEle.style.fontSize = "14px";
      _alertEle.style.lineHeight = "1.5em"
      _alertEle.style.color = "greenYellow";
      _alertEle.style.zIndex = "9";
      exports.prependChild(_alertEle, document.body)
    }
    return _alertEle;
  }


  /**
   * 在屏幕上显示log日志
   * @param  string message
   * @return null
   */
  exports.alert = function(message)
  {
    if(!seajs.debug) return false;

    var alertEle = _getAlertEle();
    alertEle.appendChild(document.createTextNode(message));
    alertEle.appendChild(document.createElement('br'));
  }

  /**
   * 打印日志，避免ie上错误
   * @type null
   */
  exports.log = function()
  {
    if (typeof console !== 'undefined') {
      var AP = Array.prototype;
      var args = AP.slice.call(arguments);

      var type = 'log';
      var last = args[args.length - 1];
      console[last] && (type = args.pop());

      // Only show log info in debug mode
      if (type === 'log' && !require('config').debug) return '';

      var out = type === 'dir' ? args[0] : AP.join.call(args, ' ');
      console[type](out);
    }
  };

  /**
   * 统一格式化 分 为 20.5
   * @param  {[Integer]} money 分
   * @return {[Float]}   20.5
   */
  exports.formatMoney = function(money)
  {
    return (money/100).toFixed(1);
  }

  /**
   * 生成随机数
   * @param  {[Integer]} len 随机数长度
   * @return Integer
   */
  exports.randNum = function(len)
  {
    var _max = 1;
    for(var i=0; i<len; i++) _max *= 10;

    var _randomNum = Math.floor( Math.random() * _max );
    if(_randomNum < _max/10) _randomNum += _max/10;

    return _randomNum;
  }

});