<?php
$skus = [];
$id = get_the_ID();
$specifications = [];

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

if (have_rows('skus', $id)) :
    while (have_rows('skus', $id)) : the_row();
        $sku = new Sku();
        $sku->name = get_sub_field('sku');
        $sku->specifications = [];

        if (have_rows('specifications')) :
            while (have_rows('specifications')) : the_row();
                $current_specification = new Specification();
                $current_specification->label = get_sub_field('specification_label');
                $current_specification->value = get_sub_field('specification_value');
                $sku->specifications[] = $current_specification;
                $specifications[] = $current_specification->label;
            endwhile;
        endif;
        $skus[] = $sku;
    endwhile;
endif;

$specifications = array_unique($specifications);
?>


<div <?php echo get_block_wrapper_attributes(['class' => 'specifications-block animate ' . get_field('background_color')]); ?> id="suitability">
    <h2>Specifications</h2>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>SKU</th>
                    <?php foreach ($specifications as $specification) { ?>
                        <th><?php echo $specification; ?></th>
                    <?php } ?>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($skus as $sku) { ?>
                    <tr>
                        <td><?php echo $sku->name; ?></td>
                        <?php
                        foreach ($specifications as $specification) {
                            $text = "-";
                            foreach ($sku->specifications as $sku_specification) {
                                if ($sku_specification->label == $specification) {
                                    $text = $sku_specification->value;
                                }
                            } ?>
                            <td><?php echo $text; ?></td>
                        <?php } ?>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
    </div>
</div>
