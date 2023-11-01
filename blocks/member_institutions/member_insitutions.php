<?php

function member_institutions_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'member_institutions_block_init');
