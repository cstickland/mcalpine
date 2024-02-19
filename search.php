<?php

get_header();

?>

<main id="primary" class="site-main">
    <!-- <?php echo do_blocks('<!-- wp:mcalpine/search-hero -->'); ?> -->
    <div id="search-archive"></div>
</main>

<script>
    const archiveItems = document.getElementById('search-archive');
    archiveItems.innerHTML = ''
    new SearchArchive({
        target: archiveItems,
        props: {
            searchTerm: "<?php echo get_search_query(true); ?>"
        }
    })
</script>
<?php
get_footer();
