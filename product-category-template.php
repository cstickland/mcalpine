<?php
/* Template Name: Category Archive */
get_header();
global $post;
$blocks = parse_blocks($post->post_content);
?>

<main id="primary" class="site-main">

    <?php echo do_blocks('<!-- wp:mcalpine/small-hero {"name":"mcalpine/small-hero","data":{"title":"' . get_field('category_archive_title', 'option') . '","_title":"field_64ef3eb65a74d","message":"' . get_field('category_archive_hero_message', 'option') . '","_message":"field_64ef3ec25a74e","image":"' . get_field('category_hero_image', 'option') . '","_image":"field_64ef3ed55a74f","breadcrumb_middle_link":null,"_breadcrumb_middle_link":"field_64ef4f89decd4"},"mode":"edit"} /-->'); ?>
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();

            the_content();
        endwhile;
        the_posts_navigation();
    endif;
    ?>
    <section id="category-archive"></section>
</main><!-- #main -->
<script>
    const categoryArchive = document.getElementById('category-archive');
    categoryArchive.innerHTML = ''

    new CategoryArchive({
        target: categoryArchive,
        props: {
            archiveType: "categories",
            postsPerPage: 12,
        }
    })
</script>
<?php
get_footer();
