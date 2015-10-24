/**
     *  @name plugin
     *  @description description
     *  @version 1.0
     *  @options
     *    option
     *  @events
     *    event
     *  @methods
     *    init
     *    publicMethod
     *    destroy
     */
    ;(function($, window, undefined) {
      'use strict';

      var pluginName = 'pkpopup';
      var caches = {
        data: {},
        isExistData: function(url) {
          return !!this.data[url];
        }
      };

      function Plugin(element, options) {
        this.element = $(element);
        this.body = $(document.body);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
      }

      Plugin.prototype = {
        init: function() {
          // initialize
          this.bindCustomEvent();
        },
        bindCustomEvent: function() {
          // to do
          $.isFunction(this.options.onCallback) && this.options.onCallback();
          this.element.trigger('customEvent');
        },
        showPopup: function() {
          
          var that = this;
          var $popup = $(this.options.template);


          this.closePopup();
          if (caches.isExistData(that.options.url)) {
            $('.content', $popup).html(caches.data[that.options.url]);
            that.body.append($popup);
            that.findPopupElem($popup);
            that.handleEventPopup();
          } else {
            $.post( that.options.remote, {url: that.options.url}, function(data) {
              $('.content', $popup).html(data);
              caches.data[that.options.url] = data;
              that.findPopupElem($popup);
              that.handleEventPopup();
          
            });
          }
          that.body.append($popup);
        },
        closePopup: function() {
          $('.box-popup').remove();
        },
        handleEventPopup: function() {
          var that = this;
          console.log('handleEventPopup called');
          $('.box-popup > .content').find('[data-' + pluginName + ']').click(function() {
            console.log('button called');
            var instance = $(this).data('pkpopup');
            instance.showPopup();
          });

          $('.box-popup').click(function(){
            that.closePopup();
            console.log('box-popup called');
          });
          $('.box-popup > .content').click(function(e){
            console.log('content called');
            e.stopPropagation();
          });

          // console.log(event);
          // var that = this;
          // var template = $(this.options.template);
          // var cls = template.attr('class');
          // $('[data-' + pluginName + ']').click(function(e) {

          // });
          // $('.content', '.' + cls).click(function(e) {
          //   // e.stopPropagation();
          // });
          // $('.' + cls).click(function() {
          //   that.closePopup();
          // });

        },
        findPopupElem: function(popup) { 
          popup.find('[data-' + pluginName + ']').each(function() {
            $(this)[pluginName]();
          });
        },
        destroy: function() {
          // remove events
          // deinitialize
          $.removeData(this.element[0], pluginName);
        }
      };

      $.fn[pluginName] = function(options, params) {
        
        return this.each(function() {
          var instance = $.data(this, pluginName);
          if (!instance) {
            $.data(this, pluginName, new Plugin(this, options));
          } else if (instance[options]) {
            instance[options](params);
          }
        });
      };

      $.fn[pluginName].defaults = {
        url: '',
        modal: false,
        body: $(document.body),
        template: '<div class="box-popup">' +
                  '<div class="content"></div>' +
                  '</div>',
        onCallback: null,
        remote: '/popup'
      };

      $(function() {
        // $('[data-' + pluginName + ']').on('customEvent', function(){
          
        // });
        $('[data-' + pluginName + ']')[pluginName]();
        $(document.body).delegate('[data-' + pluginName + ']', 'click', function() {
          var instance = $(this).data('pkpopup');
          instance.showPopup();
        });

      });

    }(jQuery, window));