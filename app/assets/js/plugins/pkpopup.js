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
     *              '<div class="content"></div>' +
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
     *    findPopupElem
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
          this.bindCustomEvent();
        },
        bindCustomEvent: function() {
          // to do
          var that = this;
          this.element.on('click', function() {
            that.showPopup();
          });
          $.isFunction(this.options.onCallback) && this.options.onCallback();
          this.element.trigger('customEvent');
        },
        showPopup: function() {
          
          var that = this;
          var $popup = $(this.options.template);


          this.closePopup();
          if (caches.isExistData(that.options.url)) {
            $('.content', $popup).html(caches.data[that.options.url]);
            $('.content', $popup).prepend(ui.close);
            that.body.append($popup);
            that.findPopupElem($popup);
            that.handleEventPopup();
          } else {
            $.post( that.options.remote, {url: that.options.url}, function(data) {
              $('.content', $popup).html(data);
              $('.content', $popup).prepend(ui.close);
              that.body.append($popup);
              caches.data[that.options.url] = data;
              that.findPopupElem($popup);
              that.handleEventPopup();
            });
          }
          
        },
        closePopup: function() {
          $('.box-popup').remove();
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
            $('.box-popup > .content').click(function(e){
              console.log('content called');
              e.stopPropagation();
            });
          }
            
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
        element: null,
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
        $('[data-' + pluginName + ']')[pluginName]();
      });

    }(jQuery, window));