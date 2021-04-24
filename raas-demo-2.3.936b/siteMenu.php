    <div class="menu">
        <div class="menu-item menu-item-first">
            <a id = "Home" href="index.php" class="" tabindex="0">HOME</a>
        </div>
        <div class="menu-item">
            <a id = "Recipe1" href="recipe1.php" class="" tabindex="0">RECIPE OF THE DAY</a>
        </div>
        <div class="menu-item">

            <a id = "Recipe2" href="recipe2.php" class="" tabindex="0">OUR FAVORITE</a>
        </div>
        <div class="menu-item">
            <a id = "Recipe3" href="recipe3.php" class="" tabindex="0">MOST POPULAR</a>
        </div>
        <div class="menu-item menu-item-last">
            <a id = "About" href="about.php" class="" tabindex="0">ABOUT</a>
        </div>

        


    </div>
    <script> // This script toggles the link for the currently viewed page to be active in the menu bar
    pageName='';
    if (currentPage !=='invite-a-friend') {
        document.getElementById('Home').className = '';
        document.getElementById('Recipe1').className = '';
        document.getElementById('Recipe2').className = '';
        document.getElementById('Recipe3').className = '';
        document.getElementById('About').className = '';
        pageNameFull = document.title;
        pageNameSplit = pageNameFull.split(" ");
        pageName = pageNameSplit[6];
        document.getElementById(pageName).className = 'selected';
        document.getElementById(pageName).focus();
    }
    </script>
