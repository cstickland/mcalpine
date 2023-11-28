<?php

function large_hero_category_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'large_hero_category_block_init');
