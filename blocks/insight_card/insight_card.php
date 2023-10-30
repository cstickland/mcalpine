<?php

function insight_card_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'insight_card_block_init');
