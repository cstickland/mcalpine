<?php

function create_block_hero_slider_init()
{
	register_block_type(__DIR__);
}
add_action('init', 'create_block_hero_slider_init', 5);

// function cwp_register_block_script()
// {
// 	wp_register_script('block-tip', get_template_directory_uri() . '/blocks/hero_slider/hero-slider.js', ['acf']);
// }
// add_action('init', 'cwp_register_block_script');
