<?php

function product_download_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'product_download_block_init');
