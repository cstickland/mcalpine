<?php

function product_guide_cta_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'product_guide_cta_block_init');
