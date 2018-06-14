"use strict";

var elevator = {
  FHEIGHT: 414, // 保存楼层高度
  UPLEVEL: 0, // 保存亮灯区域的上限
  DOWNLEVEL: 0, // 保存亮灯的下限
  $spans: null, // 保存所有气泡的span
  $elevator: null, // 保存电梯按钮的div
  init() {
    var that = this; // 保存elevator对象

    // 计算UPLEVEL和DOWNLEVEL
    that.UPLEVEL = (innerHeight - that.FHEIGHT) / 2;
    that.DOWNLEVEL = that.UPLEVEL + that.FHEIGHT;

    // 找到气泡span
    that.$spans = $(".floor > header > span");

    // 找到电梯按钮
    that.$elevator = $("#elevator");

    // 为当前窗口添加滚动事件 (绑在window上)
    $(window).scroll(function () {
      that.checkSpan();

      // 如果气泡亮，显示按钮
      if (that.$spans.is(".hover")) that.$elevator.show();
      else that.$elevator.hide();// 否则隐藏按钮
    });

    // 为elevator下ul绑定鼠标进入事件
    that.$elevator.on("mouseover", "li", function () {
      $(this).children(":first").hide().next().show();
    })
    // 为elevator下ul绑定鼠标移出事件
    .on("mouseout", "li", function () {
      // 获得当前li的下标
      var i = $(this).index("#elevator>ul>li");
      // 如果当前li对应的span没亮灯
      if (!that.$spans.eq(i).is(".hover")) {
        $(this).children(":first").show().next().hide();
      }
    })
    // 为elevator下ul绑定单击事件
    .on("click", "li", function () {
      // 获得当前li的下标i
      var i = $(this).index("#elevator>ul>li");
      // 获得spans中i位置的span的offsetTop
      var offsetTop = that.$spans.eq(i).offset().top;
      // 计算滚动距离
      var scroll = offsetTop - that.UPLEVEL;
      // 滚动
      $(document.documentElement).stop(true).animate({
        scrollTop: scroll
      }, 500);
    });

  },
  checkSpan() { // 检查每个楼层是否亮灯
    var that = this; // 保存elevator对象

    that.$spans.each(function (i) { // this -> 当前span
      // 获取当前span的offsetTop
      var offsetTop = $(this).offset().top;
      // 获取页面滚动的scrollTop
      var scrollTop = $(document.documentElement).scrollTop();

      // 如果offsetTop>(scrollTop+UPLEVEL)&&<=(scrollTop+DOWNLEVEL)
      if (offsetTop > (scrollTop + that.UPLEVEL)
        && offsetTop <= (scrollTop + that.DOWNLEVEL)) {
        // 设置当前span的class为hover
        $(this).addClass("hover");

        // 找到id为elevator下ul中i位置的li
        that.$elevator.find("ul > li").eq(i)
          // 显示第二个a，隐藏第一个a
          .children(":first").hide()
          .next().show();

      } else { //否则
        // 清除当前span的class
        $(this).removeClass("hover");

        // 找到id为elevator下ul中i位置的li
        that.$elevator.find("ul > li").eq(i)
          // 隐藏第二个a，显示第一个a
          .children(":first").show()
          .next().hide();
      }
    });
  }
}
elevator.init();
