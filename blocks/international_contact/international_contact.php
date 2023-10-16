<?php

function international_contact_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'international_contact_block_init');
