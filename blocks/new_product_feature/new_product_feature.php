<?php

function new_feature_product_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'new_feature_product_block_init');
