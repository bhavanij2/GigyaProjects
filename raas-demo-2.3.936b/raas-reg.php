<?php
require_once ('GSSDK.php');
require_once('config.php');
	$key = $apiKey;
	$secret=$currentSecret;
if (!empty($_POST)) {
    if ($_POST['action'] == 'login') {
        $apiKey        = $key;
        $secret        = $secret;
        $uid           = $_POST['UID'];
        $userSignature = $_POST['UIDSignature'];
        $timestamp     = $_POST['signatureTimestamp'];
        if (SigUtils::validateUserSignature($uid, $timestamp, $secret, $userSignature)) {
            if (session_start()) {
             /*   // publish event to UBX. use the event code you have registered, as first parameter
				    file_put_contents(LOG_PATH, PHP_EOL . "test", FILE_APPEND);
                    ubxPublish("x1twitterMentioned", $_POST); // x1twitterMentioned is used as an example instead of "login" for Silverpop compatability
                // end ubx publish    */
                $_SESSION['username'] = $_POST['user']['firstName'];
                echo(json_encode(array('result' => 'success')));       
            }
        } else {
            echo(json_encode(array('result' => 'error', 'message' => 'signature not valid')));
        }
    } elseif ($_POST['action'] == 'logout') {
        //session_destroy();
        echo(json_encode(array('result' => 'success')));
    }
    exit();
}

function getLoggedInHtml($info) {
$userdetails = $info['user'];
return '<div id="div_LoggedIn" class="logged-in">
        <div class="loginBar-item loginBar-image"><img class="userimage" src="' . $userdetails["thumbnailURL"] . '"/></div>
<div class="login-text loginBar-item ">
    <div class="user-name">' . $userdetails["firstName"] . ' ' . $userdetails['lastName'] . '</div>
    <div class="logout"><a href="#">Logout</a></div>
</div>';
}

function getLoggedOutHtml() {
    return '
    <div id="div_notLoggedIn" class="logged-out">
            <div class="loginBar-item hello">Hello Guest!</div>
            <div class="actions">
                <div class="loginBar-item login">
                    <a href="#">Login</a>
                </div>
                <div class="loginBar-item register">
                    <a href="#">Register</a>
                </div>
            </div>
        </div>';
}
