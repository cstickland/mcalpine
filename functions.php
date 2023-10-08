<?php

require_once('inc/ajax-search.php');
require_once('blocks/acf-blocks.php');
require_once('inc/custom-field-search.php');
require_once('inc/graphql-setup.php');
require_once('inc/acf-setup.php');
require_once('inc/theme-setup.php');
require_once('inc/wpai-setup.php');


// help prevent cross site scripting by setting X-frame-options to SAMEORIGIN
// add_action('send_headers', 'send_frame_options_header', 10, 0);
