<?php

function mcalpine_kneepads_register_menus() {
    register_nav_menus(array(
        'main-menu' => esc_html__('Main Menu', 'McAlpine Kneepads'),
        'social' => esc_html__('Social', 'McAlpine Kneepads')
    ));
}
add_action('init', 'mcalpine_kneepads_register_menus')

?>