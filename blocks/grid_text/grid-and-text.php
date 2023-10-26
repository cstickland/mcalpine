<?php

function grid_text_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'grid_text_block_init');
