siteScreenSet = "Default";  // Also need to change this parameter in the customize.php and customize_processor.php file !!!
RegistrationLoginScreen = siteScreenSet + "-RegistrationLogin";
ProfileUpdateScreen= siteScreenSet + "-ProfileUpdate";
ReAuthenticationScreen= siteScreenSet + "-ReAuthentication";

//NEED TO MOVE A LOT OF THIS TO invite.inc.php
    function userLoggedIn(response) {
        userInfo= response.user;
        userFirstName = userInfo.firstName;   
    }
    function onLoad() {
            // get user info
            gigya.socialize.getUserInfo({ callback: userLoggedIn });
        }
    onLoad();



	// START GA CODE FOR TESTING - 0003 -->
	    function goGoo(screenData) {
            if (screenData["nextScreen"] !=="undefined" || (screenData["nextScreen"] !==null)) {
                 //Do Something 
           }
        }
        function onLoginHandler(loginEventObj) { 
            var userInfo = loginEventObj;
            var userProvider= userInfo.loginProvider;
            // DO Something
        }
        function onErrorHandler(errorEventObj) {
            if (errorEventObj !=='undefind' || (errorEventObj !==null)) {
                var errorInfo = errorEventObj;
                var userError = errorInfo.errorMessage;
                // DO Something
            }
        }
        gigya.socialize.addEventHandlers({
            onLogin: onLoginHandler
        })
        //////////////////////////////////////////////////////////////////////////////////////////
        

        // ERROR FIELDS
     function beforeSubmit() {
          $.each($(".gigya-screen .gigya-error-msg.gigya-error-msg-active"), function(idx, field) {
               var errFld = $(field).attr("data-bound-to");
               console.log(errFld);
               // DO Something
            });  
        }
     $(document).on("click", ".gigya-input-submit", function() {
        beforeSubmit();
     });
        
	// END GA CODE FOR TESTING - 0003 -->

var gigyaPlugins = gigyaPlugins || {};

gigyaPlugins.login = function () {
    var params = {
        "screenSet": RegistrationLoginScreen,
        "mobileScreenSet": RegistrationLoginScreen,
        "onBeforeScreenLoad": goGoo,
        "onError": onErrorHandler
    }
    gigya.accounts.showScreenSet(params);
};

gigyaPlugins.logout = function () {
 gigya.accounts.logout();
}

gigyaPlugins.register = function () {
    var params = {
        "screenSet": RegistrationLoginScreen,
        "mobileScreenSet": RegistrationLoginScreen,
        "startScreen": "gigya-register-screen",
        "onBeforeScreenLoad": goGoo,
        "onError": onErrorHandler
    }
    gigya.accounts.showScreenSet(params);
}

gigyaPlugins.editProfile = function () {
    var params = {
        "screenSet": ProfileUpdateScreen,
        "mobileScreenSet": ProfileUpdateScreen,
        "onBeforeScreenLoad": goGoo,
        "onError": onErrorHandler
    }
    gigya.accounts.showScreenSet(params);
}


gigyaPlugins.ratings = function () {
    var params = {
        containerID: 'ratings',
        streamID: 'home',
        categoryID: 'demositeReview',
        linkedCommentsUI: 'reviews'
    };
    gigya.comments.showRatingUI(params);
};

gigyaPlugins.reviews = function () {
    var commentsParams = {
        categoryID: 'demositeReview',
        containerID: 'reviews',
        streamID: 'home',
        scope: 'both',
        privacy: 'public',
        version: 2,
        deviceType: 'auto'
    };
    gigya.comments.showCommentsUI(commentsParams);
};

