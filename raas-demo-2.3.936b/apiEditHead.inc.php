<?php
if (@$_SESSION['thisApiKey'] == NULL) {
  @$_SESSION['thisApiKey'] = $key;
}
@$currentSessionAPI = $_SESSION['thisApiKey'];
@$deleteApiKey='';
@$thisApiKey=$_POST['thisApiKey'];
@$deleteApiKey=$_POST['deleteApiKey'];
$currentMessage='';
$SessionIsDestroyed='';
$isSessionDestroyedInput='';
if (isset($_GET['apikey'])) {
	$key = $_GET['apikey'];
} else {
	require_once('config.php');
	$key = $apiKey;
}
if ( isset( $_POST['thisApiKey'] ) && $_POST['thisApiKey'] !== '' ) {
    $currentApiKey = $thisApiKey;
    $_SESSION['thisApiKey']=$thisApiKey;
    $SessionIsDestroyed='1';
    $isSessionDestroyedInput = '<input type="hidden" name="SessionIsDestroyed" class="SessionIsDestroyed" id="SessionIsDestroyed" value="1" />';
} else if (isset( $_POST['thisApiKey'] ) && $_POST['thisApiKey'] == '') {
  $currentApiKey = $key;
  $_SESSION['thisApiKey']=$key;
  $SessionIsDestroyed='1';
  $isSessionDestroyedInput = '<input type="hidden" name="SessionIsDestroyed" class="SessionIsDestroyed" id="SessionIsDestroyed" value="1" />';
} else {
	$currentApiKey = $currentSessionAPI;
	$SessionIsDestroyed='0';
	$isSessionDestroyedInput = '<input type="hidden" name="SessionIsDestroyed" class="SessionIsDestroyed" id="SessionIsDestroyed" value="0" />';
}
if ( isset( $_POST['deleteApiKey'] ) && $_POST['deleteApiKey'] !== '' ) {
  if ($deleteApiKey == '1' && $thisApiKey=='') {
	session_destroy();
	$currentMessage='<br /><span style="color:red;">You are now using the default API Key.</span><br />';
  } else if ($deleteApiKey == '1' && $thisApiKey !== '') {
	$currentMessage='<br /><span style="color:red;">You entered an API Key so I temporarily ignored the Revert to Default request and will use that API key until you press the Change Key again.</span><br />';
  } else {
	$currentMessage='';
  }
}
if ($currentApiKey==$key) {
    $nonSiteScreenSetRequired=0;
} else {
    $nonSiteScreenSetRequired=1;
}
echo "<input type='hidden' value='null' name='headSpace' />";
?>
