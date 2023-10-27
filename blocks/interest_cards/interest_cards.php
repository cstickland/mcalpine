<?php

function interest_card_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'interest_card_block_init');
