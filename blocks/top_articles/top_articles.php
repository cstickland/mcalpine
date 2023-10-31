<?php

function top_articles_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'top_articles_block_init');
