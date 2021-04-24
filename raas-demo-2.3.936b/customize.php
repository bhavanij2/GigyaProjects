<!-- /************************************ START CUSTOMIZATION PLUGIN ************************************/ -->
<?php
$siteScreenSet = "Default"; // Also need to change this parameter in the config.php + gigyaPlugins.js + customize_processor.php files !!!
$showLoginBar_rnr='false';
$showReadReviewsLink='true';
$hideShareButtons='true';
$RegistrationLoginScreen = "'" . $siteScreenSet . "-RegistrationLogin'";
$ProfileUpdateScreen= "'" . $siteScreenSet . "-ProfileUpdate'";
$ReAuthenticationScreen= "'" . $siteScreenSet . "-ReAuthentication'";
$base_code_raas="
  var params = {
    'screenSet': $RegistrationLoginScreen,\r\n
		'mobileScreenSet': $RegistrationLoginScreen,
		'dialogStyle': 'modern',
		'deviceType': 'auto',
		'lang': 'en'
  }
  gigya.accounts.showScreenSet(params);

";

$base_code_FB="
  var followBarParams = {
				containerID: 'FollowBar',
				iconSize: 42,
				buttons: [{
						provider: 'facebook',
						actionURL: 'https://www.facebook.com/gigya',
						action: 'dialog',
						iconURL: 'images/follow_bar/Facebook_on_follow.png'
				}, {
						provider: 'twitter',
						followUsers: 'gigya',
						action: 'dialog',
						iconURL: 'images/follow_bar/Twitter_on_follow.png'
				}, {
						provider: 'googleplus',
						action: 'dialog',
						iconURL: 'images/follow_bar/Google+_on_follow.png'
				}, {   
						provider: 'rss',
						           actionURL: 'http://blog.gigya.com/',
						           action: 'window',
						           title: 'Subscribe via RSS',
						           iconURL: 'images/follow_bar/Rss_hover_follow.png'         
				}, {   
						provider: 'linkedin',
						           actionURL: 'http://www.linkedin.com/company/gigya',
						           action: 'window',
						           title: 'Gigya on Linkedin',
						           iconURL: 'images/follow_bar/Linkedin_hover_follow.png'         
				}]     
		};      // Load the Follow Bar add-on:
		     
		gigya.socialize.showFollowBarUI(followBarParams);
";
$levelTitle='';
$challengeTitle='';
$levelTitle='';
$challengeDescription='';
$levelDescription='';
$badgeURL='';

//*************** PRE-LOADED CODE FOR INITIAL POPUPS ***************
$base_code_GM='
  var userStatusUA = new gigya.socialize.UserAction();
    userStatusUA.setTitle("$levelTitle");
    userStatusUA.setDescription(
		"Challenge title: $challengeTitle  level title: $levelTitle | challenge description: $challengeDescription  level Description: $levelDescription"
    );
    userStatusUA.addImage("$badgeURL");
  var userStatusParams = {
		containerID: "divUserStatus",
		userAction: userStatusUA,
		shareParams: {
				showEmailButton: true
		},
		width: 293
    }
  var achievmentsParams = {
		containerID: "divAchiements",
		width: 293
  }
  var leaderboardParams = {
		containerID: "divLeaderboard",
		period: "all",
		width: 293
  }
  gigya.gm.showNotifications({
		debugMode: false
  });
gigya.gm.showUserStatusUI(userStatusParams);
gigya.gm.showAchievementsUI(achievmentsParams);
gigya.gm.showLeaderboardUI(leaderboardParams);
';
$base_code_AF="
  gigya.socialize.showFeedUI({
		containerID: 'ActivityFeed',
		width: 100%,
		height: 271
  });
";
$base_code_RnR="
  var params = {
		containerID: 'ratings',
		streamID: 'home',
		categoryID: 'demositeReview',
		linkedCommentsUI: 'reviews',
		width: '100%',
		showCommentButton: true,
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
    hideShareButtons: $hideShareButtons,
    showLoginBar: $showLoginBar_rnr
    };
  gigya.comments.showCommentsUI(commentsParams);
";
$base_code_RA="
var textReactions = [{
				text: 'Recommend',
				ID: 'recommend',
				iconImgUp: 'images/reactions/Recommend.png',
				iconImgOver: 'images/reactions/Recommend_hover.png',
				tooltip: 'I recommend this recipe',
				feedMessage: 'I recommend this recipe!',
				headerText: 'You recommend this recipe,'
		}, {
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
		}];      // Define the Reactions add-on's params object
     
var reactionParams = {       
		barID: 'recipe1', //  Identifier of the content to which this reaction refers
		       containerID: 'reactionsDiv',
		  // Reactions Plugin DIV Container
		       reactions: textReactions,
		  // The reaction array from Step 1
		       userAction: defaultUserAction,
		  // The UserAction object from Step 2
		       bodyText: 'Share it with your friends:', // optional - text that appears in the Share popup
		       showCounts: 'right', // optional - displays the counters on top of the buttons
		       scope: 'both',
		       privacy: 'public',
		       showAlwaysShare: 'unchecked'     
};     
gigya.socialize.showReactionsBarUI(reactionParams);
";
$base_code_SB="
// Define share buttons
		var shareButtons = [{  
				'provider': 'Facebook',
				'iconImgUp': 'images/share_bar/Facebook.png'
		}, {  
				'provider': 'Twitter',
				'iconImgUp': 'images/share_bar/Twitter.png'
		}, {  
				'provider': 'Googleplus',
				'iconImgUp': 'images/share_bar/Google_Plus.png'
		}, {  
				'provider': 'LinkedIn',
				'iconImgUp': 'images/share_bar/LinkedIn.png'
		}, {  
				'provider': 'Messenger',
				'iconImgUp': 'images/share_bar/Messenger.png'
		}, {  
				'provider': 'digg',
				'iconImgUp': 'images/share_bar/Digg.png'
		}, {
				'provider': 'share',
				'iconImgUp': 'images/share_bar/more_share.png'
		} ];
// Define the Share Bar Plugin's params object
var shareParams = {
		userAction: defaultUserAction,
		showCounts: 'none',
		containerID: 'shareButtons',
		scope: 'both',
		privacy: 'public',
		iconsOnly: true,
		
		shareButtons: shareButtons // list of providers    
};
// Load the Share Bar Plugin:
gigya.socialize.showShareBarUI(shareParams);
";
$base_code_CM="
var commentsParams = {
				categoryID: '23137007',
				containerID: 'commentsDiv',
				streamID: 'recipe1',
				scope: 'both',
				privacy: 'public',
				version: 2,
				deviceType: 'auto'
		};
gigya.comments.showCommentsUI(commentsParams);
";
?>

