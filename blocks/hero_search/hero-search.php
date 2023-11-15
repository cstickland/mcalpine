<?php

function search_hero_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'search_hero_block_init');
