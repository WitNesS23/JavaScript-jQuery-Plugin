(function($){
	$.fn.keyboardInput = function(options){
		/*
			container ： 打字效果的生效容器
			inputWords ；输入的内容
			changeLine : 是否换行输入 *
			keyword ： 换行标识符
			classStyle ： 打字效果样式情况
			animateInterval ： 新字符出现时间间隔
			blinkInterval ： 光标闪烁间隔
			callback ：回调函数
		*/
		var defaultConfig = {
			'container' : $(window),
			'inputWords' : null,
			'keyword' : '|',
			'classStyle' : '',
			'animateInterval' : 150,
			'blinkInterval' : '0.3s',
			'callback' : null
		};

		// 存疑： 宽度自适应问题

		// 扩展过后的配置文件
		var config = $.extend({}, defaultConfig, options || {});
		
		// 被关键词分割之后的行数据
		var arrInputWords = config.inputWords.split(config.keyword);

		// 保存每行输出的空DOM结构和其中需要输出的内容
		var arrWordsContainer = [];

		// 光标闪烁CSS样式
		var stylekeyframes = $('<style>', { 'id' : 'newStyle_Keyframes'});

		stylekeyframes.html('@-webkit-keyframes marker{50% { border-color: transparent;}}@keyframes marker{50% { border-color: transparent;}}');

		$('head').append(stylekeyframes);

		// 包裹元素的CSS设置
		var textColor = '';

		var arrClassSet = config.classStyle.split(';');
		var objClassSet = {};
		for(var i = 0, length = arrClassSet.length; i < length; i++){
			var _arr = arrClassSet[i].split(':');
			if(Trim(_arr[0]) == '' || Trim(_arr[1]) == ''){
				continue;
			}else if(Trim(_arr[0]).toLowerCase() == 'color'){
				textColor = Trim(_arr[1]);
			}
			config.container.css(Trim(_arr[0]), Trim(_arr[1]));
		}

		var _fontSize = config.container.css('font-size');

		// 根据设置的font-size来指定闪烁光标的宽度
		var borderWidth = 1;
		if(_fontSize.substring(0, _fontSize.length - 2) <= 100){
			borderWidth = _fontSize.substring(0, 1) + 'px';
		}else{
			borderWidth = 10 + 'px';
		}

		config.classStyle = (' white-space: nowrap; -webkit-animation : marker ' + config.blinkInterval + ' infinite;' + ' animation : marker ' + config.blinkInterval + ' infinite;');

		var delayTime = 0;

		for (var i = 0; i <= arrInputWords.length - 1; i++) {
			var _objSignle = {};

			// 不换行 注意
			_objSignle.dom = $('<span>', { 'id' : 'inputWordRow_' + i, 'class' : 'inputWordRow', 'style' : config.classStyle});
			config.container.append(_objSignle.dom).append($('<br />'));

			_objSignle.innerText = arrInputWords[i];

			// 确定delayTime
			if(i == 0){
				_objSignle.delayTime = 0;
				delayTime += (_objSignle.innerText.length + 1) * config.animateInterval;
			}else{
				_objSignle.delayTime = delayTime;
				delayTime += (_objSignle.innerText.length + 1) * config.animateInterval;
			}

			arrWordsContainer.push(_objSignle);
		}

		for (var i = 0; i <= arrWordsContainer.length - 1; i++){

			var _this = arrWordsContainer[i];

			(function(__this, _i){
				setTimeout(function(){
					innerIntervel(_i);
				}, __this.delayTime);
			})(_this, i);
		}

		if(config.callback){
			setTimeout(config.callback, delayTime);
		}

		function innerIntervel(i){
			var __index = 0;
			var _i = 2 * i + 1;
			$(".inputWordRow:nth-child("+ _i +")").css('border-right', borderWidth + ' solid ' + textColor);
			var timerId = setInterval(function(){
				$(".inputWordRow:nth-child("+ _i +")").append(arrWordsContainer[i].innerText.charAt(__index));
				if(++__index === arrWordsContainer[i].innerText.length){
					timerId = null;
					if(arrInputWords.length - 1 > i ){
						$(".inputWordRow:nth-child("+ _i +")").css('border', 'none');
					}
				}
			}, config.animateInterval);
		}

		// 字符串去空函数
		function Trim(str){
			return str.replace(/(^\s*)|(\s*$)/g,'');
		}
	};
})(jQuery);