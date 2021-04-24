    </div>
</div>
<div class="endFooter">
<?php
    // Sets the plugin script for each page that they will appear on
            $plugInfo ='';
            $plugInfo0="";
            $plugInfo1="
                <script type=\"text/javascript\">
                gigyaPlugins.shareBar(\"shareButtons\");
                gigyaPlugins.reactionsBar(\"reactionsDiv\", \"recipe1\");
                gigyaPlugins.comments(\"commentsDiv\", \"23137007\", \"recipe1\");
                </script>
                ";
            $plugInfo2="
                <script type=\"text/javascript\">
                gigyaPlugins.shareBar(\"shareButtons\");
                gigyaPlugins.reactionsBar(\"reactionsDiv\", \"recipe2\");
                gigyaPlugins.comments(\"commentsDiv\", \"23137007\", \"recipe2\");
                </script>
                ";
            $plugInfo3="
                <script type=\"text/javascript\">
                gigyaPlugins.shareBar(\"shareButtons\");
                gigyaPlugins.reactionsBar(\"reactionsDiv\", \"recipe3\");
                gigyaPlugins.comments(\"commentsDiv\", \"23137007\", \"recipe3\");
                </script>
                ";
            $plugInfo4="
                <script type=\"text/javascript\">
                gigyaPlugins.shareBar(\"shareButtons\");
                gigyaPlugins.reactionsBar(\"reactionsDiv\", \"recipe1\", \"about\");
                gigyaPlugins.comments(\"commentsDiv\", \"recipes\", \"recipe1\");
                </script>
                ";                  
            if ($lpage == 'home') {
                $plugInfo = $plugInfo0;
            }
            else if ($lpage == 'recipe1') {
                $plugInfo = $plugInfo1;
            }
            else if ($lpage == 'recipe2') {
                $plugInfo = $plugInfo2;
            }
            else if ($lpage == 'recipe3') {
                $plugInfo = $plugInfo3;
            }
            else if ($lpage == 'about') {
                $plugInfo = $plugInfo4;
            }
            else {
                $plugInfo = $plugInfo0;
            }
        echo $plugInfo; 
?>
    <a class="site" href="http://www.gigya.com" target="_blank">&copy;2006-2016 GIGYA INC.</a>
       
    <div class="bottomLinks">
        <a class="about" href="about.php">ABOUT</a><a class="docs" href="http://developers.gigya.com/" target="_blank">GIGYA
        DOCUMENTATION</a>
    </div>
    </div><!-- closes .inner_wrap -->
</div><!-- closes .wrap -->
    <div class="ui-helper-clearfix"></div>
</div>
<div class="ui-helper-clearfix"></div>
</body>
</html>
