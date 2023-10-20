<?php

function faq_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'faq_block_init');
