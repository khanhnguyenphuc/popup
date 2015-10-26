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
     *    handlePopup
     *    handleEventPopup
     *    findBtnPopup
     *    destroy
     */
    ;(function($, window, undefined) {
      'use strict';

      var pluginName = 'pkpopup';
      /*
      * caches {url: {
          html: '',
          data: {}
        }
      */
      var caches = {
        data: {},
        isExistUrl: function(url) {
          return !!this.data[url];
        },
        isExistData: function(url, data) {
          return JSON.stringify(caches.data[url].data) === JSON.stringify(data);
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

          // Custom css for popup content
          if (this.options.css) {
            $('.content-pkpopup', $popup).css(this.options.css);
          }
          /* Check Exist url
          * if exist then get from caches
          * else load ajax to get html and add to cachaes
          */
          var data = {};
          if (that.options.data) { data = that.options.data; }
          
          if (caches.isExistUrl(that.options.url) && caches.isExistData(that.options.url, data)) {
            $('.content-pkpopup', $popup).html(caches.data[that.options.url].html);
            that.handlePopup($popup);
            that.bindCustomEvent();
          } else {
            
            $.post( that.options.remote, {url: that.options.url, data: data}, function(result) {
              $('.content-pkpopup', $popup).html(result);
              that.handlePopup($popup);
              that.bindCustomEvent();
              caches.data[that.options.url] = {
                html: result,
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
                  '<div class="content-pkpopup wordwrap"></div>' +
                  '</div>',
        onCallback: null,
        remote: '/popup'
      };

      $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
        $('.btn-pop3').pkpopup({
          url: 'popup3.jade',
          data: {name: 'Khanh'},
          modal: true,
          onCallback: function() {
            $('.btn-close').on('click', function() {
              $('.btn-pop3').pkpopup('closePopup');
            });
          },
          css: {
            width: '300px',
            height: '200px',
            left: '20%'
          }
        });
        $('.btn-pop4').pkpopup({
          url: 'popup3.jade',
          data: {name: 'Hoang'},
          modal: true,
          onCallback: function() {
            console.log('onCallback called');
            $('.btn-close').on('click', function() {
              $('.btn-pop4').pkpopup('closePopup');
            });
          }
        });
      });

    }(jQuery, window));