<?php
$page = 'Recipe3';
require_once('header.php');
?>
<!--  Body cont. -->
            <div class="caption recipe-caption">
                <div class="recipe-title"><h1>CARBONARA GNOCCHI</h1><span class="recipe-date">JUNE 18, 2013</span></div>
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
            <div class="recipe">
                <div class="recipe-image">
                    <img class="recipe_img_src" src="images/recipe3.png" align="right"/>
                    <div class="author-details">
                        <img class="userimage" src="images/avatar.jpg" align="left" /><span class="recipe-by">Recipe by Chef Laura Fu</span>
                    </div>
                </div>
                <div class="recipe-text">
                    <p>                    
                        Here's the recipe:<br /><br />
                        <span class="makes">Gnocchi with bacon and spinach carbonara style.</span><br /><br />
                        Serves 2<br /><br />
                        4 oz Bacon, diced<br />
                        3 cups Spinach (anything except baby)<br />
                        4 cloves Garlic, minced<br />
                        1/2 cup White Wine or vermouth<br />
                        1/2 cup Heavy Cream<br />
                        2 ea Egg Yolks<br />
                        Salt & pepper to taste<br />
                    </p>
                    <p>
                        Heat a heavy saute pan and add the bacon<br />
                        Cook till browned and cripsy<br />
                        Add the minced garlic and spinach, and saute till spinach wilts<br />
                        Add the White wine and reduce by half<br />
                        Add the heavy cream, and cook on high until sauce coats the back of a spoon, about 10 minutes<br />
                        Season to taste<br />
                        Temper the egg yolks with the hot sauce, and then gradually combine the yolk mixture and bacon spinach cream sauce<br />
                        Toss with freshly cooked gnocchi <br />
                    </p>
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
                <!-- Comments -->
                <div class="comments">
                <div class="notHighlightedDiv" id="cmHighlight">
                    <div class="code-opts">
                        <div class="code-links">
                            <a class="get-code" href="#" data-fn-name="comments">Get Code </a>|
                            <a class="docs" href="#"> Docs</a>
                        </div>
                    </div>
                    <h2 class="comments-title">Comments</h2>
                    <div id="commentsDiv" class="comments-div"></div> <!-- Comments Plugin DIV Container -->
                </div>
                </div>
            </div>
        </div>
<?php include_once('sidebar.php'); ?>
<?php include_once('footer.php'); ?>
