Meteor.startup(function () {

});

if (Meteor.isClient) {


  Template.body.rendered = function() {

    Session.setDefaultPersistent("showSidebar", true);
    adjustSidebar();
    if(!this._rendered) {
      this._rendered = true;
    }
  }

  Template.body.helpers({
    showSidebar: function () {
      return Session.get("showSidebar");
    }
  });

  Template.body.events({
    "change .toggle-switch input": function (event) {
      setSidebarState(event.target.checked);
    },
    "click #top-search > a": function (event) {
      event.preventDefault();
      $('#header').addClass('search-toggled');
    },
    "click #top-search-close": function (event) {
      event.preventDefault();
      $('#header').removeClass('search-toggled');
    },
    "click .sub-menu > a": function(event) {
      event.preventDefault();
      $(event.target).next().slideToggle(200);
      $(event.target).parent().toggleClass('toggled');
    },
    "click #menu-trigger, click #chat-trigger": function (event) {
      triggerHandler(event);
    },
    "click [data-clear='notification']": function(event) {
      console.log("notification");
      clearNotification(event);
    },
    "shown.bs.dropdown .dropdown": function (event) {
        //this didn't work
        console.log("new dropdown 1");
    },
    "hide.bs.dropdown .dropdown": function (event) {
        //this didn't work
        console.log("new dropdown 2");
    },
    "click .profile-menu > a": function (event) {
        event.preventDefault();
        var self = event.currentTarget;
        $(self).parent().toggleClass('toggled');
        $(self).next().slideToggle(200);
    },
    "click [data-action='clear-localstorage']": function (event) {
        event.preventDefault();
        console.log("clear local storage");
    },
    "click [data-action='fullscreen']": function (event) {
      event.preventDefault();
      var self = event.currentTarget;
      //Launch
      function launchIntoFullscreen(element) {

          if(element.requestFullscreen) {
              element.requestFullscreen();
          } else if(element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
          } else if(element.webkitRequestFullscreen) {
              element.webkitRequestFullscreen();
          } else if(element.msRequestFullscreen) {
              element.msRequestFullscreen();
          }
      }

      //Exit
      function exitFullscreen() {

          if(document.exitFullscreen) {
              document.exitFullscreen();
          } else if(document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
          } else if(document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
          }
      }

      launchIntoFullscreen(document.documentElement);
      var fs = $("[data-action='fullscreen']");
      fs.closest('.dropdown').removeClass('open');

    }
  });


  var triggerHandler = function (event) {
      var self = event.currentTarget;
      event.preventDefault();
      var x = $(self).data('trigger');

      $(x).toggleClass('toggled');
      $(self).toggleClass('open');

      //Close opened sub-menus
      $('.sub-menu.toggled').not('.active').each(function(){
        $(self).removeClass('toggled');
        $(self).find('ul').hide();
      });

      $('.profile-menu .main-menu').hide();

      if (x == '#sidebar') {
        $elem = '#sidebar';
        $elem2 = '#menu-trigger';

        $('#chat-trigger').removeClass('open');

        if (!$('#chat').hasClass('toggled')) {
          $('#header').toggleClass('sidebar-toggled');
        }
        else {
          $('#chat').removeClass('toggled');
        }
      }

      if (x == '#chat') {
        $elem = '#chat';
        $elem2 = '#chat-trigger';

        $('#menu-trigger').removeClass('open');

        if (!$('#sidebar').hasClass('toggled')) {
          $('#header').toggleClass('sidebar-toggled');
        }
        else {
          $('#sidebar').removeClass('toggled');
        }
      }

      //When clicking outside
      if ($('#header').hasClass('sidebar-toggled')) {
        $(document).on('click', function (e) {
          if (($(e.target).closest($elem).length === 0) && ($(e.target).closest($elem2).length === 0)) {
            setTimeout(function(){
              $($elem).removeClass('toggled');
              $('#header').removeClass('sidebar-toggled');
              $($elem2).removeClass('open');
            });
          }
        });
      }
    };

  var clearNotification = function (event) {
      //console.log("notification");
      event.preventDefault();
      var self = event.currentTarget;
      var x = $(self).closest('.listview');
      var y = x.find('.lv-item');
      var z = y.size();

      $(self).parent().fadeOut();

      x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
      x.find('.grid-loading').fadeIn(1500);


      var w = 0;
      y.each(function(){
        var z = $(this);
        setTimeout(function(){
          z.addClass('animated fadeOutRightBig').delay(1000).queue(function(){
            z.remove();
          });
        }, w+=150);
      })

      //Popup empty message
      setTimeout(function(){
        $('#notifications').addClass('empty');
      }, (z*150)+200);
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
function setSidebarState(checked) {
  Session.setPersistent("showSidebar", checked);
  adjustSidebar();
}

function adjustSidebar(){
  var ischecked = Session.get("showSidebar");
  if (ischecked === true) {
    $('body').addClass('toggled sw-toggled');
  } else {
    $('body').removeClass('toggled sw-toggled');
  }
}
