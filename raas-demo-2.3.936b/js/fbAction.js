/**
 * FB Action
 * Implementation of posting Facebook Open Graph action
 *
 */
(function ($) {
    var fbAction = fbAction || {};

    fbAction.printResponse = function (response) {
        if (response.errorCode == 0) {
            $('.fb-popup').html('<div class="res-text fb-info">An action has been posted to your Facebook timeline</div>');
            setTimeout(function () {
                $('.fb-popup').fadeOut();
            }, 3000);
        }
        else {
            console.log('Error :' + response.errorMessage);
            $('.fb-popup').fadeOut();
        }
        $('.cooked').addClass('cooked-it');
    };

    fbAction.postCook = function () {
        // create a new action in Graph API
        var place = $('.location-select select').find(":selected").val();
        var friends = "";
        var popup = $('.fb-popup')[0];
        var flist = $.data(popup, "flist");
        var msg = $('.fb-info-text').val();
        var img = 'http://' + window.location.host + '/' + $('.recipe-image img').attr('src');
        if (typeof flist !== 'undefined') {
            flist.forEach(function (friend) {
                friends += friend.id + ",";
            });
        }
        var fbParams = {
            recipe: document.URL,
            image: img,
			      message: msg,
            tags: friends.substring(0, friends.length - 1)
        };
        if (place !== "") {
          fbParams.place = place;
        }
        var params = {
            graphPath: "/me/socializedemo:cook",
            graphParams: fbParams,
            method: "post",
            callback: fbAction.printResponse
        };
        fbAction.beacon();
        gigya.socialize.facebookGraphOperation(params);

    };

    fbAction.showPopup = function (response) {
        //if (response.errorCode == 0) {
            $('.fb-popup').fadeIn();
        //}
    };
    fbAction.reqFbPerm = function () {
        var params = {
            provider: 'facebook',
            permissions: 'publish_actions',
            callback: fbAction.showPopup
        };
        gigya.socialize.requestPermissions(params);
    };
    fbAction.frindsTags = function (evt) {
        var friends = evt.friends.arr;
        var frindsArray = [];
        if (friends != null) {
            friends.forEach(function (f) {
                var friend = {
                    id: f.identities.facebook.providerUID,
                    name: f.identities.facebook.nickname
                };
                frindsArray.push(friend);
            });
            var name = frindsArray[0].name;
            var len = frindsArray.length - 1;
            $('.fname').html(name);
            $('.and').html(" and ");
            $('.friends-num').html(len + " more");
            var popup = $('.fb-popup')[0];
            $.data(popup, "flist", frindsArray);
        }
    };

    fbAction.doCook = function () {
        fbAction.reqFbPerm();
    };
    fbAction.beacon = function () {
      var appId = $('meta[property="fb:app_id"]').attr('content');
      var toSend = $.param({
        payload: {
          resource: "gigya_gigya",
          appid: appId,
          version: 1
        }
      }
      );
      $('body').append('<img src="https://www.facebook.com/impression.php?plugin=featured_resources&' + toSend + '" width="1" height="1"/>');
    }


    $(document).ready(function () {

        $('.fb-popup .friends').click(function () {
            var params = {};
            params['onSelectionDone'] = fbAction.frindsTags;
            gigya.socialize.showFriendSelectorUI(params);
        });
        $('.fb-popup .close').click(function (evnt) {
            evnt.preventDefault();
            $('.fb-popup').fadeOut();
        });
        $('.post a').click(function (ev) {
            ev.preventDefault();
            fbAction.postCook();
        });
        $(".cooked").hover(function () {
            if (!$(this).hasClass('cooked-it')) {
                $('#cookedHint').show();
            }
        }, function () {
            if (!$(this).hasClass('cooked-it')) {
                $('#cookedHint').hide();
            }

        });
        $("#cooked").click(function () {
            fbAction.doCook();
        });

    });

})(jQuery);