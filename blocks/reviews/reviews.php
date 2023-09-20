<?php

function create_reviews_block_init()

{
    register_block_type(__DIR__);
}
add_action('init', 'create_reviews_block_init');
