<div <?php echo get_block_wrapper_attributes(['class' => 'faq']); ?>" id="faq">
</div>

<script async>
    const faq = document.getElementById('faq');
    faq.innerHTML = ''

    new FaqArchive({
        target: faq,
    })
</script>