gigyaPlugins.followBar = function () {
    var followBarParams = {
        containerID: 'FollowBar',
        iconSize: 42,
        buttons: [
            {   provider: 'facebook',
                actionURL: 'https://www.facebook.com/gigya',
                action: 'dialog',
                iconURL: 'images/follow_bar/Facebook_on_follow.png'
            },
            {   provider: 'twitter',
                followUsers: 'gigya',
                action: 'dialog',
                iconURL: 'images/follow_bar/Twitter_on_follow.png'
            },
            {   provider: 'googleplus',
				actionURL: 'https://plus.google.com/+gigya',
                action: 'dialog',
                iconURL: 'images/follow_bar/Google+_on_follow.png'
            },
            {   provider: 'rss',
                actionURL: 'http://www.gigya.com/feed/',
                action: 'window',
                title: 'Subscribe via RSS',
                iconURL: 'images/follow_bar/Rss_hover_follow.png'
            },
            {   provider: 'linkedin',
                actionURL: 'http://www.linkedin.com/company/gigya',
                action: 'window',
                title: 'Gigya on Linkedin',
                iconURL: 'images/follow_bar/Linkedin_hover_follow.png'
            }
        ]
    };
    // Load the Follow Bar plugin:
    gigya.socialize.showFollowBarUI(followBarParams);
};

gigyaPlugins.gm = function () {
    var userStatusUA = new gigya.socialize.UserAction();
    userStatusUA.setTitle('$levelTitle');
    userStatusUA.setDescription('Challenge title: $challengeTitle | level title: $levelTitle | challenge description: $challengeDescription | level Description: $levelDescription');
    userStatusUA.addImage('$badgeURL');
    
	var userStatusParams = {
        containerID: 'divUserStatus',
        userAction: userStatusUA,
		challenge: '_default',
        shareParams: {
            showEmailButton: true
        },
        width: 293
    };
    var achievmentsParams = {
        containerID: 'divAchiements',
        width: 293
    };
	
    var leaderboardParams = {
        containerID: 'divLeaderboard',
        period: 'all',
        width: 293
    };
    gigya.gm.showNotifications({debugMode: false});
    gigya.gm.showUserStatusUI(userStatusParams);
    gigya.gm.showAchievementsUI(achievmentsParams);
    gigya.gm.showLeaderboardUI(leaderboardParams);
	
};

gigyaPlugins.activityFeed = function () {
    gigya.socialize.showFeedUI({containerID: 'ActivityFeed', width: "100%", height: "271"}); //width: "293"
};

gigyaPlugins.loginHandler = function (response) {
    var profile = response['user'];
    sessionStorage.setItem("gigyaName", profile.nickname);
    sessionStorage.setItem("gigyaFirstName", profile.firstName);
    sessionStorage.setItem("gigyaAvatar", profile.thumbnailURL);
    sessionStorage.setItem("gigyaUID", profile.UID);
    gigyaPlugins.helpers.setNameAndAvatar(profile.firstName, profile.thumbnailURL);
    response.action = 'login';
    $.ajax({
        "type": "POST",
        "url": "raas-reg.php",
        "data": response
    }).done(function(ajaxRes) {
        var ajaxJson = JSON.parse(ajaxRes);
        if (ajaxJson.result == 'success') {
            $('.logged-out').fadeOut(function () {
                $('.logged-in').fadeIn();
            });
        }
    });
};

gigyaPlugins.shareBar = function (containerId) {
    var shareButtons = [
        {
            'provider': 'Facebook',
            'iconImgUp': 'images/share_bar/Facebook.png' // override the default icon
        },
        {
            'provider': 'Twitter',
            'iconImgUp': 'images/share_bar/Twitter.png'
        },
        {
            'provider': 'Googleplus',
            'iconImgUp': 'images/share_bar/Google_Plus.png'
        },
        {
            'provider': 'LinkedIn',
            'iconImgUp': 'images/share_bar/LinkedIn.png'
        },
        {
            'provider': 'Messenger',
            'iconImgUp': 'images/share_bar/Messenger.png'
        },
        {
            'provider': 'digg',
            'iconImgUp': 'images/share_bar/Digg.png'
        },
        {
            'provider': 'share',
            'iconImgUp': 'images/share_bar/more_share.png'
        }
    ];

    // Define the Share Bar Plugin's params object
    var shareParams = {
        userAction: gigyaPlugins.helpers.getDefualtUserAction(),
        showCounts: 'none',
        containerID: containerId,
        scope: 'both',
        privacy: 'public',
        iconsOnly: true,
        //useEmailCaptcha: true, // Use a CAPTCHA mechanism when sending emails
        shareButtons:shareButtons // list of providers
    };

    // Load the Share Bar Plugin:
    gigya.socialize.showShareBarUI(shareParams);
};

