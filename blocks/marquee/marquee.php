<?php

function marquee_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'marquee_block_init');
