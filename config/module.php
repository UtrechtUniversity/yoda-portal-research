<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
| -------------------------------------------------------------------
| Module Menu Configuration
| -------------------------------------------------------------------
|
| ****WARNING**** Do not edit this file. An update WILL override it.
| See instructions below for overriding these settings locally.
|
|
| This file specifies how the module should behave in the Irods Portal.
| This file is read by the Irods Portal after the module is imported. 
| This file should provide entries for an array named 'module'. The
| for entries this array should have are 'name', 'label', 'glyph' and
| 'menu_order'.
| 
| The name key defines the name of the module, such as it should appear
| in the menu. This name should also be the name of the directory the
| module is cloned in (provide a sample call to add-module.sh to ensure
| this is the case), and be referred to in the routing file of this
| module.
|
| The label key defines the label for this module, which will be used
| for the menu
|
| The glyph key defines the bootstrap glyph used for buttons referring 
| to this module, without the 'glyphicon glyphicon' part. So to use
| the icon 'glyphicon glyphicon-user' the value should just be 'user'
| 
| The menu_order key defines how important the module is. The lower 
| this number, the more to the left in the menu the module appears.
| The higher, the more to the right. Default is 50.
|
| For more informations, check the documentation for custom modules
| in the 'docs' directory of the Irods Portal
|
| -------------------------------------------------------------------
| Instructions for overriding
| -------------------------------------------------------------------
|
| To override these settings for your local configuration, do not
| change this file. The next update WILL override your settings. 
| Instead, create a new file, called "module_local.php" in the same
| directory as this file. This file should already be in the 
| .gitignore file
| 
| Start the file with the usual php opening tags (see first line of
| this file). 
| Then, for each of the four keys from the array below you wish to
| replace, copy the entire line to the "module_local.php" file and
| replace the value (and only the value). 
| This should override the value for that key.
| You do not have to override keys that you don't want to change,
| although this won't be harmful.
*/

$module['name'] 		= "projects";
$module['label'] 		= "Studies";
$module['glyph'] 		= "education";
$module['menu_order'] 	= 10;
$module['hide_menu']	= false;

if (file_exists(dirname(__FILE__) . '/module_local.php'))
	include(    dirname(__FILE__) . '/module_local.php');