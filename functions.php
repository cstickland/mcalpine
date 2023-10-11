<?php

require_once('inc/ajax-search.php');
require_once('blocks/acf-blocks.php');
require_once('inc/custom-field-search.php');
require_once('inc/graphql-setup.php');
require_once('inc/acf-setup.php');
require_once('inc/theme-setup.php');
require_once('inc/wpai-setup.php');


// help prevent cross site scripting by setting X-frame-options to SAMEORIGIN
add_action('send_headers', 'send_frame_options_header', 10, 0);


add_filter('gform_submit_button', 'add_custom_css_classes', 10, 2);
function add_custom_css_classes($button, $form)
{
    $dom = new DOMDocument();
    $dom->loadHTML('<?xml encoding="utf-8" ?>' . $button);
    $input = $dom->getElementsByTagName('input')->item(0);
    $classes = $input->getAttribute('class');
    $classes .= " btn btn-black btn-arrow";
    $input->setAttribute('class', $classes);
    return $dom->saveHtml($input);
}
