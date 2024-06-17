<?php

function product_specifications_block_init()
{
    register_block_type(__DIR__);
}
add_action('init', 'product_specifications_block_init');

class Sku
{
    public $name;
    public $specifications;
}



class Specification
{
    public $label;
    public $value;
}
