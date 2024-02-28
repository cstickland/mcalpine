<?php

get_header();

// $search_term = get_search_query(true);
// $query = '
// {
//   posts(where: {search: "' . $search_term . '"}, first: 1000) {
//     edges {
//       node {
//         link
//         title
//         featuredImage {
//           node {
//             sourceUrl(size: MEDIUM)
//             altText
//           }
//         }
//         terms {
//           nodes {
//             name
//           }
//         }
//         postId
//       }
//     }
//   }
//   productCategories(where: {search: "' . $search_term . '"}, first: 1000) {
//     edges {
//       node {
//         name
//         products(first: 100) {
//           nodes {
//             customFields2 {
//               skus {
//                 sku
//                 productImages {
//                   productImage {
//                     mediaItemUrl
//                   }
//                 }
//               }
//             }
//             link
//             title
//             terms {
//               nodes {
//                 name
//               }
//             }
//           }
//         }
//       }
//     }
//   }
//   products(where: {search: "' . $search_term . '"}, first: 1000) {
//     nodes {
//       customFields2 {
//         skus {
//           sku
//           productImages {
//             productImage {
//               mediaItemUrl
//             }
//           }
//         }
//       }
//       link
//       title
//       terms {
//         nodes {
//           name
//         }
//       }
//     }
//   }
//   pages(where: {search: "' . $search_term . '"}, first: 100) {
//     edges {
//       node {
//         title
//         link
//         featuredImage {
//           node {
//             sourceUrl(size: MEDIUM)
//           }
//         }
//       }
//     }
//   }
// }';
//
// $results = graphql(['query' =>  $query]);
?>

<main id="primary" class="site-main">
    <div id="search-archive"></div>
</main>

<script>
    const archiveItems = document.getElementById('search-archive');
    archiveItems.innerHTML = ''
    new SearchArchive({
        target: archiveItems,
        props: {
            searchTerm: "<?php echo get_search_query(true); ?>",
            postsPerPage: <?php echo get_field('posts_per_page', 'option'); ?>
        }
    })
</script>
<?php
get_footer();
