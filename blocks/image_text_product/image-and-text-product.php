<?php

function image_text_product_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'image_text_product_block_init');
