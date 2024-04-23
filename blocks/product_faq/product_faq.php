<?php

function product_faq_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'product_faq_block_init');