<style type="text/css">
.header {
  border-radius: 5px;
  border-bottom-left-radius: 5px !important;
  border-bottom-right-radius: 0px !important;
  margin-bottom: -1px;
}
.header:hover {
  border-radius: 5px;

  border-bottom-right-radius: 0px !important;
  margin-bottom: -1px;
}
.header_noMenu {
    margin-bottom: -1px;
    float: left;
  position: relative;
  border-radius: 5px;
  background-color: #034f7c;
  color: #49b8f2;
  min-height: 88px;
  /*overflow: hidden; */
  width: 100%;

}
/****************************/
.customizeMe {
  width: 292px;
  max-width: 100%;
  padding-left: 8px;
  padding-right: 5px;
  text-align: left;
  float: right;
  margin-top: -30px;
  margin-bottom: 30px;
  color: #ffffff;
  height: 32px !important;
  background-color: #49b8f2;
  //border: 1px solid #149dd6;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#49b8f2", endColorstr="#33a7e3");
  background: linear-gradient(top, #49b8f2, #33a7e3) !important;
  background: -ms-linear-gradient(top left, #49b8f2, #33a7e3) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#49b8f2), to(#33a7e3)) !important;
  background: -moz-linear-gradient(top, #49b8f2, #33a7e3) !important;
  border-radius: 5px;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  font: 14px 'robotobold', Arial, Helvetica, sans-serif;
}
.customizeMe2 {
  width: 292px;
  max-width: 100%;
  padding-left: 8px;
  padding-right: 5px;
  text-align: left;
  float: right;
  margin-top: -30px;
  margin-bottom: 30px;
  color: #ffffff;
  height: 32px !important;
  background-color: #49b8f2;
  //border: 1px solid #149dd6;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#49b8f2", endColorstr="#33a7e3");
  background: linear-gradient(top, #49b8f2, #33a7e3) !important;
  background: -ms-linear-gradient(top left, #49b8f2, #33a7e3) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#49b8f2), to(#33a7e3)) !important;
  background: -moz-linear-gradient(top, #49b8f2, #33a7e3) !important;
  border-radius: 5px;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  font: 14px 'robotobold', Arial, Helvetica, sans-serif;
}
.customizeMeHidden {
  width: 30px;
  max-width: 50px;
  padding-left: 8px;
  padding-right: 5px;
  height: 32px;
  text-align: left;
  float: right;
  margin-top: -30px;
  margin-bottom: 30px;
  color: #ffffff;
  background-color: #49b8f2;
  //border: 1px solid #149dd6;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#49b8f2", endColorstr="#33a7e3");
  background: linear-gradient(top, #49b8f2, #33a7e3) !important;
  background: -ms-linear-gradient(top left, #49b8f2, #33a7e3) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#49b8f2), to(#33a7e3)) !important;
  background: -moz-linear-gradient(top, #49b8f2, #33a7e3) !important;
  border-radius: 5px;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  font: 14px 'robotobold', Arial, Helvetica, sans-serif;
}
.clickToShowPlugin, .clickToShowPlugin a  {
  color: #ffffff;
  text-decoration: none;
  padding-top: 5px;
  height: 20px;
  padding-left: 10px;
  float: left;
  font-weight: bold;
  font: 12px 'robotobold', Arial, Helvetica, sans-serif;
  display: block;
  overflow: hidden;
}

.onOffContainer {
    float: right;
}
/* right arrow*/
.clickToHideBar {
  display: block;
  margin-top: 10px;
  padding-right: 8px;
  //position: absolute;
  
}
.clickToHideBar a {
  color: #ffffff;
  text-decoration: none;
  padding-top: 0px;
  position: relative;
  //border: 1px solid red;
  z-index: 1000;
}

/* left arrow*/
.clickToShowBar { 
  display: none;
  padding-top: 0px;
  margin-top: 10px;
  position: absolute;
  margin-left: -22px;
  z-index: 100;
}
.clickToShowBar a {
  color: #ffffff;
  text-decoration: none;
  padding-top: 0px;
  position: relative;
  //border: 1px solid red;
  z-index: 100;
}

/*******************************/
.selection_list {
  margin: 0px auto;
  width: 95%;
}
.selectButton {
  overflow: hidden;
  padding: 5px;
  //margin-right: 10px;
  text-align: center;
  margin: 0px auto;
  border: 1px solid #149dd6;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#49b8f2", endColorstr="#33a7e3");
  background: linear-gradient(top, #49b8f2, #33a7e3) !important;
  background: -ms-linear-gradient(top left, #49b8f2, #33a7e3) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#49b8f2), to(#33a7e3)) !important;
  background: -moz-linear-gradient(top, #49b8f2, #33a7e3) !important;
  margin-top: 0px;
  margin-bottom: 19px;
  text-decoration: none;
  font-weight: normal;
  color: #ffffff;
}
.selectButton:hover {
  overflow: hidden;
  padding: 5px;
  text-align: center;
  margin: 0px auto;
  border: 1px solid #034f7c;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#33a7e3", endColorstr="#49b8f2");
  background: linear-gradient(top, #33a7e3, #49b8f2) !important;
  background: -ms-linear-gradient(top left, #33a7e3, #49b8f2) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#33a7e3), to(#49b8f2)) !important;
  background: -moz-linear-gradient(top, #33a7e3, #49b8f2) !important;
  margin-bottom: 0px;
  margin-top:1px;
  color: #ffffff;
  font-weight: normal;
}
.customizeButton {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  overflow: hidden;
  text-align: center;
  margin: 0px auto;
  //margin-top: -1px;
  border: 1px solid #149dd6;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#49b8f2", endColorstr="#33a7e3");
  background: linear-gradient(top, #49b8f2, #33a7e3) !important;
  background: -ms-linear-gradient(top left, #49b8f2, #33a7e3) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#49b8f2), to(#33a7e3)) !important;
  background: -moz-linear-gradient(top, #49b8f2, #33a7e3) !important;
  margin-bottom: 19px;
  text-decoration: none;
  font-weight: normal;
  color: #ffffff;
  
}
.customizeButton:hover {
  width: 100%;
  height: 31px;
  border-radius: 5px;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  overflow: hidden;
  text-align: center;
  margin: 0px auto;
  margin-top: -1px;
  border: 1px solid #034f7c;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#33a7e3", endColorstr="#49b8f2");
  background: linear-gradient(top, #33a7e3, #49b8f2) !important;
  background: -ms-linear-gradient(top left, #33a7e3, #49b8f2) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#33a7e3), to(#49b8f2)) !important;
  background: -moz-linear-gradient(top, #33a7e3, #49b8f2) !important;
  margin-bottom: 0px;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
}

#customize_API, #customize_RaaS, #customize_FB, #customize_GM, #customize_AF, #customize_RnR, #customize_RA, #customize_SB, #customize_CM {
  display: none;
  margin: 15px auto;
  text-align: center;
  z-index: 9999999;
}

.selectButton, .selectButtonDisabled, .selectButtonSelected, .apiButton  {
  width: 49%;
  height: 30px;
  margin-bottom: 2px;
  margin-top: 0px; 
  color: #ffffff; 
}
.selectButton:hover, selectButtonDisabled:hover, .selectButtonSelected:hover, .apiButton:hover {
  width: 49%;
  height: 30px;
  margin-bottom: 2px;
  margin-top: 0px;
  color: #ffffff; 
}
.screensetModText {
    vertical-align: baseline;
    margin-left: 10px;
}
.fbModText, .sbModText {
    vertical-align: baseline;
    margin-left: 20px;
}
.ssRadioButton {
    margin-top: 4px;
    position: absolute;
}

.selectButton#NA_select {
  width: 45%;
  height: 30px;
  margin-bottom: 2px;
  margin-top: 0px;  
  visibility: hidden;
}
.selectButton#NA_select:hover {
  width: 45%;
  height: 30px;
  margin-bottom: 2px;
  margin-top: 0px;
  visibility: hidden;
}
.selectButtonDisabled {
  overflow: hidden;
  padding: 5px;
  //margin-right: 10px;
  text-align: center;
  margin: 0px auto;
  border: 1px solid #149dd6;
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#49b8f2", endColorstr="#33a7e3");
    background: linear-gradient(top, #49b8f2, #33a7e3) !important;
    background: -ms-linear-gradient(top left, #49b8f2, #33a7e3) !important;
    background: -webkit-gradient(linear, left top, left bottom, from(#49b8f2), to(#33a7e3)) !important;
    background: -moz-linear-gradient(top, #49b8f2, #33a7e3) !important;
    text-decoration: none;
    font-weight: normal;
    color: #DDDDDD;
    opacity: .7;
}
.selectButtonDisabled:hover {
  overflow: hidden;
  padding: 5px;
  //margin-right: 10px;
  text-align: center;
  margin: 0px auto;
  border: 1px solid #149dd6;
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#49b8f2", endColorstr="#33a7e3");
    background: linear-gradient(top, #49b8f2, #33a7e3) !important;
    background: -ms-linear-gradient(top left, #49b8f2, #33a7e3) !important;
    background: -webkit-gradient(linear, left top, left bottom, from(#49b8f2), to(#33a7e3)) !important;
    background: -moz-linear-gradient(top, #49b8f2, #33a7e3) !important;
    text-decoration: none;
    font-weight: normal;
    color: #DDDDDD;
    opacity: .7;
 }
.selectButtonSelected {
  overflow: hidden;
  padding: 5px;
  text-align: center;
  border: 1px solid #034f7c;
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#33a7e3", endColorstr="#49b8f2");
    background: linear-gradient(top, #33a7e3, #49b8f2) !important;
    background: -ms-linear-gradient(top left, #33a7e3, #49b8f2) !important;
    background: -webkit-gradient(linear, left top, left bottom, from(#33a7e3), to(#49b8f2)) !important;
    background: -moz-linear-gradient(top, #33a7e3, #49b8f2) !important;
    color: #034f7c;
    font-weight: normal;
}
.selectButtonSelected:hover {
  overflow: hidden;
  padding: 5px;
  text-align: center;
  border: 1px solid #034f7c;
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#33a7e3", endColorstr="#49b8f2");
    background: linear-gradient(top, #33a7e3, #49b8f2) !important;
    background: -ms-linear-gradient(top left, #33a7e3, #49b8f2) !important;
    background: -webkit-gradient(linear, left top, left bottom, from(#33a7e3), to(#49b8f2)) !important;
    background: -moz-linear-gradient(top, #33a7e3, #49b8f2) !important;
    color: #034f7c;
    font-weight: normal; 
}
.code_block {
  background-color: #ffffff;
  width: 509px;
  overflow: scroll;
  white-space: nowrap;
  padding: 5px;
  box-sizing: border-box;
  margin-top: 20px;
  white-space: pre-line;
  max-width: 509px;
}
.code_block_selected {
  background-color: rgba(67,137,201,.99);
  color: #FFFFFF;
  width: 509px;
  overflow: scroll;
  white-space: nowrap;
  padding: 5px;
  box-sizing: border-box;
  margin-top: 20px;
  white-space: pre-line;
  max-width: 509px;
}
.selection_area {
  text-align: left;
  padding: 0px;
  font-weight: normal;
  line-height: 20px;
  vertical-align: text-top;
}
.selection_area_api {
  text-align: center;
  padding: 10px;
  font-weight: normal;
  line-height: 20px;
  vertical-align: text-top;
}
select {
  float: right;
  height: 25px;
  width: 180px;
  font: 13px 'robotoregular', Arial, Helvetica, sans-serif;
} 
#customize_FB input[type="text"] {
  width: 25px;
}
input {
    font: 'robotoregular', Arial, Helvetica, sans-serif;
}
input#thisApiKey {
  width: 100% !important;
  padding-left: 5px;
  padding-right: 5px;
}
input#newApiKeyBox {
  width: 100% !important;
  padding-left: 5px;
  padding-right: 5px;
}
input#deleteApiKey {
      width: 17px;
      height: 17px;
      margin-top: 2px;
      position: absolute;
      left: 60;
}
input.fbCheckbox {
    position: absolute;
    margin-top: 4px;
}

.checkMarks {
  float: left;
  width: 40%;
}

#customize_FB input[type="checkbox"] {
  width: 17px;
  height: 17px;
  float: right;
  margin-top: 3px;
}
#customize_SB input[type="checkbox"] {
  width: 17px;
  height: 17px;
  float: right;
  margin-top: 3px;
}
.runButtonDiv {
  width: 100%;
  text-align: center;
  height: 20px;
  line-height: 17px;
}
.runButton {
  text-align: center;
  width: 100%;
  height: 25px;
  margin: 0px auto;
  border: 1px solid #149dd6;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#49b8f2", endColorstr="#33a7e3");
  background: linear-gradient(top, #49b8f2, #33a7e3) !important;
  background: -ms-linear-gradient(top left, #49b8f2, #33a7e3) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#49b8f2), to(#33a7e3)) !important;
  background: -moz-linear-gradient(top, #49b8f2, #33a7e3) !important;
  margin-top: 0px;
  margin-bottom: 0px;
  text-decoration: none;
  color: #ffffff;  
  font-weight: normal;
}
.runButton:hover {
  text-align: center;
  width: 100%;
  height: 25px;
  margin: 0px auto;
  border: 1px solid #034f7c;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#33a7e3", endColorstr="#49b8f2");
  background: linear-gradient(top, #33a7e3, #49b8f2) !important;
  background: -ms-linear-gradient(top left, #33a7e3, #49b8f2) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#33a7e3), to(#49b8f2)) !important;
  background: -moz-linear-gradient(top, #33a7e3, #49b8f2) !important;
  margin-bottom: 0px;
  margin-top:0px;
  color: #ffffff;
  font-weight: normal;
}
.or {

}
.bottomClose, .bottomClose a {
    color: #ffffff;
    font-weight: bold;
    text-decoration: none !important;
    float: right;
    padding-right: 20px;
}
.revertApiDiv {
    width: 95%;
    height: 15px;
    margin-bottom: 25px;
}
.revertCheckbox {
    height: 15px;
    margin-bottom: 25px;
}
.revertText {
    display: inline;
    height: 17px;
    margin-left: 40px;
}
@media (max-width: 1060px) {
  .selectButton, .selectButtonDisabled, .selectButtonSelected, .apiButton  {
    max-width: 140px !important;
  }
  .selectButton:hover, selectButtonDisabled:hover, .selectButtonSelected:hover, .apiButton:hover {
    max-width: 140px !important;
  }
  #shareButtons {
    max-width: 100%;
    overflow: hidden;
  }
  .share-wrap {
    max-width: 100%;
    overflow: hidden !important;
  }
}
@media (max-width: 699px) {
  .SGMenuWrapper {
    right: 0% !important;
    margin-right: 10px;
  }
}
@media (max-width: 499px) {
  .customizeMe {
    visibility: hidden;
    display: none;
  }
  .customizeMeHidden {
    visibility: hidden;
    display: none;
  }
  .customizeButton:hover {
    visibility: hidden;
  }
  .header {
    border-bottom-left-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
  }
  .header:hover {
    border-bottom-left-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
  }
  .SGMenuWrapper {
    display: none !important;
  }
  #newModalMain {
    display: none !important;
  }
}
@media (max-width: 481px) {
  .customizeButton {
    margin-top: 11px;
    margin-left: -8px !important;
  }
  .customizeButton:hover {
    margin-top: 11px;
    margin-left: -8px !important;
  }
  .SGMenuWrapper {
    margin-top: -53px;
  }
}
@media (max-width: 380px) {
  .customizeMe {
    display: none !important;
    //margin-right: 1% !important;
  }
}
.headlineText {
  //font-weight: bold !important;
  //font-size: 110%;
}
.highlightedDiv {
  border: 2px solid #49b8f2;
  margin: -2px auto;
  //background-color: rgba(73, 184, 242, .3);
  //opacity: .1;
  z-index: 10;
  pointer-events: none;
  border-radius: 5px;
}
.notHighlightedDiv {
  border: 2px solid transparent;
  margin: -2px auto;
  //height: 84px;
  //position: absolute;
}
#loginBarHighlight {
  width: 100%;
  height: 80px;;
  position: absolute;
  margin-left: -15px;
  pointer-events: none;
}
#cmHighlight {
  width: 100%;
  height: auto;
  margin-left: -15px;
}
.closeButton, .apiButton, .apiButton2 {
  width: 45%;
  height: 25px;
  margin-bottom: 4px;
  border: 1px solid #149dd6;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#49b8f2", endColorstr="#33a7e3");
  background: linear-gradient(top, #49b8f2, #33a7e3) !important;
  background: -ms-linear-gradient(top left, #49b8f2, #33a7e3) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#49b8f2), to(#33a7e3)) !important;
  background: -moz-linear-gradient(top, #49b8f2, #33a7e3) !important;
  text-decoration: none;
  color: #ffffff;  
  font-weight: normal;
}
.closeButton:hover, .apiButton:hover, .apiButton2:hover {
  width: 45%;
  height: 25px;
  margin-bottom: 4px;
  border: 1px solid #034f7c;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#33a7e3", endColorstr="#49b8f2");
  background: linear-gradient(top, #33a7e3, #49b8f2) !important;
  background: -ms-linear-gradient(top left, #33a7e3, #49b8f2) !important;
  background: -webkit-gradient(linear, left top, left bottom, from(#33a7e3), to(#49b8f2)) !important;
  background: -moz-linear-gradient(top, #33a7e3, #49b8f2) !important; 
  color: #ffffff;
  font-weight: normal;
}
.API_select {
  color: darkgrey;
  width: 213px;
}
.apiButton2 {
  border: 1px solid #886C6C;
}
.apiButton2:hover {
  border: 1px solid #886C6C;
}
.spacerToFixBounce {
    height: 34px;
    width: auto;
    
    z-index: -1;
}
.pluginDocs {
    text-decoration: none;
    padding-left: 43px;
    height: 20px;
    width: 20px;
    display: inline;
    padding-top: 8px;
    position: absolute;
    color: #FFFFFF;
}
a#pluginDocsLabel {
    font-family: "wiki";
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF !important;
    text-decoration: none;
}
</style>
<script>
// create xmlHttpRequest
function getXMLHttp()
{
  var xmlHttp
  try
  {
    //Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest();
  }
  catch(e)
  {
    //Internet Explorer
    try
    {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e)
    {
      try
      {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e)
      {
        alert("Your browser does not support AJAX!")
        return false;
      }
    }
  }
  return xmlHttp;
}
</script>
<div class="spacerToFixBounce" id="spacerToFixBounce">
<div class="customizeMe" id="customizeMe">
  
        <div class="onOffContainer" id="onOffContainer">
          <div class="clickToHideBar" id="clickToHideBar">
            <a href="#" onclick="hideBar();" title="Click here to hide the Add-ons bar."><img src="images/right_arrow.png" alt="Click here to hide the Add-ons bar." /></a>
          </div>
          <div class="clickToShowBar" id="clickToShowBar" title="Click here to open the Add-ons bar.">
            <a href="#" onclick="showBar();"><img src="images/left_arrow.png" /></a>
          </div>
      </div>
  
          <div class="clickToShowPlugin" id="clickToShowPlugin">
            <a href="#" onmouseover="fireSGMenu();" tabindex="8">View or Edit Gigya Add-ons</a>
          </div>
          <div class="pluginDocs" id="pluginDocs">
            <a class="pluginDocsLabel" id="pluginDocsLabel" title="Click here to see the full documentation for this tool." alt="Click here to see the documentation for this tool." href="http://developers.gigya.com/display/GD/Gigya+Add-ons+Viewer" target="_blank">&#xe81b;</a>
          </div>
</div>
</div>

<!-- DEV FOR NEW MODAL POPUP PER SG'S SUGGESTIONS -->
<style>
.newModalPageWrapper {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px auto;
  text-align: center;
  position: fixed;
  z-index: 1000;
  //background-color: rgba(0,0,0,.2);
}
#newModalPageWrapper {
    display: none;
}
#newModalMain {
    display: none;
    text-align: center;
    color: rgb(81, 81, 81);
    border:3px solid #d1d7df;
    font: 13px 'robotoregular';
    border-radius: 5px;
    width: 548px;
    height: auto;
    min-height: 47px;
    background-color: rgba(245,245,245,1);
    margin: 0px auto;
    margin-top: -150px;
    pointer-events: initial !important;
    z-index:9999999999999;
    -webkit-box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow:    0px 2px 6px 0px rgba(0, 0, 0, 0.3);
    box-shadow:         0px 2px 6px 0px rgba(0, 0, 0, 0.3);
}
.nmHeaderWrapper {
  height: auto;
  background-color: #1ca9e1;
  height: 44px;
  line-height: 44px;
  text-align: left;
  padding-left: 15px;
  font: 15px 'robotobold';
  vertical-align: middle !important;
  display: block;
  align-items: center;
}
.newModalHeader {
      width: 413px;
      color: #FFFFFF !important;
      cursor: move;
      line-height: 44px;
}
.modalMinimize {
       display: inline;
       font-size: 15px !important;
       font-weight: bold;
       color: #FFFFFF;
       float: right;
       //margin-left: 67px;
       font: inherit;
       //margin-top: 20px;
       width: 20px;
       height: 44px;
       //position: absolute;
       line-height: 44px;
       position: absolute;
       margin-left: 465px;
       margin-top: -22px;
}
.modalMinimize a {
    font-size: 20px;
    font-weight: bold;
    /* padding-right: 15px; */
    text-decoration: none;
    font: inherit;
    color: #FFFFFF;
    line-height: 44px;
}
.modalMaximize {
    display: none;
    font-size: 15px !important;
    font-weight: bold;
    color: #FFFFFF;
    float: right;
    font: inherit;
    width: 20px;
    height: 44px;
    line-height: 44px;
    position: absolute;
    margin-left: 465px;
    margin-top: -25px;
}
.modalMaximize a {
    font-size: 20px;
    font-weight: bold;
    /* padding-right: 15px; */
    text-decoration: none;
    font: inherit;
    color: #FFFFFF;
    line-height: 44px;
}
.modalClose {
  display: inline;
  font-size: 15px !important;
  font-weight: bold;
  color: #FFFFFF;
  float: right;
  font: inherit;
  width: 20px;
  height: 44px;
  line-height: 44px;
  position: absolute;
  margin-top: -26px;
  margin-left: 505;
}
.modalClose a {
    font-size: 20px;
    font-weight: bold;
    /* padding-right: 15px; */
    text-decoration: none;
    font: inherit;
    color: #FFFFFF;
    line-height: 44px;
}
.editingOptionsArea {
    min-height: 100px;
    width: 100%;  
}
.SGMenuWrapper {
    display: none;
    width: 300px;
    min-height: 306px;
    float: right;
    color: #FFFFFF;
    font: 15px 'robotoregular';
    margin-top: -32px;
    position: absolute;
    z-index: 100;
    right: 5%;
}
.SGMenuWrapperOn {
    display: block;
    width: 300px;
    min-height: 306px;
    float: right;
    color: #FFFFFF;
    font: 15px 'robotoregular';
    margin-top: -32px;
    position: absolute;
    z-index: 100;
    right: 5%;
}
.SGMenuList {
    
}
.SGMenuItem {
    
}
.SGButton {
    width:300px;
    height: 34px;
    border: 0px;
    border-bottom: 1px solid #FFFFFF;
    background-color: rgba(66,179,237,.9);
    color: #FFFFFF;
    font: 13px 'robotobold';
    
}
.SGButton:hover {
    background-color: rgba(3,79,124,.9);
    cursor: pointer;
}
.SGButtonClose {
    border-bottom-left-radius: 7px !important;
    border-bottom-right-radius: 7px !important;
    border-bottom: 1px solid #17268C !important;
}
.SGButtonDisabled {
    width:300px;
    height: 34px;
    border: 0px;
    border-bottom: 1px solid #FFFFFF;
    background-color: rgba(66,179,237,.9); /*background-color: #eef2f5;*/
    color: #3b96c9;
    font: 13px 'robotobold';
}

.SGButtonSelected {
    width:300px;
    height: 34px;
    border: 0px;
    border-bottom: 1px solid #FFFFFF;
    color: #FFFFFF;
    font: 13px 'robotobold';
    background-color: rgba(3,79,124,.9);
    cursor: default;
    color: #ffffff;
}
#modalBlackoutWrapper {   
    /*display: none;  >>>>>>>>>>>>>>>>>>>>>>>>> THIS LINE TOGGLES ON/OFF DIMMED BACKGROUND ON POPUP <<<<<<<<<<<<<<<<<<<<<<<*/ 
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    background-color: rgba(0,0,0,.2);
}
input#customSSTextField {
    width: 240px;
    background-color: rgb(235,235,235);
    float: right;
}

.apiModChoices {
    
}
.raasModChoices {
    
}
.paddingFixForModal {
    padding: 20px;
}
.div.gigya-screen-dialog, gigya-screen-dialog gigya-style-legacy gigya-chrome {
    border: 8px solid #E8E7E7;
    }
#closeModalWindowButton {
    margin-top: 20px;
    width: 100px;
    height: 25px;
}
.helpNote {
    //vertical-align: super;
    //font-size: 10px;
    color: rgb(0, 52, 255);
    cursor: help;
    text-decoration: none;
}


</style>
<?php
$modalPopupTitle='Not Live';

?>
<div class="newModalPageWrapper" id="newModalPageWrapper">
<div class="modalBlackoutWrapper" id="modalBlackoutWrapper">
</div>
    <div class="newModal" id="newModalMain">
    <script>
        $('#newModalMain').draggable();
    </script>
         <div class="nmHeaderWrapper" id="nmHeaderWrapper">
            <div class="newModalHeader" id="newModalHeader">
                <div class="modalTitleContainer" id="modalTitleContainer">
                    Not Set
                </div>
                <div class="modalMinimize" id="modalMinimize">
                    <a href="#" onclick="minimizeNewModal();"><img src="images/_.png" /></a>
                </div>
                <div class="modalMaximize" id="modalMaximize">
                    <a href="#" onclick="maximizeNewModal();"><img src="images/+.png" /></a>
                </div>
                <div class="modalClose" id="modalClose">
                    <a href="#" onclick="closeNewModal();"><img src="images/X.png" /></a>
                </div>
            </div>
          </div>
        <div class="paddingFixForModal" id="paddingFixForModal"><!-- $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ -->
        <div class="editingOptionsArea" id="editingOptionsArea"><!-- old selection_list -->
            <!-- API CONTENT -->
  
                <?php include_once('apiEditor.php'); ?>
                <script>
                  // makerequest1 -> API /////////////////////
                    function MakeRequestAPI() {
                      var xmlHttp = getXMLHttp();
                        var whichPlugin = "API";
                        var newAPI = document.getElementById('API_select').value;
                     
                     var queryString = "?whichPlugin=" + whichPlugin + "&newAPI=" + newAPI;
                      xmlHttp.onreadystatechange = function()
                      {
                        if(xmlHttp.readyState == 4)
                        {
                          HandleResponseAPI(xmlHttp.responseText);
                        }
                      }
                      xmlHttp.open("GET", "customize_processor.php" +queryString, true);
                      xmlHttp.send(null);
                    }
                    function HandleResponseAPI(response)
                      {
                        //location.reload(false);
                        //document.getElementById('code_block_api').innerHTML = response;
                      }
                      /****DESTROY SESSION****/
                      function MakeRequestReset() {
                      var xmlHttp = getXMLHttp();
                        var whichPlugin = "API";
                        var destroyThisSession = 1;
                     
                     var queryString = "?whichPlugin=" + whichPlugin + "&destroyThisSession=" + destroyThisSession;
                      xmlHttp.onreadystatechange = function()
                      {
                        if(xmlHttp.readyState == 4)
                        {
                          HandleResponseReset(xmlHttp.responseText);
                        }
                      }
                      xmlHttp.open("GET", "customize_processor.php" +queryString, true);
                      xmlHttp.send(null);
                    }
                    function HandleResponseReset(response)
                      {
                        //location.reload(false);
                        //document.getElementById('code_block_api').innerHTML = response;
                      }
                </script>
            
              <!-- RaaS CONTENT -->
                          <div class="customize_RaaS" id="raasModChoices" onmouseover="highlightDiv('loginBarHighlight');" onmouseout="blurDiv('loginBarHighlight');">
                            <div class="selection_area">
                            Collection ID: <span class="helpNote" title="If you edited the site's API Key to your own, you must choose either 'Default' or enter a specific Screen-Set Collection ID Prefix below that matches an active set of screens for your API key or this module will not function properly.">?</span> <br />
                            
                            <input type="radio" value="26oct15" name="ssCollectionNameRadio" id="demoSSCheckbox" class="ssRadioButton" title="If you are using the Raas-Demo Api Key select this option." checked="" onchange="MakeRequestRaas();" /><span class="screensetModText" id="screensetModText">&nbsp;&nbsp;Raas-Demo &nbsp;&nbsp;</span>
                            
                            &nbsp;&nbsp;<input type="radio" value="default" name="ssCollectionNameRadio" id="defaultSSCheckbox" class="ssRadioButton" title="If you are using the Default Gigya Screen-Set collection select this option." onchange="MakeRequestRaas();" /><span class="screensetModText" id="screensetModText">&nbsp;&nbsp;Default &nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        
                                        <input type="radio" value="Custom" name="ssCollectionNameRadio" id="customSSCheckbox" class="ssRadioButton" title="If you are not using the default Gigya Screen-Set collection, select this option and fill in the field." onchange="MakeRequestRaas();" /><span class="screensetModText" id="screensetModText">&nbsp;&nbsp;Custom: &nbsp;&nbsp;</span>
                                        
                                        <input type="text" value="Your Screen-Set Collection Prefix" class="customSSTextField" id="customSSTextField" name="customSSTextField" onclick="document.getElementById('defaultSSCheckbox').checked=false; document.getElementById('customSSCheckbox').checked=true;" title="Only enter the custom portion of your Screen-Set Collection name; i.e., if your screen-set is named '26oct15-RegistrationLogin' only enter '26oct15' in this field. NOTE: Screen-Set names are case-sensitive!" onfocus="checkCollectionIdIn();" onclick="checkCollectionIdIn();" onblur="checkCollectionIdOut();" onkeyup="MakeRequestRaas();"onchange="MakeRequestRaas();" />
                                        
                                        <br /><br />
                            screenSet: <select name="screenSet" id="screenSet_select" onchange="MakeRequestRaas();">
                                           <option>-RegistrationLogin</option>
                                           <option>-LinkAccounts</option>
                                           <option>-ProfileUpdate</option>
                                           <option>-ReAuthentication</option>
                                        </select><br /><br />
                            dialogStyle: <select name="dialogStyle" id="dialogStyle_select" onchange="MakeRequestRaas();">
                                            <option>modern</option>
                                            <option>legacy</option>
                                          </select><br /><br />
                            deviceType: <select name="deviceType" id="deviceType" onchange="MakeRequestRaas();">
                                            <option>auto</option>
                                            <option>desktop</option>
                                            <option>mobile</option>
                                            
                                          </select><br /><br />
                            lang: <span class="helpNote" title="The lang parameter only determines the language of any returned errors for the screen-set. To enable a screen-set in a language other than English you must add a New Screen-Set Collection for the specified language.">?</span> <select name="lang" id="lang" onchange="MakeRequestRaas();">
                                            <option>en</option>
                                            <option>es</option>
                                          </select><br /><br />
                            <div class="runButtonDiv">
                              <input type="button" id="run_raas" value="Initiate Custom ScreenSet" class="runButton" onclick="runCode('modCode_block_raas');" /><br /><br />
                            </div>
                            
                            
                              </div>
                             <textarea class="code_block" name="modCode_block_raas" id="modCode_block_raas" rows="14" wrap="virtual" onclick="selectTheCodeBlock('modCode_block_raas');" readonly="">
                              <?php echo $base_code_raas; ?>
                             </textarea>
                          </div>
                          <script>
                          // makerequest1 -> RaaS /////////////////////
                        function MakeRequestRaas() {
                          checkWhichRadio();
                          if (!document.getElementById('customSSTextField').value=='' && (!document.getElementById('customSSTextField').value=='Your Screen-Set Collection Prefix')) {
                          screenSetPrefix=document.getElementById('customSSTextField').value; 
                          }
                            var xmlHttp = getXMLHttp();
                            var whichPlugin = "raas";
                            var whichRadio=vRadio;
                            var newScreenSetPrefix = ''//screenSetPrefix;
                            var screenSet_select = document.getElementById('screenSet_select').value;
                            var dialogStyle_select = document.getElementById('dialogStyle_select').value;
                            var deviceType = document.getElementById('deviceType').value;
                            var lang = document.getElementById('lang').value;
                            
                              //var xxxx = document.getElementById('').value;
                         var queryString = "?screenSet_select=" + screenSet_select + "&dialogStyle_select=" + dialogStyle_select + "&whichPlugin=" + whichPlugin + "&deviceType=" + deviceType + "&lang=" + lang + "&newScreenSetPrefix=" + newScreenSetPrefix + "&whichRadio=" + whichRadio;
                          xmlHttp.onreadystatechange = function()
                          {
                            if(xmlHttp.readyState == 4)
                            {
                              HandleResponseRaas(xmlHttp.responseText);
                            }
                          }
                          xmlHttp.open("GET", "customize_processor.php" +queryString, true);
                          xmlHttp.send(null);
                        }
                        function HandleResponseRaas(response)
                          {
                            document.getElementById('modCode_block_raas').innerHTML = response;
                          }
                          </script>
            
            <!-- Follow Bar CONTENT -->
                          <div class="customize_FB" id="fbModChoices" onmouseover="highlightDiv('followBarHighlight');" onmouseout="blurDiv('followBarHighlight');">
                                  <div class="selection_area">
                                    iconSize (integer): <span class="helpNote" title="Determines the size (in pixels) of the individual provider icons.">?</span>&nbsp;&nbsp;&nbsp; <input type="text" maxwidth="4" name="iconSize" id="iconSize" onchange="MakeRequestFB();" onblur="MakeRequestFB();" onkeyup="MakeRequestFB();" value="42" />
                                          <br /><br />
                                    <div class="checkMarks" id="checkMarks">
                                      <span class="headlineText">Active Providers: <span class="helpNote" title="Many more providers are supported than are used here. For a complete list of available providers, see the documentation for this method.">?</span> </span><br />
                                      &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" class="fbCheckbox" name="facebookCheckbox" id="facebookCheckbox" value="1" title="Facebook" checked="" onchange="MakeRequestFB();" /><span class="fbModText" id="fbModText">Facebook</span><br />
                                      &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" class="fbCheckbox" name="twitterCheckbox" id="twitterCheckbox" value="1" title="Twitter" checked="" onchange="MakeRequestFB();" /><span class="fbModText" id="fbModText">Twitter</span><br />
                                      &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" class="fbCheckbox" name="googleCheckbox" id="googleCheckbox" value="1" title="Google Plus" checked="" onchange="MakeRequestFB();" /><span class="fbModText" id="fbModText">Google+</span><br />
                                      &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" class="fbCheckbox" name="rssCheckbox" id="rssCheckbox" value="1" title="RSS" checked="" onchange="MakeRequestFB();" /><span class="fbModText" id="fbModText">RSS</span><br />
                                      &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" class="fbCheckbox" name="linkedinCheckbox" id="linkedinCheckbox" value="1" title="LinkedIn" checked="" onchange="MakeRequestFB();" /><span class="fbModText" id="fbModText">LinkedIn</span><br /><br />
                                    </div> 
                              </div>
                            <textarea class="code_block" name="modCode_block_FB" id="modCode_block_FB" rows="14" wrap="virtual" onclick="selectTheCodeBlock('modCode_block_FB');" readonly="">
                              <?php echo $base_code_FB; ?>
                            </textarea>
                          </div>
                          <script>
                          // makerequest1 -> FB /////////////////////////////
                        function MakeRequestFB() {
                          var xmlHttp = getXMLHttp();
                            var whichPlugin = "FB";
                            var iconSize = document.getElementById('iconSize').value;
                            validateInteger(iconSize);
                            if (document.getElementById('facebookCheckbox').checked==true) {
                              var facebookCheckbox = '1';
                              } else {
                              var facebookCheckbox = '0';
                              }
                            if (document.getElementById('twitterCheckbox').checked==true) {
                              var twitterCheckbox = '1';
                            } else {
                              var twitterCheckbox = '0';
                            }
                            if (document.getElementById('googleCheckbox').checked==true) {
                              var googleCheckbox = '1';
                            } else {
                              var googleCheckbox = '0';
                            }
                            if (document.getElementById('rssCheckbox').checked==true) {
                              var rssCheckbox = '1';
                            } else {
                              var rssCheckbox = '0';
                            }
                            if (document.getElementById('linkedinCheckbox').checked==true) {
                              var linkedinCheckbox = '1';
                            } else {
                              var linkedinCheckbox = '0';
                            }
                         var queryString = "?iconSize=" + iconSize + "&whichPlugin=" + whichPlugin + "&facebookCheckbox=" + facebookCheckbox + "&twitterCheckbox=" + twitterCheckbox + "&googleCheckbox=" + googleCheckbox + "&rssCheckbox=" + rssCheckbox + "&linkedinCheckbox=" + linkedinCheckbox;
                          xmlHttp.onreadystatechange = function()
                          {
                            if(xmlHttp.readyState == 4)
                            {
                              HandleResponseFB(xmlHttp.responseText);
                            }
                          }
                          xmlHttp.open("GET", "customize_processor.php" +queryString, true);
                          xmlHttp.send(null);
                        }
                        function HandleResponseFB(response)
                          {
                            document.getElementById('modCode_block_FB').innerHTML = response;
                            runCode('modCode_block_FB');
                          }
                          </script>            
            
                <!-- Game Mechanics CONTENT GMHighlight -->
                                  <div class="customize_GM" id="gmModChoices" onmouseover="highlightDiv('GMHighlight');" onmouseout="blurDiv('GMHighlight');">
                                  
                                    <div class="selection_area">
                                    Parameters relating to the Loyalty add-on regard the way the widget presents on the site and are set up in the Gigya console.
                                    </div>
                                    <textarea class="code_block" name="modCode_block_GM" id="modCode_block_GM" rows="14" wrap="virtual" onclick="selectTheCodeBlock('modCode_block_GM');" readonly="">
                                      <?php echo $base_code_GM; ?>
                                    </textarea>
                                  </div>
                                  <script>
                                  </script>
                                  
                                  
                <!-- Activity Feed CONTENT -->
                                  <div class="customize_AF" id="afModChoices" onmouseover="highlightDiv('AFHighlight');" onmouseout="blurDiv('AFHighlight');">
                                  
                                  <div class="selection_area">
                                    tabOrder: <select name="tabOrder" id="tabOrder" onchange="MakeRequestAF();">
                                                   <option>everyone,friends,me</option>
                                                   <option>me,everyone,friends</option>
                                                   <option>friends,everyone,me</option>
                                                   <option>friends,me,everyone</option>
                                                </select><br /><br />
                                    initialTab: <select name="initialTab" id="initialTab" onchange="MakeRequestAF();">
                                                    <option>everyone</option>
                                                    <option>friends</option>
                                                    <option>me</option>
                                                  </select><br /><br />
                                    borderColor: <select name="borderColor" id="borderColor" onchange="MakeRequestAF();">
                                                    <option>darkgrey</option>
                                                    <option>red</option>
                                                    <option>orange</option>
                                                    <option>yellow</option>
                                                    <option>green</option>
                                                    <option>blue</option>
                                                    <option>violet</option>
                                                    <option>purple</option>
                                                    <option>pink</option>
                                                    <option>skyblue</option>
                                                    <option>beige</option>
                                                    <option>grey</option>
                                                    <option>black</option>
                                                  </select><br /><br />
                                    </div>
                                  
                                    <textarea class="code_block" name="modCode_block_AF" id="modCode_block_AF" rows="14" wrap="virtual" onclick="selectTheCodeBlock('modCode_block_AF');" readonly="">
                                      <?php echo $base_code_AF; ?>
                                    </textarea>
                                  </div>
                                  <script>
                                  // makerequest1 -> AF /////////////////////////////
                                    function MakeRequestAF() {
                                      var xmlHttp = getXMLHttp();
                                        var whichPlugin = "AF";
                                        var tabOrder = document.getElementById('tabOrder').value;
                                        var initialTab = document.getElementById('initialTab').value;
                                        var borderColor = document.getElementById('borderColor').value;
                                        

                                     var queryString = "?tabOrder=" + tabOrder + "&whichPlugin=" + whichPlugin + "&initialTab=" + initialTab + "&borderColor=" + borderColor;
                                      xmlHttp.onreadystatechange = function()
                                      {
                                        if(xmlHttp.readyState == 4)
                                        {
                                          HandleResponseAF(xmlHttp.responseText);
                                        }
                                      }
                                      xmlHttp.open("GET", "customize_processor.php" +queryString, true);
                                      xmlHttp.send(null);
                                    }
                                    function HandleResponseAF(response)
                                      {
                                        document.getElementById('modCode_block_AF').innerHTML = response;
                                        runCode('modCode_block_AF');
                                      }
                                  </script>            

                    <!-- Ratings & Reviews CONTENT rnrHighlight -->
                                      <div class="customize_RnR" id="rnrModChoices" onmouseover="highlightDiv('rnrHighlight');" onmouseout="blurDiv('rnrHighlight');">
                                        <div class="selection_area">
                                          showCommentButton: <select name="showCommentButton" id="showCommentButton" onchange="MakeRequestRnR();">
                                                    <option>true</option>
                                                    <option>false</option>
                                                   </select><br /><br />
                                          showReadReviewsLink: <select name="showReadReviewsLink" id="showReadReviewsLink" onchange="MakeRequestRnR();">
                                                    <option>true</option>
                                                    <option>false</option>
                                                   </select><br /><br />
                                          hideShareButtons: <select name="hideShareButtons" id="hideShareButtons" onchange="MakeRequestRnR();">
                                                    <option>true</option>
                                                    <option>false</option>
                                                   </select><br /><br />
                                          showLoginBar: <select name="showLoginBar_rnr" id="showLoginBar_rnr" onchange="MakeRequestRnR();">
                                                    <option>false</option>
                                                    <option>true</option>
                                                   </select><br /><br />
                                        </div>
                                      
                                      
                                        <textarea class="code_block" name="modCode_block_RnR" id="modCode_block_RnR" rows="14" wrap="virtual" onclick="selectTheCodeBlock('modCode_block_RnR');" readonly="">
                                          <?php echo $base_code_RnR; ?>
                                        </textarea>
                                      </div>
                                      <script>
                                      // makerequest1 -> RnR /////////////////////////////
                                        function MakeRequestRnR() {
                                          var xmlHttp = getXMLHttp();
                                            var whichPlugin = "RnR";
                                            var showCommentButton = document.getElementById('showCommentButton').value;
                                            var showReadReviewsLink = document.getElementById('showReadReviewsLink').value;
                                            var hideShareButtons = document.getElementById('hideShareButtons').value;
                                            var showLoginBar_rnr = document.getElementById('showLoginBar_rnr').value;

                                         var queryString = "?showCommentButton=" + showCommentButton + "&whichPlugin=" + whichPlugin + "&showReadReviewsLink=" + showReadReviewsLink + "&hideShareButtons=" + hideShareButtons + "&showLoginBar_rnr=" + showLoginBar_rnr;
                                          xmlHttp.onreadystatechange = function()
                                          {
                                            if(xmlHttp.readyState == 4)
                                            {
                                              HandleResponseRnR(xmlHttp.responseText);
                                            }
                                          }
                                          xmlHttp.open("GET", "customize_processor.php" +queryString, true);
                                          xmlHttp.send(null);
                                        }
                                        function HandleResponseRnR(response)
                                          {
                                            document.getElementById('modCode_block_RnR').innerHTML = response;
                                            runCode('modCode_block_RnR');
                                          }
                                      </script>


                <!-- Reactions CONTENT rnrHighlight -->
                                  <div class="customize_RA" id="raModChoices" onmouseover="highlightDiv('raHighlight');" onmouseout="blurDiv('raHighlight');">
                                    <div class="selection_area">
                                      Show Counts: <span class="helpNote" title="Tells the add-on if you want to display the amount of times the reactions have been chosen and where to place the object.">?</span> <select name="showCounts_RA" id="showCounts_RA" onchange="MakeRequestRA();">
                                                <option>right</option>
                                                <option>top</option>
                                                <option>none</option>
                                               </select><br /><br />
                                      layout: <select name="layout_RA" id="layout_RA" onchange="MakeRequestRA();">
                                                <option>horizontal</option>
                                                <option>vertical</option>
                                              </select><br /><br />
                                      noButtonBorders: <select name="noButtonBorders_RA" id="noButtonBorders_RA" onchange="MakeRequestRA();">
                                                <option>false</option>
                                                <option>true</option>
                                              </select><br /><br />
                                    </div>
                                    <textarea class="code_block" name="modCode_block_RA" id="modCode_block_RA" rows="14" wrap="virtual" onclick="selectTheCodeBlock('modCode_block_RA');" readonly="">
                                      <?php echo $base_code_RA; ?>
                                    </textarea>
                                  </div>
                                  <script>
                                        /***************** REACTIONS Ajax***********************/
                                  // makerequest1 -> SB //////////////////////////////////////////
                                function MakeRequestRA() {
                                  var xmlHttp = getXMLHttp();
                                    var whichPlugin = "RA";
                                    var showCounts_RA = document.getElementById('showCounts_RA').value;
                                    var layout_RA = document.getElementById('layout_RA').value;
                                    var noButtonBorders_RA = document.getElementById('noButtonBorders_RA').value;

                                    
                                 var queryString = "?showCounts_RA=" + showCounts_RA + "&pageName=" + pageName + "&whichPlugin=" + whichPlugin + "&layout_RA=" + layout_RA + "&noButtonBorders_RA=" + noButtonBorders_RA;
                                  xmlHttp.onreadystatechange = function()
                                  {
                                    if(xmlHttp.readyState == 4)
                                    {
                                      HandleResponseRA(xmlHttp.responseText);
                                    }
                                  }
                                  xmlHttp.open("GET", "customize_processor.php" +queryString, true);
                                  xmlHttp.send(null);
                                }
                                function HandleResponseRA(response)
                                  {
                                    document.getElementById('modCode_block_RA').innerHTML = response;
                                    runCode('modCode_block_RA');
                                  } 
                                </script><!-- END Reactions -->


            <!-- ShareBar CONTENT rnrHighlight -->
                                  <div class="customize_SB" id="sbModChoices" onmouseover="highlightDiv('sbHighlight');" onmouseout="blurDiv('sbHighlight');">
                                  <div class="selection_area">
                                  Show Counts: <span class="helpNote" title="The showCounts parameter tells the add-on whether or not to show the current count of shares and where to place the count object.">?</span> <select name="showCounts" id="showCounts" onchange="MakeRequestSB();">
                                                <option>none</option>
                                                <option>right</option>
                                                <option>top</option>
                                               </select><br /><br />
                                  Show iconsOnly: <span class="helpNote" title="The iconsOnly parameter tells the add-on if you want to display the social networks name or simply the icon.">?</span> <select name="iconsOnly" id="iconsOnly" onchange="MakeRequestSB();">
                                                <option>true</option>
                                                <option>false</option>
                                              </select><br /><br />
                                  layout: <select name="layout" id="layout" onchange="MakeRequestSB();">
                                                <option>horizontal</option>
                                                <option>vertical</option>
                                              </select><br /><br />
                                  noButtonBorders: <span class="helpNote" title="If using iconsOnly:true, this parameter has no affect. If using iconsOnly:false, this defines whether to display a border around the individual provider buttons.">?</span> <select name="noButtonBorders" id="noButtonBorders" onchange="MakeRequestSB();">
                                                <option>false</option>
                                                <option>true</option>
                                              </select><br /><br />
                                  operationMode: <select name="operationMode" id="operationMode" onchange="MakeRequestSB();">
                                                <option>simpleShare</option>
                                                <option>multiSelect</option>
                                              </select><br /><br />
                                  Share Button Type: <span class="helpNote" title="The shareButton parameter can consist of either an array of user pre-defined objects or a simple string of providers. Objects generally provide a better user experience, however, are more effort to implement.">?</span> <select name="enabledProvidersOn" id="enabledProvidersOn" onchange="MakeRequestSB()" />
                                  <option>Objects</option>
                                  <option>String</option>
                                  </select><br /><br />
                                
                                     &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" name="facebookEnabled" class="fbCheckbox" id="facebookEnabled" title="Facebook" checked="" onchange="MakeRequestSB()" /><span class="sbModText" id="sbModText">Facebook</span><br />
                                     &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" name="twitterEnabled" class="fbCheckbox" id="twitterEnabled" title="Twitter" checked="" onchange="MakeRequestSB()" /><span class="sbModText" id="sbModText">Twitter</span><br />
                                     &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" name="googleEnabled" class="fbCheckbox" id="googleEnabled" title="Google+" checked="" onchange="MakeRequestSB()" /><span class="sbModText" id="sbModText">Google+</span><br />
                                     &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" name="linkedinEnabled" class="fbCheckbox" id="linkedinEnabled" title="LinkedIn" checked="" onchange="MakeRequestSB()" /><span class="sbModText" id="sbModText">LinkedIn</span><br />
                                     &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" name="microsoftEnabled" class="fbCheckbox" id="microsoftEnabled" title="Microsoft" checked="" onchange="MakeRequestSB()" /><span class="sbModText" id="sbModText">Microsoft</span><br />
                                     &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" name="diggEnabled" class="fbCheckbox" id="diggEnabled" title="Digg" checked="" onchange="MakeRequestSB()" /><span class="sbModText" id="sbModText">Digg</span><br />
                                     &nbsp;&nbsp;&nbsp;&nbsp; <input type="checkbox" name="shareMoreEnabled" class="fbCheckbox" id="shareMoreEnabled" title="share More" checked="" onchange="MakeRequestSB()" /><span class="sbModText" id="sbModText">Share More</span><br /><br />
                                  </div>
                                    <textarea class="code_block" name="modCode_block_SB" id="modCode_block_SB" rows="14" wrap="virtual" onclick="selectTheCodeBlock('modCode_block_SB');" readonly="">
                                      <?php echo $base_code_SB; ?>
                                    </textarea>
                                  </div>
                                  <script>
                                    /***************** SHARE  AJAX***********************/
                                  // makerequest1 -> SB //////////////////////////////////////////
                                function MakeRequestSB() {
                                  var xmlHttp = getXMLHttp();
                                    var whichPlugin = "SB";
                                    var showCounts = document.getElementById('showCounts').value;
                                    var iconsOnly = document.getElementById('iconsOnly').value;
                                    var layout = document.getElementById('layout').value;
                                    var noButtonBorders = document.getElementById('noButtonBorders').value;
                                    var operationMode = document.getElementById('operationMode').value;
                                    
                                    if (document.getElementById('enabledProvidersOn').value=='Objects') {
                                      var enabledProvidersOn = '1';
                                      document.getElementById('facebookEnabled').disabled=false;
                                      document.getElementById('twitterEnabled').disabled=false;
                                      document.getElementById('googleEnabled').disabled=false;
                                      document.getElementById('linkedinEnabled').disabled=false;
                                      document.getElementById('microsoftEnabled').disabled=false;
                                      document.getElementById('diggEnabled').disabled=false;
                                      document.getElementById('shareMoreEnabled').disabled=false;
                                      
                                      } else {
                                      var enabledProvidersOn = '0';
                                      document.getElementById('facebookEnabled').disabled=true;
                                      document.getElementById('twitterEnabled').disabled=true;
                                      document.getElementById('googleEnabled').disabled=true;
                                      document.getElementById('linkedinEnabled').disabled=true;
                                      document.getElementById('microsoftEnabled').disabled=true;
                                      document.getElementById('diggEnabled').disabled=true;
                                      document.getElementById('shareMoreEnabled').disabled=true;
                                      }
                                      if (document.getElementById('facebookEnabled').checked==true && (document.getElementById('facebookEnabled').disabled==false)) {
                                      var facebookEnabled = '1';
                                      } else {
                                      var facebookEnabled = '0';
                                      }
                                      if (document.getElementById('twitterEnabled').checked==true && (document.getElementById('twitterEnabled').disabled==false)) {
                                      var twitterEnabled = '1';
                                      } else {
                                      var twitterEnabled = '0';
                                      }
                                      if (document.getElementById('googleEnabled').checked==true && (document.getElementById('googleEnabled').disabled==false)) {
                                      var googleEnabled = '1';
                                      } else {
                                      var googleEnabled = '0';
                                      }
                                      if (document.getElementById('linkedinEnabled').checked==true && (document.getElementById('linkedinEnabled').disabled==false)) {
                                      var linkedinEnabled = '1';
                                      } else {
                                      var linkedinEnabled = '0';
                                      }
                                      if (document.getElementById('microsoftEnabled').checked==true && (document.getElementById('microsoftEnabled').disabled==false)) {
                                      var microsoftEnabled = '1';
                                      } else {
                                      var microsoftEnabled = '0';
                                      }
                                      if (document.getElementById('diggEnabled').checked==true && (document.getElementById('diggEnabled').disabled==false)) {
                                      var diggEnabled = '1';
                                      } else {
                                      var diggEnabled = '0';
                                      }
                                      if (document.getElementById('shareMoreEnabled').checked==true && (document.getElementById('shareMoreEnabled').disabled==false)) {
                                      var shareMoreEnabled = '1';
                                      } else {
                                      var shareMoreEnabled = '0';
                                      }
                                    
                                 var queryString = "?showCounts=" + showCounts + "&whichPlugin=" + whichPlugin + "&pageName=" + pageName + "&enabledProvidersOn=" + enabledProvidersOn + "&facebookEnabled=" + facebookEnabled + "&twitterEnabled=" + twitterEnabled + "&googleEnabled=" + googleEnabled + "&linkedinEnabled=" + linkedinEnabled + "&microsoftEnabled=" + microsoftEnabled + "&diggEnabled=" + diggEnabled +  "&shareMoreEnabled=" + shareMoreEnabled + "&iconsOnly=" + iconsOnly +"&layout=" + layout + "&noButtonBorders=" + noButtonBorders +"&operationMode=" + operationMode;
                                  xmlHttp.onreadystatechange = function()
                                  {
                                    if(xmlHttp.readyState == 4)
                                    {
                                      HandleResponseSB(xmlHttp.responseText);
                                    }
                                  }
                                  xmlHttp.open("GET", "customize_processor.php" +queryString, true);
                                  xmlHttp.send(null);
                                }
                                function HandleResponseSB(response)
                                  {
                                    document.getElementById('modCode_block_SB').innerHTML = response;
                                    runCode('modCode_block_SB');
                                  } 
                                </script><!-- END SHAREBAR -->


            <!-- Comments CONTENT rnrHighlight -->
                              <div class="customize_CM" id="cmModChoices" onmouseover="highlightDiv('cmHighlight');" onmouseout="blurDiv('cmHighlight');">
                              <div class="selection_area">
                                deviceType: <select name="deviceType" id="deviceType_select" onchange="MakeRequestCM();">
                                  <option>auto</option>
                                  <option>mobile</option>
                                  <option>desktop</option>
                                 </select><br /><br />
                                showLoginBar: <select name="showLoginBar" id="showLoginBar" onchange="MakeRequestCM();">
                                  <option>false</option>
                                  <option>true</option>
                                 </select><br /><br />
                                 
                                 
                              </div>
                                <textarea class="code_block" name="modCode_block_CM" id="modCode_block_CM" rows="14" wrap="virtual" onclick="selectTheCodeBlock('modCode_block_CM');" readonly="">
                                  <?php echo $base_code_CM; ?>
                                </textarea>
                              </div>
                              <script>
                              /***************** COMMENTS AJAX***********************/
                              // makerequest1 -> CM //////////////////////////////////////////
                            function MakeRequestCM() {
                              var xmlHttp = getXMLHttp();
                                var whichPlugin = "CM";
                                var showLoginBar=document.getElementById('showLoginBar').value;
                                var deviceType_select = document.getElementById('deviceType_select').value;
                                
                             var queryString = "?deviceType_select=" + deviceType_select + "&whichPlugin=" + whichPlugin + "&pageName=" + pageName + "&showLoginBar=" + showLoginBar;
                              xmlHttp.onreadystatechange = function()
                              {
                                if(xmlHttp.readyState == 4)
                                {
                                  HandleResponseCM(xmlHttp.responseText);
                                }
                              }
                              xmlHttp.open("GET", "customize_processor.php" +queryString, true);
                              xmlHttp.send(null);
                            }
                            function HandleResponseCM(response)
                              {
                                document.getElementById('modCode_block_CM').innerHTML = response;
                                runCode('modCode_block_CM');
                              } 
                            </script>





            
            
            
            
            
        </div><!-- END OPTIONS SELECTION AREA -->
        <div class="modRepsonseArea" id="modRepsonseArea">
        </div>
    </div> <!-- $$$$$$$$$$$$$$$$$$$$$$$$$$$$$ -->

    </div><!-- END /newModalMain -->
</div>

<!-- MENU FOR CUSTOMIZE PLUGIN -->

<div class="SGMenuWrapper" id="SGMenuWrapper" onmouseleave="closeSGMenu()">
    <div class="SGMenuList" id="SGMenuList">
        <div class="SGMenuItem" id="SGMenuItem_00"><!----------- EDIT SITE API KEY ----------------------->
            <input type="button" class="SGButton" id="SGButtonApi" name="SGButtonApi" value="Edit Site Api Key" onclick="setMod('SGButtonApi', 'apiModChoices'); setModTitle('Edit Site API Key');" title="" tabindex="9" />
        </div>
       
        <div class="SGMenuItem" id="SGMenuItem_01"><!----------- EDIT SCREEN-SETS ------------------------>
            <input type="button" class="SGButton" id="SGButtonScreenSets" name="SGButtonScreenSets" value="Screen-Sets" onclick="setMod('SGButtonScreenSets', 'raasModChoices'); setModTitle('Screen-Sets');" onmouseover="highlightDiv('loginBarHighlight');" onmouseout="blurDiv('loginBarHighlight');" title="" tabindex="10" />
        </div>
        
        <div class="SGMenuItem" id="SGMenuItem_02"><!----------- EDIT FOLLOW BAR ------------------------->
            <input type="button" class="SGButton" id="SGButtonFollowBar" name="SGButtonFollowBar" value="Follow Bar" onclick="setMod('SGButtonFollowBar', 'fbModChoices'); setModTitle('Follow Bar');" onmouseover="highlightDiv('followBarHighlight');" onmouseout="blurDiv('followBarHighlight');" title="" tabindex="11" />
        </div>
        
        <div class="SGMenuItem" id="SGMenuItem_03"><!----------- EDIT GAME MECHANICS ---------------------->
            <input type="button" class="SGButton" id="SGButtonGameMech" name="SGButtonGameMech" value="Loyalty" onclick="setMod('SGButtonGameMech', 'gmModChoices'); setModTitle('Loyalty');" onmouseover="highlightDiv('GMHighlight');" onmouseout="blurDiv('GMHighlight');" title="" tabindex="12" />
        </div>
        
        <div class="SGMenuItem" id="SGMenuItem_04"><!----------- EDIT ACTIVITY FEED ----------------------->
            <input type="button" class="SGButton" id="SGButtonActivityFeed" name="SGButtonActivityFeed" value="Activity Feed" onclick="setMod('SGButtonActivityFeed', 'afModChoices'); setModTitle('Activity Feed');" onmouseover="highlightDiv('AFHighlight');" onmouseout="blurDiv('AFHighlight');" title="" tabindex="13" />
        </div>
        
        <div class="SGMenuItem" id="SGMenuItem_05"><!----------- EDIT RATINGS & REVIEWS ------------------->
            <input type="button" class="SGButton" id="SGButtonRnR" name="SGButtonRnR" value="Ratings & Reviews" onclick="setMod('SGButtonRnR', 'rnrModChoices'); setModTitle('Ratings & Reviews');" onmouseover="highlightDiv('rnrHighlight');" onmouseout="blurDiv('rnrHighlight');" title="" tabindex="14" />
        </div>
        
        <div class="SGMenuItem" id="SGMenuItem_06"><!----------- EDIT REACTIONS --------------------------->
            <input type="button" class="SGButton" id="SGButtonReactions" name="SGButtonReactions" value="Reactions" onclick="setMod('SGButtonReactions', 'raModChoices'); setModTitle('Reactions');" onmouseover="highlightDiv('raHighlight');" onmouseout="blurDiv('raHighlight');" title="" tabindex="15" />
        </div>
        
        <div class="SGMenuItem" id="SGMenuItem_07"><!----------- EDIT SHARE BAR --------------------------->
            <input type="button" class="SGButton" id="SGButtonShareBar" name="SGButtonShareBar" value="Share Bar" onclick="setMod('SGButtonShareBar', 'sbModChoices'); setModTitle('Share Bar');" onmouseover="highlightDiv('sbHighlight');" onmouseout="blurDiv('sbHighlight');" title="" tabindex="16" />
        </div>
        
        <div class="SGMenuItem" id="SGMenuItem_08"><!----------- EDIT COMMENTS ---------------------------->
            <input type="button" class="SGButton SGButtonClose" id="SGButtonComments" name="SGButtonComments" value="Comments" onclick="setMod('SGButtonComments', 'cmModChoices'); setModTitle('Comments');" onmouseover="highlightDiv('cmHighlight');" onmouseout="blurDiv('cmHighlight');" title="" tabindex="17" />
        </div>
    </div>
</div>


<script>



// FUNCTIONS ///////////////////////////////////

/*START SG*/
function setModTitle(modTitle) {
    document.getElementById('modalTitleContainer').innerHTML=modTitle;
}
function hideBar() {
  document.getElementById('customizeMe').className="customizeMeHidden";
  document.getElementById('clickToHideBar').style.display="none";
  document.getElementById('clickToShowBar').style.display="block";
  document.getElementById('clickToShowPlugin').style.display='none';
  document.getElementById('pluginDocs').style.display='none';
  document.getElementById('SGMenuWrapper').className='SGMenuWrapper';
}
function showBar() {
  document.getElementById('customizeMe').className="customizeMe";
  document.getElementById('clickToShowBar').style.display="none";
  document.getElementById('clickToHideBar').style.display="block";
  document.getElementById('clickToShowPlugin').style.display='block';
  document.getElementById('pluginDocs').style.display='inline';
}
function setMod(button, div) {
    document.getElementById('SGMenuWrapper').className='SGMenuWrapper';
    document.getElementById('customizeMe').style.display='block';
    document.getElementById('customizeMe').className='customizeMeHidden';
    document.getElementById('clickToShowBar').style.display='block';
    document.getElementById('clickToShowPlugin').style.display='none';
    document.getElementById('clickToHideBar').style.display='none';
    document.getElementById('pluginDocs').style.display='none';
    
    document.getElementById('newModalPageWrapper').style.display="block";
    document.getElementById('newModalMain').style.display = 'block';
    document.getElementById('apiModChoices').style.display = 'none'; //div
    document.getElementById('SGButtonApi').className = 'SGButton'; //button
    document.getElementById('raasModChoices').style.display = 'none'; //div
    document.getElementById('SGButtonScreenSets').className = 'SGButton'; //button
    document.getElementById('fbModChoices').style.display = 'none'; //div
    document.getElementById('SGButtonFollowBar').className = 'SGButton'; //button
    document.getElementById('gmModChoices').style.display = 'none'; //div
    document.getElementById('SGButtonGameMech').className = 'SGButton'; //button
    document.getElementById('afModChoices').style.display = 'none'; //div
    document.getElementById('SGButtonActivityFeed').className = 'SGButton'; //button
    document.getElementById('rnrModChoices').style.display = 'none'; //div
    document.getElementById('SGButtonRnR').className = 'SGButton'; //button
    document.getElementById('raModChoices').style.display = 'none'; //div
    document.getElementById('SGButtonReactions').className = 'SGButton'; //button
    document.getElementById('sbModChoices').style.display = 'none'; //div
    document.getElementById('SGButtonShareBar').className = 'SGButton'; //button
    document.getElementById('cmModChoices').style.display = 'none'; //div
    document.getElementById('SGButtonComments').className = 'SGButton'; //button
    document.getElementById(div).style.display = 'block'; //div
    disableSGWidget();
    
    
 // } 
  
}
  /****Disable buttons on pages that the widget does not exist****/
  
  function disableSGWidget() {
    function disableWidgetMod(button) {
      document.getElementById(button).disabled='disabled';
      document.getElementById(button).title='Disabled: The corresponding widget does not exist on this page.';
      if (button=='SGButtonComments') {
        document.getElementById(button).className='SGButtonDisabled SGButtonClose';
      } else {
        document.getElementById(button).className='SGButtonDisabled';
      }  
    }
    if (pageName == 'Home') {
      disableWidgetMod('SGButtonReactions');
      disableWidgetMod('SGButtonComments');
      disableWidgetMod('SGButtonShareBar');
    } else if (pageName == 'Recipe1') {
      disableWidgetMod('SGButtonRnR');
    } else if (pageName == 'Recipe2') {
      disableWidgetMod('SGButtonRnR');
    } else if (pageName == 'Recipe3') {
      disableWidgetMod('SGButtonRnR');
    } else if (pageName == 'About') {
      disableWidgetMod('SGButtonComments');
    }
  }
  disableSGWidget();


//END SG///


function runCode(currentPlugin) {
  var currentCode=document.getElementById(currentPlugin).value;
  eval(currentCode);
}
/* HOVER EFFECTS FOR CODE */
function highlightDiv(divToShow) {
  document.getElementById(divToShow).className='highlightedDiv';
}
function blurDiv(divToBlur) {
  document.getElementById(divToBlur).className='notHighlightedDiv';
}
function showButtonLink() {
  document.getElementById('customizeButton').innerHtml='Click Here To Examine Or Customize Gigya add-ons';
}
function hideButtonLink() {
  document.getElementById('customizeMeHidden').innerHtml='';
  document.getElementById('clickToShowPlugin').innerHtml='<img src="images/down_arrow.png /&gt;"';
  document.getElementById('clickToShowPlugin').style.display='none';
  document.getElementById('pluginDocs').style.display='none';
}
function getResize() {
  screenWidth = $(window).width();
  if (screenWidth < 400) {
    
  }
}

//VALIDATE ITEMS ////////////////////////////////////////////////////////////////////////
  
  function validateInteger(x) {
    var z = new RegExp('^\\d+$');
    if (!z.test(x)) {
      alert('You must use an integer for the iconSize field!');
      return false;
    } else {
      return true;
    }
  }
  
  
  //FUNCTIONS FOR NEW MODAL POPUP//////////////////

function fireSGMenu() {
    document.getElementById('SGMenuWrapper').className='SGMenuWrapperOn';
    document.getElementById('customizeMe').className='customizeMe2';
}
function closeSGMenu() {
    document.getElementById('SGMenuWrapper').className='SGMenuWrapper';
    document.getElementById('customizeMe').style.display='block';
    document.getElementById('clickToShowBar').style.display='none';
    document.getElementById('clickToHideBar').style.display='block';
    document.getElementById('customizeMe').className='customizeMe';
    document.getElementById('clickToShowPlugin').style.display='block';
    document.getElementById('pluginDocs').style.display='inline';
    document.getElementById('modalBlackoutWrapper').style.display='none';
    
}
function closeNewModal() {
    document.getElementById('newModalMain').style.display='none';
    document.getElementById('newModalPageWrapper').style.display='none';
    document.getElementById('SGMenuWrapper').className='SGMenuWrapperOn';
    document.getElementById('customizeMe').style.display='block';
}
function minimizeNewModal() {
    document.getElementById('paddingFixForModal').style.display='none';
    document.getElementById('modalMinimize').style.display='none';
    document.getElementById('modalMaximize').style.display='inline';
    document.getElementById('modalBlackoutWrapper').style.display='none';
    document.getElementById('newModalPageWrapper').style.pointerEvents = 'none';
}
function maximizeNewModal() {
    document.getElementById('paddingFixForModal').style.display='block';
    document.getElementById('modalMinimize').style.display='inline';
    document.getElementById('modalMaximize').style.display='none';
    document.getElementById('modalBlackoutWrapper').style.display='block';
    document.getElementById('newModalPageWrapper').style.pointerEvents = 'initial';
}

function checkWhichRadio() {
    radioButton01=document.getElementById('demoSSCheckbox');
    radioButton02=document.getElementById('defaultSSCheckbox');
    radioButton03=document.getElementById('customSSCheckbox');
    if (radioButton01.checked==true) {
        vRadio='26oct15';
    } else if (radioButton02.checked==true) {
        vRadio='Default';
    } else if (radioButton03.checked==true) {
        vRadio=document.getElementById('customSSTextField').value;
    }
}
function changeVal(unit) {
  if (unit.name == 'customSSTextField') {
        v0101 = unit.value;
    } else {
        alert('Something went wrong::changeVal?!');
    }
}
function checkCollectionIdIn() {
  changeVal(customSSTextField);
  if (document.getElementById('customSSTextField').value == 'Your Screen-Set Collection Prefix') {
    document.getElementById('customSSTextField').value = '';
  } else if (document.getElementById('customSSTextField').value == '') {
    document.getElementById('customSSTextField').value = 'Your Screen-Set Collection Prefix';
  } else {
    document.getElementById('customSSTextField').value = v0101;
  }
}
function checkCollectionIdOut() {
  changeVal(customSSTextField);
  if (document.getElementById('customSSTextField').value !== '' && (document.getElementById('customSSTextField').value !== 'Your Screen-Set Collection Prefix')) {
    document.getElementById('customSSTextField').value = v0101;
  } else {
  document.getElementById('customSSTextField').value = 'Your Screen-Set Collection Prefix';
  document.getElementById('customSSTextField').checked=false;
  document.getElementById('defaultSSCheckbox').checked=false;
  document.getElementById('demoSSCheckbox').checked=true;
  }
}

function selectTheCodeBlock(block) {
    $('#'+block).selectText();
}
//close modal on escape
$(document).keyup(function(e) {

         if (e.keyCode == 27) { // escape key maps to keycode `27`
            if (document.getElementById('newModalMain').style.display=="block") {
                closeNewModal();
                console.log('closeNewModal via escape');
            }
        }
});

/* TOOL-TIPS */
$('span[title]').qtip({ style: { name: 'cream', tip: true }, position: { corner: { target: 'topRight', tooltip: 'bottomLeft' } } } );

</script>
<!-- /************************************ END CUSTOMIZATION PLUGIN ************************************/ -->
