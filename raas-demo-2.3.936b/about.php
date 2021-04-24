<?php
$page = 'About';
require_once('header.php');
?>
<!--  Body cont. -->
            <div class="caption recipe-caption">
                <div class="recipe-title"><h1>About</h1></div>
            </div>
            <!-- Reactions Bar -->
            <div class="reaction-wrap">
            <div class="notHighlightedDiv" id="raHighlight">
                <div class="code-opts">
                    <div class="code-links">
                        <a class="get-code" href="#" data-fn-name="reactions">Get Code </a>|
                        <a class="docs" href="#"> Docs</a>
                    </div>
                </div>
                <div id=reactionsDiv></div> <!-- Reactions DIV Container -->
            </div>
            </div>
            <!-- Content  -->
            <div class="about">
                <h2>Overview</h2>
                The Daily Recipe site is <a href="http://www.gigya.com" target="_blank">Gigya's</a> demo site written in <a href="http://PHP.net/" target="_blank">PHP</a> and Javascript. This demo outlines how to make a web site social using Gigya's platform. <br />
                The demo site's code is available for you to <a href="http://wikifiles.gigya.com/DemoSite/raasDailyRecipe.zip" target="_blank">download</a>, <a href="http://developers.gigya.com/display/GD/RaaS+-+Demo+Site#RaaS-DemoSite-InstallingtheSiteonYourOwnHost" target="_blank">install</a> and learn about the <a href="http://developers.gigya.com/display/GD/RaaS+Site+Implementation" target="_blank">site implementation</a>. <br />
                Gigya provides a large array of features for sites and this sample site makes use of only a few of those capabilities. Some of the features that are used in this site:
                <ul>
                    <li><strong>Registration-as-a-Service:</strong>
                        <br />Social login and registration combined. Manage account linking between a user's existing site account and their various social identities.
                        <img src="images/raas-login-5.8.png" align="right"/>
                        <br />Users can connect via more than <a target="_blank" href="http://developers.gigya.com/display/GD/Social+Network+Capabilities+Table/">35</a> social and identity providers like Facebook, Twitter, LinkedIn, Google, Yahoo, Paypal, Messenger and many more. Gigya's Registration-as-a-Service (RaaS) enables access to rich user profile data including email addresses, and provides standardized data field structure and nomenclature across all identity providers.
                        <br /><br />
                    </li>
                    <li><strong>Social Plugins:</strong><br />
                        <table cellspacing="8" cellpadding="0" border="0" >
                            <tbody>
                            <tr style="vertical-align:top">
                                <td><img src="images/reactions-overview.jpg"/> </td>
                                <td><strong>Reactions:</strong><br />A set of customizable buttons to capture user reactions and drive sharing to social networks with a single click.</td>
                                <td colspan="3">&nbsp;</td>
                                <td><img src="images/comments-overview.jpg"/> </td>
                                <td><strong>Comments:</strong><br />Enables site commenting integrated with social publishing and authentication, plus administrative tools and controls.</td>
                            </tr>
                            <tr>
                                <td colspan="7">&nbsp;</td>
                            </tr>
                            <tr style="vertical-align:top">
                                <td><img src="images/sharebar-overview.jpg" /></td>
                                <td><strong>Share Bar:</strong><br />A set of Share buttons with counters for sharing and bookmarking to social networks.</td>
                                <td colspan="3">&nbsp;</td>
                                <td><img src="images/activityfeed-overview.jpg" /> </td>
                                <td><strong>Activity feed:</strong><br />Displays a real-time stream of user activity on site.</td>
                            </tr>
                            <tr>
                                <td colspan="7">&nbsp;</td>
                            </tr>
                            <tr style="vertical-align:top">
                                <td><img src="images/gm-overview.gif" /></td>
                                <td><strong>Game Mechanics:</strong><br />Social loyalty and rewards platform, increasing site engagement and making users' experience more enjoyable.</td>
                                <td colspan="3">&nbsp;</td>
                                <td><img src="images/followbar-overview.jpg" /> </td>
                                <td><strong>Follow Bar:</strong><br />Displays a bar of "follow" buttons.</td>
                            </tr>
                            <tr>
                                <td colspan="7">&nbsp;</td>
                            </tr>
                            <tr style="vertical-align:top">
                                <td><img src="images/r&r-overview.gif" /></td>
                                <td><strong>Rating & Reviews:</strong><br />Easy way to provide feedback on products, fully customizable design and SEO friendly.</td>
                                <td colspan="5">&nbsp;</td>
                            </tr>
                            </tbody>
                        </table>
                    </li>
                </ul>

                <h2>Download Sources</h2>
                Please find the sources of the Daily Recipe Site <a href="http://wikifiles.gigya.com/DemoSite/raasDailyRecipe.zip">here</a>.
                <br /><br />
                <h2>Learn More</h2>
                To learn about the site implementation, how to install the site and more please refer to <a href="http://developers.gigya.com/display/GD/RaaS+-+Demo+Site" target="_blank">Gigya's Raas-Demo Site Guide</a>.
                <br /><br />
            </div>
                <!-- Share Bar -->
                <div class="share-wrap ui-helper-clearfix">
                <div class="notHighlightedDiv" id="sbHighlight">
                    <span class="shareText">Share this recipe with your friends</span>
                    <div class="code-opts">
                        <div class="code-links">
                            <a class="get-code" href="#" data-fn-name="ShareBar">Get Code </a>|
                            <a class="docs" href="#"> Docs</a>
                        </div>
                    </div>
                    <div id="shareButtons"></div>  <!-- Share Bar Plugin DIV Container -->
                </div>
                </div>
            <div class="rating-reviews">
            <div class="notHighlightedDiv" id="rnrHighlight">
                <div class="inner">
                    <h2 class="comments-title">Ratings and Reviews</h2>
                    <div class="code-opts">
                        <div class="code-links">
                            <a class="get-code" href="#" data-fn-name="rNr">Get Code </a>|
                            <a class="docs" href="#"> Docs</a>
                        </div>
                    </div>
                    <!-- Ratings and Reviews div -->
                    <div id="ratings" class="ratings"></div>
                    <div id="reviews" class="reviews"></div>
                </div>
            </div>
            </div>
        </div>
<?php include_once('sidebar.php'); ?>
<?php include_once('footer.php'); ?>
