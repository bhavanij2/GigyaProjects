<?php
$page = 'Home';
require_once('header.php');
?>
<!--  Body cont.-->
			  <div class="welcome">
				  <h4>Welcome to Gigya's RaaS Demo site.</h4>
				  <p class="welcome-message">The Daily Recipe site is a Gigya demo site written in PHP and JavaScript. This demo outlines how to make a website integrating Gigya's platform.<br /><br />
				The demo site's code is available for you to <a href="http://wikifiles.gigya.com/DemoSite/raasDailyRecipe.zip" alt="download">download</a>. Learn about the site implementation <a class="wiki" href="http://developers.gigya.com/display/GD/RaaS+Site+Implementation">here</a>.</p>
			    </div>
            <div class="recipe-list">
                <ul class="pages">
                    <li class="odd first">
                        <div class="page-summary-1">
                          <div class="recipeImage01">
                            <a href="recipe1.php"><img class="image" src="images/hp/img1.png"/></a>
                          </div>
                            <div class="summary">
                                <a href="recipe1.php"><h3 class="summary-title">GATEAU A LA ROYALE</h3></a>

                                <div class="summary-new">
                                    <div class="summary-fix" id="summary-fix">Jumping on the Royal Wedding bandwagon, I was tasked with
                                    making the Royal Wedding fridge cake for a tea party.
                                    </div>
                                </div>
                                <a class="recipe-link" href="recipe1.php">Get the recipe</a>
                                <div class="cooking-time-fix-b">
                                  <div class="cooking-time Icon-Clock">3h</div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="odd">
                        <div class="page-summary-1">
                            <a href="recipe2.php"><img class="image" src="images/hp/img2.png"/></a>

                            <div class="summary">
                                <a href="recipe2.php"><h3 class="summary-title">MUSHROOM MYSTIQUE</h3></a>

                                <div class="summary-new">
                                    <div class="summary-fix" id="summary-fix">I absolutely love mushrooms, and think that one of the
                                    simplest, most luxurious food that you can have is creamy mushroom soup!
                                    </div>
                                </div>
                                <a class="recipe-link" href="recipe2.php">Get the recipe</a>
                                <div class="cooking-time-fix-b">
                                  <div class="cooking-time Icon-Clock" id="">1h</div><!-- center clock -->
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="odd last">
                        <div class="page-summary-1">
                            <a href="recipe3.php"><img class="image" src="images/hp/img3.png"/></a>
                            <div class="summary">
                                <a href="recipe3.php"><h3 class="summary-title">CARBONARA GNOCCHI</h3></a>
                                <div class="summary-new">
                                    <div class="summary-fix" id="summary-fix">Gnocchi with bacon and spinach carbonara style.
                                    </div>
                                </div>
                                <a class="recipe-link" href="recipe3.php">Get the recipe</a>
                                <div class="cooking-time-fix-b">
                                  <div class="cooking-time Icon-Clock">50m</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
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
