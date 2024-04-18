<?php

$faq_posts = get_posts([
    'post_type' => 'faq',
    'post_status' => 'publish',
    'numberposts' => -1
]);
?>

<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [<?php $i = 0;
                        foreach ($faq_posts as $faq) { ?> {
                    "@type": "Question",
                    "name": "<?php echo $faq->post_title; ?>",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "<?php echo strip_tags(get_field('answer', $faq->ID)); ?>"
                    }
                }
                <?php if ($i < count($faq_posts) - 1) { ?>, <?php } ?>
            <?php $i++;
                        } ?>
        ]
    }
</script>
