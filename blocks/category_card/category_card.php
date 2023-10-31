<?php

function category_card_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'category_card_block_init');