gigyaPlugins.reactionsBar = function (containerId, barId, reactionsType) {
    // Define the Reaction buttons
    var defaultReactions = [
        {text: 'Recommend', ID: 'recommend', iconImgUp: 'images/reactions/Recommend.png', iconImgOver: 'images/reactions/Recommend_hover.png', tooltip: 'I recommend this recipe', feedMessage: 'I recommend this recipe!', headerText: 'You recommend this recipe,'}
        ,
        {text: 'Dislike', ID: 'dislike', iconImgUp: 'images/reactions/Dislike.png', iconImgOver: 'images/reactions/Dislike_hover.png', tooltip: 'I dislike this recipe', feedMessage: 'I dislike this recipe!', headerText: 'You dislike this recipe,'}
        ,
        {text: 'Delicious', ID: 'Delicious', iconImgUp: 'images/reactions/Delicious.png', iconImgOver: 'images/reactions/Delicious_hover.png', tooltip: 'This recipe is delicious', feedMessage: 'Delicious', headerText: 'You think this recipe is delicious,'}
        ,
        {text: 'Yuck', ID: 'yuck', iconImgUp: 'images/reactions/Yuck.png', iconImgOver: 'images/reactions/Yuck_hover.png', tooltip: 'This recipe is yucky', feedMessage: 'Yuck!', headerText: 'You think this recipe is yuck,'}
        ,
        {text: 'Innovative', ID: 'innovative', iconImgUp: 'images/reactions/Innovatice.png', iconImgOver: 'images/reactions/Innovatice_hover.png', tooltip: 'This recipe is innovative', userMessage: 'I think this recipe is innovative', headerText: 'You think this recipe is innovative,'}
    ];
    var aboutReactions=[
        {text: 'Must read',ID: 'mustread', iconImgUp:'http://cdn.gigya.com/gs/i/reactions/icons/MustRead_Icon_Up.png',iconImgOver:'http://cdn.gigya.com/gs/i/reactions/icons/MustRead_Icon_Down.png',tooltip:'Must read this page',feedMessage: 'Must read this!', headerText:'You think this page must be read,' }
        ,{text: 'Inspiring', ID: 'inspiring', iconImgUp:'http://cdn.gigya.com/gs/i/reactions/icons/Inspiring_Icon_Up.png', iconImgOver:'http://cdn.gigya.com/gs/i/reactions/icons/Inspiring_Icon_Down.png', tooltip:'This demo is inspiring', feedMessage: 'Inspiring!', headerText:'You think this demo is inspiring,'}
        ,{text: 'Dislike', ID: 'dislike', iconImgUp:'http://cdn.gigya.com/gs/i/reactions/icons/Dislike_Icon_Up.png', iconImgOver:'http://cdn.gigya.com/gs/i/reactions/icons/Dislike_Icon_Down.png', tooltip:'I dislike this demo', feedMessage: 'I dislike this demo!', headerText:'You dislike this demo,'}
        ,{text: 'Aged',ID: 'aged', iconImgUp:'http://cdn.gigya.com/gs/i/reactions/icons/Aged_Icon_Up.png',iconImgOver:'http://cdn.gigya.com/gs/i/reactions/icons/Aged_Icon_Down.png', tooltip:'This demo is aged',feedMessage: 'Aged',headerText:'You think this demo is aged,'}
    ];

    var textReactions = (reactionsType == "about") ? aboutReactions : defaultReactions;

    // Define the Reactions Plugin's params object
    var reactionParams = {
        barID: barId, //  Identifier of the content to which this reaction refers
        containerID: containerId,  // Reactions Plugin DIV Container
        reactions: textReactions,  // The reaction array from Step 1
        userAction: gigyaPlugins.helpers.getDefualtUserAction(),  // The UserAction object from Step 2
        bodyText: 'Share it with your friends:', // optional - text that appears in the Share popup
        showCounts: 'right', // optional - displays the counters on top of the buttons
        scope: 'both',
        privacy: 'public',
        showAlwaysShare: 'unchecked'
    };

    // Load the Reactions Plugin:
    gigya.socialize.showReactionsBarUI(reactionParams);
};

