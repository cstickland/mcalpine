<?php

function video_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'video_block_init');
