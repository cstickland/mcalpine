<?php
$skus = [];
$id = get_the_ID();

if (have_rows('skus', $id)) :
    while (have_rows('skus', $id)) : the_row();
        $skus[] = get_sub_field('sku');
    endwhile;
endif;
?>


<div <?php echo get_block_wrapper_attributes(['class' => 'specifications-block animate ' . get_field('background_color')]); ?> id="suitability">
    <h2>Specifications</h2>

    <table>
        <tr>
            <th>SKU</th>
        </tr>
        <?php foreach ($skus as $sku) { ?>
            <tr>
                <td><?php echo $sku; ?></td>
            </tr>
        <?php } ?>
    </table>
</div>
