(function() {
  window.cuic = window.cuic || {};
  if (window.cuic.slide) {
    return;
  }
  function Slide(obj) {
    this._min = obj.val_min || 0;
    this._max = obj.val_max || 0;
    this._cur = obj.val_cur || this._min;
    this._stage = obj.stage || 1;
    this.skin = obj.skin || "";
    this.dom = {
      slide: obj.slide_dom
    };
    this.update_cb = obj.update_cb;
    this.init_cb = obj.init_cb;
  }
  Slide.prototype = {
    init: function() {
      var btn_S,
        btn_E,
        btn_X,
        _width,
        _cur,
        that = this,
        _max = this._max,
        _min = this._min,
        _stage = this._stage || 1,
        dom = this.dom;

      dom.slide.innerHTML =
        '<div class="inp_box"><input class="val_inp" type="text" value=""></div>' +
        '<div class="slide_box">' +
        '   <div class="slide_bar_bg"><span class="val_min">' +
        that._min +
        '</span><span class="val_max">' +
        that._max +
        "</span></div>" +
        '   <div class="slide_bar"><a href="javascript:;" class="btn_drag"></a><span class="val_cur"></span></div></div>' +
        '<div class="btn_box"><a href="javascript:;" class="btn_dec">-</a><a href="javascript:;" class="btn_inc">+</a></div>';

      dom.val_inp = dom.slide.querySelector(".val_inp");
      dom.slide_bar_bg = dom.slide.querySelector(".slide_bar_bg");
      dom.slide_bar = dom.slide.querySelector(".slide_bar");
      dom.btn_drag = dom.slide.querySelector(".btn_drag");
      dom.btn_dec = dom.slide.querySelector(".btn_dec");
      dom.btn_inc = dom.slide.querySelector(".btn_inc");
      dom.val_cur = dom.slide.querySelector(".val_cur");

      that.width = dom.slide_bar_bg.offsetWidth;
      that.update();

      dom.btn_drag.addEventListener("touchstart", function(ev) {
        _width = that.width;
        _cur = that._cur;
        btn_S = ev.touches[0]["clientX"];
      });
      dom.btn_drag.addEventListener("touchmove", function(ev) {
        btn_E = ev.touches[0]["clientX"];
        btn_X = btn_E - btn_S;
        that._cur = _cur + Math.floor((btn_X / _width) * (_max - _min));
        that.update();
      });
      dom.btn_drag.addEventListener("keydown", function(ev) {
        if (ev.keyCode == 37) {
          _cur = that._cur;
          that._cur = _cur - _stage;
          that.update();
        } else if (ev.keyCode == 39) {
          _cur = that._cur;
          that._cur = _cur + _stage;
          that.update();
        }
      });

      dom.btn_dec.addEventListener("click", function(ev) {
        if (!dom.btn_dec.classList.contains("disable")) {
          _cur = that._cur;
          that._cur = _cur - _stage;
          that.update();
        }
      });
      dom.btn_inc.addEventListener("click", function(ev) {
        if (!dom.btn_inc.classList.contains("disable")) {
          _cur = that._cur;
          that._cur = _cur + _stage;
          that.update();
        }
      });

      //   dom.val_inp.addEventListener("input", function(ev) {
      //     if (dom.val_inp.value.length > 0) {
      //       that._cur = dom.val_inp.value;
      //       that.update();
      //     }
      //   });
      dom.val_inp.addEventListener("blur", function(ev) {
        console.log(dom.val_inp.value);
        that._cur = dom.val_inp.value;
        that.update();
      });

      this.init_cb && this.init_cb(this);
    },
    update: function() {
      var dom = this.dom;

      if (this._cur >= this._max) {
        this._cur = this._max;
      } else if (this._cur <= this._min) {
        this._cur = this._min;
      } else {
        this._cur = Math.round(this._cur / this._stage) * this._stage;
        this._cur = Math.max(this._min, this._cur);
        this._cur = Math.min(this._max, this._cur);
      }

      if (this._min == this._max) {
        dom.slide_bar.style.width = !this._min || "100%";
      } else {
        dom.slide_bar.style.width =
          ((this._cur - this._min) / (this._max - this._min)) * 100 + "%";
      }

      dom.val_inp.value = dom.val_cur.innerHTML = this._cur;
      dom.btn_dec.className =
        this._cur <= this._min ? "btn_dec disable" : "btn_dec";
      dom.btn_inc.className =
        this._cur >= this._max ? "btn_inc disable" : "btn_inc";
      dom.btn_drag.className =
        this._min == this._max ? "btn_drag disable" : "btn_drag";

      this.update_cb && this.update_cb(this);
    }
  };
  window.cuic.slide = {
    init: function(obj) {
      var slide = new Slide(obj);
      slide.init();
    }
  };
})();
