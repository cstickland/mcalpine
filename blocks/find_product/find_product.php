<?php

function find_product_block_init()

{
    register_block_type(__DIR__);
}
add_action('init', 'find_product_block_init');
