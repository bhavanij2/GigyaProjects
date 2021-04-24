<div class="loginBar">
  <div class="notHighlightedDiv" id="loginBarHighlight">
  </div>
	<div class="code-opts">
		<div class="code-links">
			<a class="get-code" href="#" data-fn-name="login">Get Code </a>|
			<a class="docs" href="#"> Docs</a>
		</div>
	</div>
	<!-- The bar when the user is not logged-in (initial state) -->
	<div id="div_notLoggedIn" class="logged-out">
	
		<div class="loginBar-item hello">Hello Guest!</div>
		<div class="actions">
			<div class="loginBar-item login">
				<a href="#"  tabindex="6">Login</a>
			</div>
			<div class="loginBar-item register">
				<a href="#" tabindex="7">Register</a>
			</div>
			<div class="ui-helper-clearfix"></div>
		</div>

	</div>
	<div id="div_LoggedIn" class="logged-in">
		<div class="loginBar-item loginBar-image">
			<img class="userimage" src="images/avatar_48x48.gif" />
		</div>
		<div class="login-text loginBar-item ">
			<div class="user-name raas-sprite profile-arrowdown"></div>
			<div class="user-actions raas-sprite profile-dropdown hidden">
				<a href="#" class="edit-profile">Edit Profile</a>
				<a href="#" class="logout" onclick="gigya.socialize.logout();">Log out</a>
			</div>
		</div>
	</div>
</div>

