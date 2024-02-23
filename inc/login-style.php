<?php

function wpb_login_logo()
{

    wp_enqueue_style('login-form', get_template_directory_uri() . "/login-style.css", array(),);
}
add_action('login_enqueue_scripts', 'wpb_login_logo');
