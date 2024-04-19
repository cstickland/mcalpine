<?php

function product_highlights_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'product_highlights_block_init');
