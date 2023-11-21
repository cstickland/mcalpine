<?php

function product_suitability_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'product_suitability_block_init');
