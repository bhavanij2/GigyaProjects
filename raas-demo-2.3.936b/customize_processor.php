<?php
$siteScreenSet = "Default"; // Also need to change this parameter in the config.php, customize.php, and gigyaPlugins.js file !!!
$RegistrationLoginScreen = $siteScreenSet . "-RegistrationLogin";
$ProfileUpdateScreen= $siteScreenSet . "-ProfileUpdate";
$ReAuthenticationScreen= $siteScreenSet . "-ReAuthentication";
@$whichPlugin=$_GET['whichPlugin'];
@$pageName=$_GET['pageName'];
$barID='';
$catId = '';
$streamId='';
$textReactions="
var textReactions = [{
text: 'Recommend',
ID: 'recommend',
iconImgUp: 'images/reactions/Recommend.png',
iconImgOver: 'images/reactions/Recommend_hover.png',
tooltip: 'I recommend this recipe',
feedMessage: 'I recommend this recipe!',
headerText: 'You recommend this recipe,'
},
 {
text: 'Dislike',
ID: 'dislike',
iconImgUp: 'images/reactions/Dislike.png',
iconImgOver: 'images/reactions/Dislike_hover.png',
tooltip: 'I dislike this recipe',
feedMessage: 'I dislike this recipe!',
headerText: 'You dislike this recipe,'
}, {
text: 'Delicious',
ID: 'Delicious',
iconImgUp: 'images/reactions/Delicious.png',
iconImgOver: 'images/reactions/Delicious_hover.png',
tooltip: 'This recipe is delicious',
feedMessage: 'Delicious',
headerText: 'You think this recipe is delicious,'
}, {
text: 'Yuck',
ID: 'yuck',
iconImgUp: 'images/reactions/Yuck.png',
iconImgOver: 'images/reactions/Yuck_hover.png',
tooltip: 'This recipe is yucky',
feedMessage: 'Yuck!',
headerText: 'You think this recipe is yuck,'
}, {
text: 'Innovative',
ID: 'innovative',
iconImgUp: 'images/reactions/Innovatice.png',
iconImgOver: 'images/reactions/Innovatice_hover.png',
tooltip: 'This recipe is innovative',
userMessage: 'I think this recipe is innovative',
headerText: 'You think this recipe is innovative,'
}];
";
$aboutReactions="
var aboutReactions=[
        {text: 'Must read',ID: 'mustread', iconImgUp:'http://cdn.gigya.com/gs/i/reactions/icons/MustRead_Icon_Up.png',iconImgOver:'http://cdn.gigya.com/gs/i/reactions/icons/MustRead_Icon_Down.png',tooltip:'Must read this page',feedMessage: 'Must read this!', headerText:'You think this page must be read,' }
        ,{text: 'Inspiring', ID: 'inspiring', iconImgUp:'http://cdn.gigya.com/gs/i/reactions/icons/Inspiring_Icon_Up.png', iconImgOver:'http://cdn.gigya.com/gs/i/reactions/icons/Inspiring_Icon_Down.png', tooltip:'This demo is inspiring', feedMessage: 'Inspiring!', headerText:'You think this demo is inspiring,'}
        ,{text: 'Dislike', ID: 'dislike', iconImgUp:'http://cdn.gigya.com/gs/i/reactions/icons/Dislike_Icon_Up.png', iconImgOver:'http://cdn.gigya.com/gs/i/reactions/icons/Dislike_Icon_Down.png', tooltip:'I dislike this demo', feedMessage: 'I dislike this demo!', headerText:'You dislike this demo,'}
        ,{text: 'Aged',ID: 'aged', iconImgUp:'http://cdn.gigya.com/gs/i/reactions/icons/Aged_Icon_Up.png',iconImgOver:'http://cdn.gigya.com/gs/i/reactions/icons/Aged_Icon_Down.png', tooltip:'This demo is aged',feedMessage: 'Aged',headerText:'You think this demo is aged,'}
    ];
";
$whichReactions='';
if ($pageName=='Recipe1' ) {
      $barID = 'recipe1';
      $catId = '23137007';
      $streamId='recipe1';
      $whichReactions='textReactions';
    } else if ($pageName=='Recipe2') {
      $barID = 'recipe2';
      $catId = '23137007';
      $streamId='recipe2';
      $whichReactions='textReactions';
    } else if ($pageName=='Recipe3') {
      $barID = 'recipe3';
      $catId = '23137007';
      $streamId='recipe3';
      $whichReactions='textReactions';
    } else if ($pageName=='About') {
      $barID = 'about';
      $catId = 'recipes';
      $streamId='recipe1';
      $whichReactions='aboutReactions';
    }



