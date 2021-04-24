<?php
$page = 'Recipe2';
require_once('header.php'); 
?>
<!--  Body cont. -->
            <div class="caption recipe-caption">
                <div class="recipe-title"><h1>MUSHROOM MYSTIQUE</h1><span class="recipe-date">JUNE 18, 2013</span></div>
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
                    <img class="recipe_img_src" src="images/recipe2.png" align="right"/>
                    <div class="author-details">
                        <img class="userimage" src="images/avatar.jpg" align="left" /><span class="recipe-by">Recipe by Chef Laura Fu</span>
                    </div>
                </div>
                <div class="recipe-text">
                    <p>
                        I absolutely love mushrooms, and think that one of the simplest, most luxurious food that you can have is creamy mushroom soup!<br /><br />
                        Traditionally, as with most other foods, cooking a great mushroom soup requires time, patience, and multiple steps. However, there are times when the luxury of time or patience cannot be afforded, as with a small dinner party on a workday evening. At times like those, it is necessary to take shortcuts, <br />while still producing the best possible result that I would not be ashamed to serve on the table. Although I had to work quickly, it paid off, and we had mushroom soup on the table in 30 minutes!<br /><br />
                        Here's the recipe:<br /><br />
                        <span class="makes">Creamy Mushroom Soup</span><br /><br />
                        1 lb Fresh Mushrooms, I like to use Crimini & Shitake for best flavor<br />
                        2 ea Garlic Cloves, Smashed<br />
                        2 sprigs Thyme<br />
                        1/4 cup White Wine<br />
                        2 cups Chicken Stock, or Veggie<br />
                        2 cups Half & Half<br />
                        3 Tbs Butter<br />
                        Salt & pepper to taste<br />
                    </p>
                    <p>
                        In a heavy saucepan, melt one Tbs of butter<br />
                        Add 1/3 of the mushrooms, one garlic clove, and 1 sprig thyme<br />
                        Saute mushrooms until a deep brown, and cooked through<br />
                        Repeat with the remaining 2 batches of mushrooms<br />
                        Deglaze the pan with the white wine - that means adding the liquid and scraping up the brown bits over heat<br />
                        Bring the pan juices, stock and mushrooms to a boil<br />
                        Simmer for about 10 minutes<br />
                        Puree the mushroom soup and add the half & half<br />
                        Thin with water to desired consistency, then season with salt & pepper <br />
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
