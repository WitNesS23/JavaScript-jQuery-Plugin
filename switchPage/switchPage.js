(function($){
	$.fn.switchPage = function(options){
		/*
			container： 轮播容器；
			imageArr： 轮播图片url数组集
			[
				{
					url: "...",
					href: "...",
					caption: "..."
				}
			]
			interval： 轮播变化间隔
			animateInterval： 轮播动画时间
			nav： 是否具有跳转按钮
		*/
		var defaultConfig = {
			'container' : $(this),
			'imageArr' : null,
			'interval' : 2500,
			'animateInterval' : 300,
			'beginPage' : 0,
			'nav' : true,
			'navSize' : 15
		};

		var config = $.extend({}, defaultConfig, options || {});

		// 可行判断
		if(config.imageArr === null && config.imageArr === []){
			console.log("imageArr 为空。");
		}else if(config.imageArr.length == 1){
			// 单幅画面不轮播
			console.log("imageArr 仅包括单幅画面，不进行轮播。");
		}

		// 1. 根据图片数量创建控件容器以及基本DOM结构
		// 2. 将各个图片存储到数组中
		var pageWidth = config.container.width(),
			pageHeight = config.container.height();

		var pageContainer = $('<div>', {'id': 'idContainer', 'style': 'width: ' + pageWidth + 'px; position: absolute;'});

		var pageArr = [];
		var navArr = [];

		$.each(config.imageArr, function(index, val) {
			/* iterate through array or object */
			var idInfo = 'switchPage' + index,
				pageLeft = pageWidth;
			var styleInfo = 'z-index: 0; height: ' + pageHeight + 'px; width:' + pageWidth + "px; background-image: url('" + imageArr[index].url + "'); position: absolute; background-size: 100% 100%; left: " + pageLeft + "px;";
			var pageSingle = $('<div>', {'id': idInfo, 'style': styleInfo});
			pageArr.push(pageSingle);
			pageContainer.append(pageSingle);
		});

		if(config.nav == true){
			var navConWidth = (pageArr.length - 1) * Math.round(config.navSize * 2) + config.navSize;
			var navConTop = pageHeight - Math.round(config.navSize * 1.5);
			var navConStyle = "z-index: 1000; position: absolute; width: " + navConWidth + "px; top: " + navConTop + "px; left: 50%; margin-left: -" + navConWidth/2 + "px; ";
			var navContainer = $('<div>', {'id': 'navContainer', 'style' : navConStyle});

			var navUnityMarginRight = Math.round(config.navSize * 0.8);
			for(var i = 0; i < pageArr.length; i++){
				var navUnityStyle = "float: left; width: " + config.navSize + "px; height:" + config.navSize + "px; border-radius:" + config.navSize + "px; background-color: #999;";
				if( i+1 < pageArr.length){
					navUnityStyle += " margin-right: " + navUnityMarginRight + "px;";
				}
				var navUnity = $('<div>', {'id': 'navId' + i, 'style': navUnityStyle });
				navUnity.hover(function() {
					$(this).css('background-color', 'orange');
				}, function() {
					$(this).css('background-color', '#999');
				});
				navUnity.click(function(event) {
					pageChange(i);
				});
				navContainer.append(navUnity);
				navArr.push(navUnity);
			}

			pageContainer.append(navContainer);
		}

		var pageCurrent = config.beginPage;

		if(config.beginPage != 0){
			pageArr[pageCurrent].css('left', '0');
			navArr[pageCurrent].css('background-color', 'orange');
		}else{
			pageArr[0].css('left', '0');
			navArr[pageCurrent].css('background-color', 'orange');
		}

		// 3. 图片自动轮播效果 以及 手机手势监听
		var timer;

		function setTimer(){
			timer = setInterval(function(){
				pageChange("rtl");
			}, config.interval);
		}

		setTimer();		

		config.container.append(pageContainer);

		function pageChange(direction){
			if(direction == "rtl"){
				pageArr[pageCurrent].css('z-index', '0');

				var pageNext;

				if(pageCurrent + 1 == pageArr.length){
					pageNext = 0;
				}else{
					pageNext = pageCurrent + 1;
				}

				pageArr[pageNext].css('z-index', '999').animate(
					{ 'left' : 0 },
					config.animateInterval, function() {
						/* stuff to do after animation is complete */
						pageArr[pageCurrent].css('left', pageWidth);
						navArr[pageCurrent].css('background-color', '#999');
						pageCurrent = pageNext;
						isAnimate = false;
						navArr[pageCurrent].css('background-color', 'orange');
				});
			}else if(direction == "ltr"){
				pageArr[pageCurrent].css('z-index', '0');

				var pageBefore;

				if(pageCurrent == 0){
					pageBefore = pageArr.length - 1;
				}else{
					pageBefore = pageCurrent - 1;
				}

				var opponentLeft = 0 - pageWidth;

				pageArr[pageBefore].css('left', opponentLeft);

				pageArr[pageBefore].css('z-index', '999').animate(
					{ 'left' : 0 },
					config.animateInterval, function() {
						/* stuff to do after animation is complete */
						pageArr[pageCurrent].css('left', pageWidth);
						navArr[pageCurrent].css('background-color', '#999');
						pageCurrent = pageBefore;
						isAnimate = false;
						navArr[pageCurrent].css('background-color', 'orange');
				});
			}else{
				pageArr[pageCurrent].css('z-index', '0');
				if(direction < pageCurrent){
					var opponentLeft = 0 - pageWidth;

					pageArr[direction].css('left', opponentLeft);

					pageArr[direction].css('z-index', '999').animate(
						{ 'left' : 0 },
						config.animateInterval, function() {
							/* stuff to do after animation is complete */
							pageArr[pageCurrent].css('left', pageWidth);
							navArr[pageCurrent].css('background-color', '#999');
							pageCurrent = direction;
							isAnimate = false;
							navArr[pageCurrent].css('background-color', 'orange');
					});
				}else if(direction > pageCurrent){
					pageArr[direction].css('z-index', '999').animate(
						{ 'left' : 0 },
						config.animateInterval, function() {
							/* stuff to do after animation is complete */
							pageArr[pageCurrent].css('left', pageWidth);
							navArr[pageCurrent].css('background-color', '#999');
							pageCurrent = direction;
							isAnimate = false;
							navArr[pageCurrent].css('background-color', 'orange');
					});
				}
			}
		}


		var isAnimate = false;

		var startPosition, endPosition;

		pageContainer[0].addEventListener("touchstart", touchStart, false);
		pageContainer[0].addEventListener("touchmove", touchMove, false);
		pageContainer[0].addEventListener("touchend", touchEnd, false);

		function touchStart(event){
			event.preventDefault();
			if(!event.targetTouches.length) return;
			var touch = event.targetTouches[0];
			startPosition = {
				startX : touch.pageX,
				startY : touch.pageY,
				startTime : Date.now()
			};
		}

		function touchMove(event){
			event.preventDefault();
			if(!event.targetTouches.length || isAnimate) return;
			var touch = event.targetTouches[0];
			endPosition = {
				endX : touch.pageX,
				endY : touch.pageY
			};
		}

		function touchEnd(event){
			event.preventDefault();
			if(endPosition != undefined){
				if(Number(Date.now() - startPosition.startTime) > 10){
					if((endPosition.endX - startPosition.startX) > 10){
						clearInterval(timer);
						isAnimate = true;
						pageChange("ltr");
						console.log("ltr");
						setTimer();
					}else if((endPosition.endX - startPosition.startX) < -10){
						clearInterval(timer);
						isAnimate = true;
						pageChange("rtl");
						console.log("rtl");
						setTimer();
					}
				}
			}
		}
	};
})(jQuery);