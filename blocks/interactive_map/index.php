<?php

function interactive_map_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'interactive_map_block_init');
