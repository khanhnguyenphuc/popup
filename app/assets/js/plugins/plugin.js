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
          var that = this;
          this.vars = {
            url: that.options.url,
            modal: that.options.modal,
            template: that.options.template
          };
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
          var $popup = $(this.vars.template);
          if (caches.isExistData(this.vars.url)) {
            this.body.append(caches.data[this.vars.url]);
          } else {
            $.post( '/popup', {url: that.options.url}, function(data) {
              $popup.append(data);
              that.body.append($popup);
              caches.data[that.vars.url] = data;
            });
          }
            
        },
        closePopup: function() {

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
                  '</div>',
        onCallback: null
      };

      $(function() {
        $('[data-' + pluginName + ']').on('customEvent', function(){
          $(this).click(function() {
            var instance = $.data(this, pluginName);
            instance.showPopup();
          });
        });
        $('[data-' + pluginName + ']')[pluginName]();
      });

    }(jQuery, window));