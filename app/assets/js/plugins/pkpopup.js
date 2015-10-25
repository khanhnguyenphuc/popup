/**
     *  @name pkpopup
     *  @description get html into popup by ajax
     *  @version 1.0
     *  @options
     *    element: null,
     *    url: '',
     *    modal: false,
     *    body: $(document.body),
     *    template: '<div class="box-pkpopup">' +
     *              '<div class="content-pkpopup"></div>' +
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
        isExistUrl: function(url) {
          return !!this.data[url];
        },
        isExistData: function(url, data) {
          if (!data) {data = {};}
          return $(caches.data[url][data]).not(data).get().length === 0 && $(data).not(caches.data[url][data]).get().length === 0;
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
          if (caches.isExistUrl(that.options.url) && caches.isExistData(that.options.url, that.options.data)) {
            $('.content-pkpopup', $popup).html(caches.data[that.options.url]);
            that.handlePopup($popup);
            that.bindCustomEvent();
          } else {
            var data = {};
            if (that.options.data) { data = that.options.data; }
            $.post( that.options.remote, {url: that.options.url, data: data}, function(result) {
              $('.content-pkpopup', $popup).html(result);
              that.handlePopup($popup);
              that.bindCustomEvent();
              caches.data[that.options.url] = {
                url: result,
                data: data
              };
            });
          }
          
        },
        closePopup: function() {
          $('.box-pkpopup').remove();
        },
        handlePopup: function($popup) {
          $('.content-pkpopup', $popup).prepend(ui.close);
          $.data($popup, pluginName, this);
          this.body.append($popup);
          this.findBtnPopup($popup);
          this.handleEventPopup();
        },
        handleEventPopup: function() {
          var that = this;

          $('.box-pkpopup .close').click(function(e) {
            that.closePopup();
            e.stopPropagation();
          });
          if (!that.options.modal) {
            $('.box-pkpopup').click(function(e){
              that.closePopup();
              e.stopPropagation();
            });
            $('.box-pkpopup > .content-pkpopup').click(function(e){
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
        template: '<div class="box-pkpopup">' +
                  '<div class="content-pkpopup"></div>' +
                  '</div>',
        onCallback: null,
        remote: '/popup'
      };

      $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
      });

    }(jQuery, window));