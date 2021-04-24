<div class="apiModChoices" id="apiModChoices">
    <div class="selection_area_api">
      <form action="#" method="post">
       <?php 
      if ($currentApiKey == $key) {
	      $apiKeyDefault = ' (<span style="color: red;"><br />default-Raas-Demo</span>)<br />';
      } else {
	      $apiKeyDefault='';
      }
      echo 'The current API Key entered is:<br /><input type="text" id="newApiKeyBox" name="newApiKeyBox" style="background-color: lightgrey;" value="' .$currentApiKey . '" readonly="" />';
      echo $currentMessage ?><br /><br />
      Enter A New API Key <span class="helpNote" title="Enter your API Key in the field and press the 'Change Active API Key' button. WARNING: This will enable you to see basic add-ons as they will appear on your site. You will not be able to login via this method (using your api key on the raas-demo website), as Gigya checks the API Key against the referring domain that is registered within your Gigya Console. Some widgets will break when they are not configured identically or at all to the same configuration as the raas-demo site. If you run into problems at any time, use the 'Revert to the Raas-Demo default API Key' checkbox.">?</span> :<br />
      <input type="text" value="" name="thisApiKey" id="thisApiKey" />
      <br />
      <span class="or">- or -</span>
      <br />
            <div class="revertApiDiv" id="revertApiDiv">
              <div class="revertCheckbox" id="revertCheckbox">
               <input type="checkbox" class="" title="To change the Raas-Demo site back to it's default API Key, check this box while leaving the field above empty, and press the 'Change Active API Key' button." value = '1' name="deleteApiKey" id="deleteApiKey" />
               <div class="revertText" id="revertText">&nbsp;&nbsp;Revert to the Raas-Demo default API Key? (You will be logged out).<br /><br /></div>
              </div>
            </div>
            
       <div class="runButtonDiv">
       <br /><br /> <input type="submit" id="run_api" value="Change Active API Key" class="runButton" /><br /><br />
      </div>
    <br />
     <br /><br />
      <script>
        
            var loValue = document.getElementById('SessionIsDestroyed').value;
            if (loValue !='undefined' && (loValue=="1")) {
              gigyaPlugins.logout();
              gigyaPlugins.logoutHandler();
            }
        
      </script>
      </form>
   </div> 
</div>
