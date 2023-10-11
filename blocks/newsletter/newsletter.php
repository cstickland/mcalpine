<?php

function newsletter_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'newsletter_block_init');
