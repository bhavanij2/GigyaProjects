<?php
$page = 'Recipe1';
require_once('header.php');
?>
<!--  Body cont. -->
            <div class="caption recipe-caption">
                <div class="recipe-title"><h1>GATEAU A LA ROYALE</h1><span class="recipe-date">JUNE 18, 2013</span></div>
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
                    <img class="recipe_img_src" src="images/recipe1.png" align="right" />
                    <div class="author-details">
                        <img class="userimage" src="images/avatar.jpg" align="left" /><span class="recipe-by">Recipe by Chef Laura Fu</span>
                    </div>
                </div>
                <div class="recipe-text">
                    <p>  
                        Jumping on the Royal Wedding bandwagon, I was tasked with making the Royal Wedding fridge cake for a tea party. Having lived in England for a brief period of time, I am ashamed to say that I had no idea what the cake was supposed to be like; texture, taste etc. Online research also did not indicate whether it was supposed to be extra sweet, crunchy, etc.<br /><br />
                        So, I winged it, envisioning a chewy fudge with a slightly crunchy inside, the sweetness coming more from raisins. Some of the recipes called for nuts, but I omitted them since I'm not particularly a fan. <br /><br />
                        Enjoy!
                        <br /><br />Here's the recipe:<br /><br />
                        <span class="makes">Gateau a la Royale</span><br />
                        Makes 1 Cake<br /><br />
                        Line an 8" square pan with cling wrap.<br />
                        Soak the raisins in hot water for about 20 minutes, then drain the liquid off. <br />
                        Place the biscuits in a large gallon zip lock bag, seal it, and bash it with a rolling pin, leaving some quarter sized pieces (do this step manually, and don't use a food processor). <br /><br />
                        Combine the condensed milk, cream and corn syrup in a saucepan and bring to a boil.<br />
                        Chop the butter up into smaller pieces and place it in a bowl with the chocolate chips.<br />
                        Pour the hot cream mixture over the chocolate, and stir until well combined.<br />
                        Leave the chocolate mixture to cool until room temperature.<br />
                        Combine the crushed biscuits, raisins and chocolate mixture until everything is well coated with chocolate.<br /><br />
                        Pour in the pan, level the top and freeze for about 2-3 hours, or until firm.<br />
                        Slice with a sharp knife to serve.<br />
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
        <script>
        _gaq.push(['_trackPageview', '/t3']);
        </script>
<?php include_once('sidebar.php'); ?>
<?php include_once('footer.php'); ?>