gigyaPlugins.comments = function (containerId, categoryId, streamId) {
    var commentsParams = {
        categoryID: categoryId,
        containerID: containerId,
        streamID: streamId,
        scope: 'both',
        privacy: 'public',
        version: 2,
        deviceType: 'auto'
    };
    gigya.comments.showCommentsUI(commentsParams);
}

gigyaPlugins.helpers = {};
gigyaPlugins.helpers.setNameAndAvatar = function (name, avatar) {
    $('.user-name').html(name);
    if (avatar) {
        $('#div_LoggedIn').find('.userimage').attr('src', avatar);
    }
};

gigyaPlugins.helpers.getDefualtUserAction = function () {
    var defaultUserAction = new gigya.socialize.UserAction(),
        title = $(".recipe-title h1").text(),
        linkBack = window.location.href,
        article =  $(".recipe-text").text(),
        description = $.trim(article.substring(0, article.indexOf('.'))),
        shareimage = {
            "href": linkBack,
            "src": $('.recipe-image img').prop('src'),
            "type": "image"
        };
    defaultUserAction.setTitle(title);
    defaultUserAction.setLinkBack(linkBack);
    defaultUserAction.setDescription(description);
    defaultUserAction.addMediaItem(shareimage);
    return defaultUserAction;
};

gigyaPlugins.logoutHandler = function () {
    sessionStorage.removeItem("gigyaName");
    sessionStorage.removeItem("gigyaAvatar");
    sessionStorage.removeItem("gigyaFirstName");
    sessionStorage.removeItem("gigyaUID");
    $.ajax({
        "type": "POST",
        "url": "raas-reg.php",
        "data": {"action": "logout"}
    }).done(function(ajaxRes) {
        var ajaxJson = JSON.parse(ajaxRes);
        if (ajaxJson.result == 'success') {
            $('.logged-in').fadeOut(function () {
                $('.logged-out').fadeIn();
            });
        }
    })
	
	
};

gigyaPlugins.helpers.isLoggedIn = function () {
    return sessionStorage.getItem("gigyaFirstName") != null;
};

gigyaPlugins.init = function () { // this fires on all pages if user is logged in, some plugins don't exist on all pages.  I am not changing anything, as it was like this when I got here, but this is where the js errors are coming from, if anyone is looking. - LS
    if (gigyaPlugins.helpers.isLoggedIn()) {
        gigyaPlugins.helpers.setNameAndAvatar(sessionStorage.getItem("gigyaFirstName"), sessionStorage.getItem("gigyaAvatar"));
        $('.logged-out').hide()
    } else {
        $('.logged-in').hide();
    }
    gigyaPlugins.followBar();
    gigyaPlugins.activityFeed();
    gigyaPlugins.gm();
    gigyaPlugins.ratings();
    gigyaPlugins.reviews();
};

(function ($) {
    gigya.socialize.addEventHandlers({
        onLogin: gigyaPlugins.loginHandler,
        onLogout: gigyaPlugins.logoutHandler
    });
    $(document).ready(function () {
        gigyaPlugins.init();
    });
})(jQuery);
