<?php

function product_specifications_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'product_specifications_block_init');

if (!class_exists('Sku')) {
    class Sku
    {
        public $name;
        public $specifications;
    }
}


if (!class_exists('Specification')) {
    class Specification
    {
        public $label;
        public $value;
    }
}
