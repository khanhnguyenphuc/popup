/**
     *  @name pkpopup
     *  @description get html into popup by ajax
     *  @version 1.0
     *  @options
     *    element: null,
     *    url: '',
     *    modal: false,
     *    body: $(document.body),
     *    template: '<div class="box-popup">' +
     *              '<div class="content-popup"></div>' +
     *              '</div>',
     *    onCallback: null,
     *    remote: '/popup'
     *  @events
     *    click
     *  @methods
     *    init
     *    bindCustomEvent
     *    showPopup
     *    closePopup
     *    handleEventPopup
     *    findBtnPopup
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
      var ui = {
        close: '<button type="button" class="close" title="Close"><span aria-hidden="true">×</span></button>'
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
          var that = this;
          this.element.on('click', function() {
            that.showPopup();
          });
        },
        bindCustomEvent: function() {
          $.isFunction(this.options.onCallback) && this.options.onCallback();
          this.element.trigger('customEvent');
        },
        showPopup: function() {
          
          var that = this;
          var $popup = $(this.options.template);

          this.closePopup();
          if (caches.isExistData(that.options.url)) {
            $('.content-popup', $popup).html(caches.data[that.options.url]);
            that.handlePopup($popup);
            that.bindCustomEvent();
          } else {
            $.post( that.options.remote, {url: that.options.url}, function(data) {
              $('.content-popup', $popup).html(data);
              that.handlePopup($popup);
              that.bindCustomEvent();
              caches.data[that.options.url] = data;
            });
          }
          
        },
        closePopup: function() {
          $('.box-popup').remove();
        },
        handlePopup: function($popup) {
          $('.content-popup', $popup).prepend(ui.close);
          $.data($popup, pluginName, this);
          this.body.append($popup);
          this.findBtnPopup($popup);
          this.handleEventPopup();
        },
        handleEventPopup: function() {
          var that = this;

          $('.box-popup .close').click(function(e) {
            that.closePopup();
            e.stopPropagation();
          });
          if (!that.options.modal) {
            $('.box-popup').click(function(e){
              that.closePopup();
              e.stopPropagation();
            });
            $('.box-popup > .content-popup').click(function(e){
              console.log('content called');
              e.stopPropagation();
            });
          }
            
        },
        findBtnPopup: function(popup) { 
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
        element: null,
        url: '',
        modal: false,
        body: $(document.body),
        template: '<div class="box-popup">' +
                  '<div class="content-popup"></div>' +
                  '</div>',
        onCallback: null,
        remote: '/popup'
      };

      $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
      });

    }(jQuery, window));