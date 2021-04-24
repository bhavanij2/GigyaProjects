<?php
ini_set("session.cookie_httponly", 1);
SESSION_START(); // support for dynamic api
if (isset($_GET['apikey'])) {
	$key = $_GET['apikey'];
} else {
	require_once('config.php');
	$key = $apiKey;
}
require_once('apiEditHead.inc.php'); //enables API editor for customization plugin
$title = 'Daily Recipe - Gigya Demo Site ' . $page;
$pageDescription = 'Daily Recipe is a Gigya demo site that uses Gigya\'s add-ons and APIs. The site is intended for developers who want to understand how to implement Gigya.';
// Set the page's Twitter Tags image
$lpage = strtolower($page);
if (($lpage == 'home') || ($lpage == 'about') || ('invite-a-friend')) {
    $tweetImg = 'http://raas-demo.gigya.com/images/300x250_myoss_3frames.gif';
} else {
    $tweetImg = 'http://raas-demo.gigya.com/images/' .$lpage. '.png';
}
echo '<input type="hidden" id="currentPageName" name="currentPageName" value="' . $lpage . '" />';
?>
<!DOCTYPE html>
<html class="htmlBackgroundWrapperClass0" id="htmlBackgroundWrapper" xmlns="http://www.w3.org/1999/xhtml" xmlns:fb=http://www.facebook.com/2008/fbml>
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# socializedemo: http://ogp.me/ns/fb/socializedemo#">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><!--This must be the first item beneath the document <title></title> of the <head> section of your page for mobile support! -->
	<!-- For Mobile view  -->
	<meta property="qc:admins" content="1156265476767171163757"/>
	<title><?php echo $title; ?></title>
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
	<link href="css/reset.css" rel="stylesheet" type="text/css"/>
	<link href="css/style.css" rel="stylesheet" type="text/css"/>
	<link href="css/sprites.css" rel="stylesheet" type="text/css"/>
	<link href="css/prism.css" rel="stylesheet" type="text/css"/>
	<script type="text/javascript" lang="javascript">
		var expire5min = (new Date()).getTime() + 120000; // expiration time - 5 min from now
		currentPage=document.getElementById('currentPageName').value;
	</script>
	<!-- include Gigya's JS library -->
	<script type="text/javascript" lang="javascript" src="http://cdn.gigya.com/JS/socialize.js?apikey=<?php echo $currentApiKey ?>">
		{ 
		    // Global configuration object for Gigya JS API methods
			"sessionExpiration" :0, // expire the user login session when the browser closes
			"connectWithoutLoginBehavior": "alwaysLogin", // This will cause Gigya's 'Adding Connection' operation (i.e. when the user clicks one of the social network buttons within the Social Plugins)
			// to behave like a call to login in case the current user is not logged in.
			"autoShareExpiration": expire5min, // User's auto-share selection will expire after 5 min
			"facebookInitParams":
			{
				"cookie": true,
				"status": true,
				"xfbml":  true,
				"oauth":  true
			}, // Facebook init for Graph Actions
			deviceType: 'auto' // Automatically identify the device mobile/desktop (using user-agent) and optimize the view of the plugins accordingly
		}
	</script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>

	<!-- include JS libraries -->
	<script type="text/javascript" src="js/mobile.js"></script>
	<!-- Implements the mobile version of the menu !-->
	<script type="text/javascript" src="js/fbAction.js"></script>
	<script type="text/javascript" src="js/gigyaPlugins.js"></script>
	<script type="text/javascript" src="js/jquery.simplemodal.js"></script>
	<script type="text/javascript" src="js/prism.js"></script>
	<script type="text/javascript" src="js/javascriptobfuscator_unpacker.js"></script>
	<script type="text/javascript" src="js/beautify.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
	<!-- Add cool tool-tips -->
    <script type="text/javascript" src="js/jquery.qtip.js"></script>
    <link href="css/jquery.qtip.css" rel="stylesheet" type="text/css" />

	<!-- Implementation of posting Facebook Open Graph action !-->
	<!-- Facebook's Open Graph tags !-->
	<meta property="fb:app_id" content="208351582528147">
	<meta property="og:url" content="http://demo.gigya.com/">
	<meta property="og:title" content="Daily Recipe">
	<meta property="og:description" content="<?php echo $pageDescription; ?>">
	<meta property="og:type" content="socializedemo:recipe">
	<meta property="og:image" content="http://demo.gigya.com//images/dailyrecipe_75x75.gif">
	<meta property="og:site_name" content="Daily Recipe"/>

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@Gigya">
  <meta name="twitter:creator" content="@Gigya">
  <meta name="twitter:title" content="<?php echo $title; ?>">
  <meta name="twitter:description" content="<?php echo $pageDescription; ?>">
  <meta name="twitter:image" content="<?php echo $tweetImg; ?>">
  <!--Loading  Gigya's Google Analytics plug&play library-->
	<script type="text/javascript" src="http://cdn.gigya.com/js/gigyaGAIntegration.js"></script>
	<script type="text/javascript">
		// Google Analytics load
		/*
		    PLACE YOUR PERSONAL GOOGLE ANALYTICS TRACKING CODE HERE
		*/
	</script>
</head>
<!-- ------------The Body Element Starts Here------------ -->
<body class="home" id="bodyBackgroundWrapper">
<?php
  if (($isSessionDestroyedInput !=='') && ($isSessionDestroyedInput !==NULL)) {
    echo $isSessionDestroyedInput; // This is required for the API Editor to function properly 
  }
?>
<div class="wrap" id="topLevelDivWrapId">
<div class="inner_wrap" id="">
<!--  Header  -->
<?php include_once('mobileMenuInc.php'); ?>
<div class="header" id="siteMainHeader">
    <div class="mobile-menu-button" onclick="showMobileMenu();"></div>
    <!-- Mobile menu  -->
    <div class="logo"><a href="index.php" class="link">Daily Recipe</a></div>
    <!-- The Menu bar  -->
    <?php include_once('siteMenu.php'); ?>
    <!-- The login-bar  -->
    <?php require_once('loginbar.php'); ?>
</div>
<div class="body">
    <div class="body-wrap ui-helper-clearfix">
    <?php include_once('customize.php'); // Comment out or remove this line to disable the Customize Plugin ?>
      <div class="recipecontent"> <!-- The Body continues on each page -->
