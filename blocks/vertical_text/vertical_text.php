<?php

function vertical_text_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'vertical_text_block_init');
