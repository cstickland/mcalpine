<?php

function timeline_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'timeline_block_init');
