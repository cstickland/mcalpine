<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "image": "<?php echo get_field('organisation_image', 'option'); ?>",
        "url": "<?php echo site_url(); ?>",
        "sameAs": [
            "<?php echo get_field('facebook', 'option'); ?>",
            "<?php echo get_field('twitter', 'option'); ?>",
            "<?php echo get_field('instagram', 'option'); ?>",
            "<?php echo get_field('linkedin', 'option'); ?>",
            "<?php echo get_field('youtube', 'option'); ?>"
        ],
        "logo": "<?php echo get_field('organisation_logo', 'option'); ?>",
        "name": "<?php echo get_field('organisation_name', 'option'); ?>",
        "description": "<?php echo get_field('organisation_description', 'option'); ?>",
        "email": "<?php echo get_field('organisation_email', 'option'); ?>",
        "telephone": "<?php echo get_field('organisation_phone_number', 'option'); ?>",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "<?php echo get_field('street_address', 'option'); ?>",
            "addressLocality": "<?php echo get_field('address_locality', 'option'); ?>",
            "addressCountry": "<?php echo get_field('address_country', 'option'); ?>",
            "addressRegion": "<?php echo get_field('address_region', 'option'); ?>",
            "postalCode": "<?php echo get_field('organisation_postcode', 'option'); ?>"
        },
        "vatID": "<?php echo get_field('vat_id', 'option'); ?>",
        "iso6523Code": "<?php echo get_field('iso6523code', 'option'); ?>"
    }
</script>
