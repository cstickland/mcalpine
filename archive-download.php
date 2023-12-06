<?php
get_header();
?>

<main id="primary" class="site-main">
    <?php echo do_blocks('<!-- wp:mcalpine/small-hero {"name":"mcalpine/small-hero","data":{"field_64ef3eb65a74d":"Register A Warranty","field_64ef3ec25a74e":"Find your product below and fill in the form to register your warranty","field_64ef3ed55a74f":"","field_64ef4f89decd4":{"title":"","url":"","target":""}},"mode":"preview"} /-->'); ?>
    <?php

    while (have_posts()) :
        the_post();
    endwhile; // End of the loop.
    ?>
    <section id="download-archive"></section>
</main>
<script>
    const downloadArchive = document.getElementById('download-archive');
    downloadArchive.innerHTML = ''

    new DownloadArchive({
        target: downloadArchive,
        props: {
            archiveType: "downloads",
            postsPerPage: 12,
        }
    })
</script>

<?php
get_footer();
