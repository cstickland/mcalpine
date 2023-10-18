<?php

function faq_contact_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'faq_contact_block_init');
