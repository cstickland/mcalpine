<?php

function post_hero_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'post_hero_block_init');
