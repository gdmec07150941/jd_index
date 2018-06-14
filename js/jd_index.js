"use strict";

/*广告图片数组*/
var imgs=[
	{"i": 0, "img": "Images/index/banner_01.jpg"},
  {"i": 1, "img": "Images/index/banner_02.jpg"},
  {"i": 2, "img": "Images/index/banner_03.jpg"},
  {"i": 3, "img": "Images/index/banner_04.jpg"},
  {"i": 4, "img": "Images/index/banner_05.jpg"},
];

var slider = {
  LIWIDTH: 670, // 保存li宽度
  $ulImgs: null, // 保存ul#imgs
  $ulIndexs: null, // 保存ul#indexs
  DURATIOIN: 500, // 保存单次移动的时间
  WAIT: 3000, // 保存轮播的等待时间
  moved: 0, // 保存已经左移的li个数
  init() { // 初始化程序
    // 找到ul#imgs
    this.$ulImgs = $("#imgs");
    // 找到ul#indexs
    this.$ulIndexs = $("#indexs");

    this.initView();
    this.autoMove();

    // 鼠标进入slider,停止轮播, 移出再次启动
    $("#slider").hover(function () { // over
      this.$ulImgs.stop(true);
    }.bind(this), function () { // out
      this.autoMove(); // 再次启动动画
    }.bind(this));

    // 为$ulImgs添加鼠标进入事件监听, 只允许li > img 响应事件
    this.$ulImgs.on("mouseover", "li>img", function (e) {
      var $img = $(e.target);
      // 获得当前img的下标
      var i = $img.index("#imgs img");
      // 修改moved = i
      this.moved = i;
      // 修改#ulImgs的left为-moved*LIWIDTH
      this.$ulImgs.css("left", -this.moved * this.LIWIDTH);
      // 根据moved修改hover
      this.changeHover();
    }.bind(this));

    // 为$ulIndexs添加鼠标进入事件监听, 只允许li响应
    this.$ulIndexs.on("mouseover", "li", function (e) {
      var $li = $(e.target);
      if (!$li.is(".hover")) { // 如果当前li不是hover状态
        var endi = $li.index("#indexs > li"); // 获取鼠标移入的li
        var stari = $(".hover").index("#indexs > li"); // 获取hover状态的li
        // 修改moved为endi-stari
        this.moved += (endi - stari);
        this.changeHover(); // 立刻修改hover状态
        // 修改$ulImgs位置  先stop,防止动画叠加
        this.$ulImgs.stop(true).animate({
          left: -this.moved * this.LIWIDTH
        }, this.DURATION);
      }
    }.bind(this));

  },
  initView() { // 页面初始化
    // 遍历imgs,生成htmlImgs和htmlIndexs
    for (var i = 0, htmlImgs = "", htmlIndexs = ""; i < imgs.length; i++) {
      // htmlImgs <li><img></li>
      htmlImgs += `<li><img src="${imgs[i].img}" /></li>`;
      // htmlIndexs <li></li>
      htmlIndexs += `<li>${i + 1}</li>`;
    }// (遍历结束)
    // 设置ul#imgs内容为htmlImgs
    this.$ulImgs.html(htmlImgs);
    // 设置ul#imgs宽为imgs个数*LIWIDTH
    this.$ulImgs.css("width", (imgs.length + 1)* this.LIWIDTH);
    // 在$ulImgs末尾追加一个li(克隆第一个li, 追加到末尾)
    this.$ulImgs.append(this.$ulImgs.children(":first").clone());
    // 设置ul#indexs内容为htmlIndexs
    this.$ulIndexs.html(htmlIndexs);
    // 设置$ulIndexs中第一个li添加hover class
    this.$ulIndexs.children(":first").addClass("hover");
  },
  autoMove() { // 自动轮播
    this.moved++;
    // 先等待WAIT, 再移动到moved*LIWIDTH
    this.$ulImgs.animate({"null": 1}, this.WAIT, function () { // this->slider对象

      this.$ulImgs.animate({
        left: - this.moved * this.LIWIDTH
      }, this.DURATION, function () { // 本次移动后
        if (this.moved === imgs.length) {// 如果moved等于imgs.length
          this.$ulImgs.css("left", 0); // 将ul#imgs的left = 0
          this.moved = 0; // 将moved = 0
        }
        this.changeHover();
        // 再次启动自动轮播
        this.autoMove();
      }.bind(this));

    }.bind(this));
  },
  changeHover() { // 根据moved调整原点添加hover
    // 将ul#indexs中moved位置的原点添加hover,去掉兄弟的hover
    this.$ulIndexs.children().eq(this.moved)
        .addClass("hover").siblings().removeClass("hover");
  }
};
slider.init();