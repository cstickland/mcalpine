<div <?php echo get_block_wrapper_attributes(['class' => 'faq']); ?>" id="faq">
</div>

<?php
$faq_category_order = get_field('faq_category_order', 'option');
$faq_category_order_names = array();
foreach ($faq_category_order as $category) {
    $faq_category_order_names[] = $category->name;
}
?>

<script async>
    const faq = document.getElementById('faq');
    faq.innerHTML = ''

    new FaqArchive({
        target: faq,
        props: {
            categories: <?php echo json_encode($faq_category_order_names); ?>
        }
    })
</script>
