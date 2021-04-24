<div class="mobileMenuWrapper" id="mobileMenuWrapper">
  <div class="mobileMenuContent" id="mobileMenuContent">
    <div class="mobileMenuHome" id="mobileMenuHome">
      <a class="" id="Home-Mobile" href="index.php">Home</a>
    </div>
    <div class="mobileMenuRecipe1" id="mobileMenuRecipe1">
      <a class="" id="Recipe1-Mobile" href="recipe1.php">Recipe Of The Day</a>
    </div>
    <div class="mobileMenuRecipe2" id="mobileMenuRecipe2">
      <a class="" id="Recipe2-Mobile" href="recipe2.php">Our Favorite</a>
    </div>
    <div class="mobileMenuRecipe3" id="mobileMenuRecipe3">
      <a class="" id="Recipe3-Mobile" href="recipe3.php">Most Popular</a>
    </div>
    <div class="mobileMenuAbout" id="mobileMenuAbout">
      <a class="" id="About-Mobile" href="about.php">About</a>
    </div>
  </div>
</div>
<script>  // This script toggles the link for the currenlty viewed page to be active in the menu bar
    pageName='';
    if (currentPage !=='invite-a-friend') {
        document.getElementById('Home-Mobile').className = '';
        document.getElementById('Recipe1-Mobile').className = '';
        document.getElementById('Recipe2-Mobile').className = '';
        document.getElementById('Recipe3-Mobile').className = '';
        document.getElementById('About-Mobile').className = '';
        pageNameFull = document.title;
        pageNameSplit = pageNameFull.split(" ");
        pageName = pageNameSplit[6] + "-Mobile";
        document.getElementById(pageName).className = 'selectedMobile';
    }
        // mobilemenu stuff
        function showMobileMenu() {
          if (document.getElementById('mobileMenuWrapper').style.display == 'block') {
            document.getElementById('mobileMenuWrapper').style.display = 'none';
          }
          else {
            document.getElementById('mobileMenuWrapper').style.display = 'block';
          } 
        }
    </script>