/********RESPONSE********/

  
  if ($whichPlugin == 'raas') {
    /*******RaaS*******/
  
  $screenSet_select=$_GET['screenSet_select'];
  $dialogStyle_select=$_GET['dialogStyle_select'];
  
  $deviceType = $_GET['deviceType'];
  $lang = $_GET['lang'];
  $whichRadio = $_GET['whichRadio'];
  $newScreenSetPrefix=$_GET['newScreenSetPrefix'];
  if ($whichRadio == $siteScreenSet) {
    $siteScreenSet=$siteScreenSet;
  } else if ($whichRadio == 'Default') {
    $siteScreenSet = 'Default';
  } else if ($whichRadio !==$siteScreenSet && ($whichRadio !=='Default')) {
    $siteScreenSet = $whichRadio;
  }
  $newScreenSet="'" . $siteScreenSet . $screenSet_select . "'";
  $newScreenSetMobile="'" . $siteScreenSet . $screenSet_select . "'";
  $base_code_raas="
    var params = {
    &nbsp;&nbsp;'screenSet': $newScreenSet,
		&nbsp;&nbsp;'mobileScreenSet': $newScreenSetMobile,
		&nbsp;&nbsp;'dialogStyle': '$dialogStyle_select',
		&nbsp;&nbsp;'deviceType': '$deviceType',
		&nbsp;&nbsp;'lang': '$lang'
    }
    gigya.accounts.showScreenSet(params);
    
    ";
    $setDiv='code_block_raas';
    $base_code_display= $base_code_raas;
    //echo $whichPlugin;
  }
  else if ($whichPlugin == 'FB') {
    /********FB********/
    
    $iconSize=$_GET['iconSize'];
    $facebookCheckbox = $_GET['facebookCheckbox'];
    $twitterCheckbox = $_GET['twitterCheckbox'];
    $googleCheckbox = $_GET['googleCheckbox'];
    $rssCheckbox = $_GET['rssCheckbox'];
    $linkedinCheckbox = $_GET['linkedinCheckbox'];
    $spacerFb=",";
    $spacerTw=",";
    $spacerGp=",";
    $spacerRs=",";
    $spacerLi=",";
    $FB_A="
      var followBarParams = {
				    containerID: 'FollowBar',
				    iconSize: $iconSize,
				    buttons: [
    ";
    if ($facebookCheckbox =='1') {
      $FB_facebook="
      {
						    provider: 'facebook',
						    actionURL: 'https://www.facebook.com/gigya',
						    action: 'dialog',
						    iconURL: 'images/follow_bar/Facebook_on_follow.png'
				    }
    ";
    } else {
      $FB_facebook="";
      $spacerFb="";
    }
    if ($twitterCheckbox =='1') {
      $FB_twitter="
     {
						    provider: 'twitter',
						    followUsers: 'gigya, gigyaDev',
						    action: 'dialog',
						    iconURL: 'images/follow_bar/Twitter_on_follow.png'
				    }
    ";
    } else {
      $FB_twitter="";
      $spacerTw="";
    }
    if ($googleCheckbox == '1') {
      $FB_google="
     {
						    provider: 'googleplus',
						    action: 'dialog',
						    iconURL: 'images/follow_bar/Google+_on_follow.png'
				    }
    ";
    } else {
      $FB_google="";
      $spacerGp="";
    }
    if ($rssCheckbox == '1') {
      $FB_rss="
     {   
						    provider: 'rss',
						               actionURL: 'http://blog.gigya.com/',
						               action: 'window',
						               title: 'Subscribe via RSS',
						               iconURL: 'images/follow_bar/Rss_hover_follow.png'         
				    }
    ";
    } else {
      $FB_rss="";
      $spacerRs="";
    }
    if ($linkedinCheckbox == '1') {
      $FB_linkedin="
     {   
						    provider: 'linkedin',
						               actionURL: 'http://www.linkedin.com/company/gigya',
						               action: 'window',
						               title: 'Gigya on Linkedin',
						               iconURL: 'images/follow_bar/Linkedin_hover_follow.png'         
				    }
    ";
    } else {
      $FB_linkedin="";
      $spacerRs="";
    }

    $FB_Z="
      ]     
		    };      // Load the Follow Bar plugin:
		         
		    gigya.socialize.showFollowBarUI(followBarParams);
    ";

    $base_code_FB=
    $FB_A . 
    $FB_facebook . 
    $spacerFb . 
    $FB_twitter . 
    $spacerTw . 
    $FB_google . 
    $spacerGp . 
    $FB_rss . 
    $spacerRs . 
    $FB_linkedin . 
    $FB_Z
    ;
    $setDiv='code_block_FB';
    $base_code_display= $base_code_FB;
    //echo $whichPlugin;
  }
  else if ($whichPlugin == 'GM') {
    /********GM********/
    
    $base_code_GM="
      var userStatusUA = new gigya.socialize.UserAction();
        userStatusUA.setTitle('$levelTitle');
        userStatusUA.setDescription(
		    'Challenge title: $challengeTitle  level title: $levelTitle | challenge description: $challengeDescription  level Description: $levelDescription'
        );
        userStatusUA.addImage('$badgeURL');
      var userStatusParams = {
		    containerID: 'divUserStatus',
		    userAction: userStatusUA,
		    shareParams: {
				    showEmailButton: true
		    },
		    width: 293
        }
      var achievmentsParams = {
		    containerID: 'divAchiements',
		    width: 293
      }
      var leaderboardParams = {
		    containerID: 'divLeaderboard',
		    period: 'all',
		    width: 293
      }
      gigya.gm.showNotifications({
		    debugMode: false
      });
    gigya.gm.showUserStatusUI(userStatusParams);
    gigya.gm.showAchievementsUI(achievmentsParams);
    gigya.gm.showLeaderboardUI(leaderboardParams);
    ";
    $setDiv='code_block_GM';
    $base_code_display= $base_code_GM;
    //echo $whichPlugin;
  }
  else if ($whichPlugin == 'AF') {
    /********AF********/
    
    $tabOrder = $_GET['tabOrder'];
    $initialTab = $_GET['initialTab'];
    $borderColor = $_GET['borderColor'];
    
    $base_code_AF="
      var AF_params = {
		    containerID: 'ActivityFeed',
		    tabOrder: '$tabOrder',
		    initialTab: '$initialTab',
		    borderColor: '$borderColor',
		    width: '100%',
		    height: 271
      };
      gigya.socialize.showFeedUI(AF_params);
    ";

    $setDiv='code_block_AF';
    $base_code_display= $base_code_AF;
    //echo $whichPlugin;
  }
  else if ($whichPlugin == 'RnR') {
    /********RR********/
    
    $showCommentButton=$_GET['showCommentButton']; // 
    $showReadReviewsLink=$_GET['showReadReviewsLink'];
    $hideShareButtons=$_GET['hideShareButtons'];
    $showLoginBar_rnr=$_GET['showLoginBar_rnr'];
    $base_code_RnR="
      var params = {
		    containerID: 'ratings',
		    streamID: 'home',
		    categoryID: 'demositeReview',
		    linkedCommentsUI: 'reviews',
		    width: '100%',
		    showCommentButton: $showCommentButton,
		    showReadReviewsLink: $showReadReviewsLink
		    }
      gigya.comments.showRatingUI(params);
      var commentsParams = {
        categoryID: 'demositeReview',
        containerID: 'reviews',
        streamID: 'home',
        scope: 'both',
        privacy: 'public',
        version: 2,
        deviceType: 'auto',
        width: '100%',
        hideShareButtons: $hideShareButtons,
        showLoginBar: $showLoginBar_rnr
        };
      gigya.comments.showCommentsUI(commentsParams);
    ";
    $setDiv='code_block_RnR';
    $base_code_display= $base_code_RnR;
    //echo $whichPlugin;
  }
  else if ($whichPlugin == 'RA') {
    /*******REACTIONS********/
    
    $showCounts=$_GET['showCounts_RA'];
    $layout=$_GET['layout_RA'];
    $noButtonBorders_RA=$_GET['noButtonBorders_RA'];
    
    
    $base_code_RA="
    $textReactions 
    $aboutReactions
         
    var reactionParams = {       
		    barID: '$barID', //  Identifier of the content to which this reaction refers
		           containerID: 'reactionsDiv',
		      // Reactions Plugin DIV Container
		           reactions: $whichReactions,
		      // The reaction array from Step 1
		           userAction: gigyaPlugins.helpers.getDefualtUserAction(),
		      // The UserAction object from Step 2
		           bodyText: 'Share it with your friends:', // optional - text that appears in the Share popup
		           showCounts: '$showCounts', // optional - displays the counters by the buttons
		           scope: 'both',
		           privacy: 'public',
		           showAlwaysShare: 'unchecked',
		           layout: '$layout',
		           noButtonBorders: $noButtonBorders_RA
		           
    };     
    gigya.socialize.showReactionsBarUI(reactionParams);
    ";
    $base_code_display=$base_code_RA;
  }
  else if ($whichPlugin == 'CM') {
    /***************COMMENTS*************/

    //facebook,twitter,linkedin,qq,renren,sina
    
    $deviceType=$_GET['deviceType_select'];
    $showLoginBar=$_GET['showLoginBar'];
    $base_code_CM="
    var commentsParams = {
				    categoryID: '$catId',
				    containerID: 'commentsDiv',
				    streamID: '$streamId',
				    scope: 'both',
				    privacy: 'public',
				    version: 2,
				    showLoginBar: $showLoginBar,
				    deviceType: '$deviceType'
		    };
    gigya.comments.showCommentsUI(commentsParams);
    ";
    $setDiv='code_block_CM';
    $base_code_display=$base_code_CM;   
  }
  else if ($whichPlugin == 'SB') {
    /************SHARE BAR***********/
    
    $enabledProvidersOn = $_GET['enabledProvidersOn'];
    $facebookEnabled = $_GET['facebookEnabled'];
    $twitterEnabled = $_GET['twitterEnabled'];
    $googleEnabled = $_GET['googleEnabled'];
    $linkedinEnabled = $_GET['linkedinEnabled'];
    $microsoftEnabled = $_GET['microsoftEnabled'];
    $diggEnabled = $_GET['diggEnabled'];
    $shareMoreEnabled = $_GET['shareMoreEnabled'];
    $showCounts=$_GET['showCounts'];
    $iconsOnly=$_GET['iconsOnly'];
    $layout=$_GET['layout'];
    $noButtonBorders=$_GET['noButtonBorders'];
    $operationMode=$_GET['operationMode'];
		  

    $sb_part1="// Define shareButtons
		    var shareButtons = [";
		    
    if ($enabledProvidersOn == '1') {
      if ($facebookEnabled == '1') {
        $facebookShare = "{  
				    'provider': 'Facebook',
				    'iconImgUp': 'images/share_bar/Facebook.png'
		    }, ";
      } else { $facebookShare = ''; }
      
      if ($twitterEnabled == '1') {
        $twitterShare = "{  
				    'provider': 'Twitter',
				    'iconImgUp': 'images/share_bar/Twitter.png'
		    }, ";
      } else { $twitterShare = ''; }
      
      if ($googleEnabled == '1') {
        $googleShare = "{  
				    'provider': 'Googleplus',
				    'iconImgUp': 'images/share_bar/Google_Plus.png'
		    }, ";
      } else { $googleShare = ''; }
      
      if ($linkedinEnabled == '1') {
        $linkedinShare = "{  
				    'provider': 'LinkedIn',
				    'iconImgUp': 'images/share_bar/LinkedIn.png'
		    }, ";
      } else { $linkedinShare = ''; }
      
      if ($microsoftEnabled == '1') {
        $microsoftShare = "{  
				    'provider': 'Messenger',
				    'iconImgUp': 'images/share_bar/Messenger.png'
		    }, ";
      } else { $microsoftShare = ''; }
      
      if ($diggEnabled == '1') {
        $diggShare = "{  
				    'provider': 'digg',
				    'iconImgUp': 'images/share_bar/Digg.png'
		    }, ";
      } else { $diggShare = ''; }
      
      if ($shareMoreEnabled == '1') {
        $shareMore = "{
				    'provider': 'share',
				    'iconImgUp': 'images/share_bar/more_share.png'
		    }";
      } else { $shareMore=''; }
      
      $shareProviders_a= $facebookShare . $twitterShare . $googleShare . $linkedinShare . $microsoftShare . $diggShare . $shareMore;
      $shareProviders = preg_replace('/,\s$/', '', $shareProviders_a);
      $showString=0;
    } else {
      $shareProviders = 'Facebook, Twitter, LinkedIn, Messenger, Delicious, WhatsApp, Reddit, Googleplus, Google Bookmarks, VKontakte, Spiceworks, Viadeo, nk.pl, Xing, Tuenti, Pinterest, Kindle, Baidu, FriendFeed, Tumblr, Stumbleupon, Skyrock, QQ, Sina, mixi, Kaixin, VZnet, Wanelo, share';
      $showString=1;
      // 
    }
    $sb_part3= "
      ];
    // Define the Share Bar Plugin's params object
    var shareParams = {
		    userAction: gigyaPlugins.helpers.getDefualtUserAction(),
		    showCounts: '$showCounts',
		    containerID: 'shareButtons',
		    scope: 'both',
		    privacy: 'public',
		    iconsOnly: $iconsOnly,
		    layout: '$layout',
		    noButtonBorders: $noButtonBorders,
		    operationMode: '$operationMode',
		   
		    shareButtons: shareButtons // list of providers    
    };
    // Load the Share Bar Plugin:
    gigya.socialize.showShareBarUI(shareParams);
    ";
    $base_code_SB=$sb_part1 . $shareProviders . $sb_part3;
    if ($showString ==1) {
        $base_code_SB=preg_replace('(\[|\])', "'", $base_code_SB);
        $base_code_SB=preg_replace('(share\s)', 'share', $base_code_SB);
    }

    $base_code_display=$base_code_SB;
    $setDiv='code_block_SB';
    $base_code_display= $base_code_SB;
    //echo $whichPlugin;
  } else if ($whichPlugin == 'API') {
    
    $newAPI=$_GET['newAPI'];
    $_SESSION['thisApiKey'] = $newAPI;
    
    
  } else {
    echo "$whichPlugin  : Somthing went wrong!";
    return;
  }

echo $base_code_display;
?>
