To enable the RaaS Demo Site to function on your server,
it is important to follow the instructions below:

1. Edit the config.php file and input your API Key and
Secret in the corresponding sections.

2. Edit the js/gigyaPlugins.js file Line 1 siteScreenSet
variable to refelct the prefix of a current screen-set
collection available to your API key.

3. Edit the customize.php file Line 3 $siteScreenSet variable
to reflect the same name you used above in step 2.

4. Edit the customize_processor.php file Line 6 $siteScreenSet
variable to reflect the same name you used above in steps 2
and 3.

NOTES:
Steps 3 and 4 are not necessary if you disable the Gigya
Add-ons Viewer and Editor (customize.php plugin), See below
for instructions.

To enable or disable the Gigya Add-ons Viewer and Editor
(customize.php Plugin) comment/uncomment the line in the
header.php file that includes the plugin (Line 130).

For documentation relating to the RaaS Demo Site please see:
http://developers.gigya.com/display/GD/RaaS+-+Demo+Site

For documentation relating to the customize plugin please see: 
http://developers.gigya.com/display/GD/Gigya+Add-ons+Viewer
