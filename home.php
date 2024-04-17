<?php

// wordpress uses this as the archive page for "posts"
class Insight
{
    public $identifier;
    public $title;
    public $permalink;
    public $id;
    public $img;
    public $alt;
    public $columnWidth;
}

$insights = [];
get_header();

$graphql = graphql([
    'query' => 'query initialInsightQuery($faqCategories: [String] = null, $categories: [String] = null, $relation: String = "OR") {
  contentNodes(
    where: {contentTypes: [POST, FAQ], faqCategories: $faqCategories, categories: $categories, relation: $relation}
    first: 48
    after: ""
  ) {
    nodes {
      ... on Post {
        id
        featuredImage {
          node {
            altText
            sourceUrl(size: MEDIUM)
          }
        }
        link
        title
        categories(where: {parent: 0}) {
          nodes {
            name
          }
        }
      }
      ... on Faq {
        databaseId
        contentTypeName
        link
        title
        featuredImage {
          node {
            altText
            sourceUrl(size: MEDIUM)
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
  categories(where: {hideEmpty: true, parent: 0}, first: 100) {
    nodes {
      name
      slug
      taxonomyName
    }
  }
  faqCategories(first: 100, where: {hideEmpty: true, parent: 0}) {
    nodes {
      name
      slug
      taxonomyName
    }
  }
}'
]);

$items = $graphql['data']['contentNodes']['nodes'];
$endCursor = $graphql['data']['contentNodes']['pageInfo']['endCursor'];
$hasNextPage = $graphql['data']['contentNodes']['pageInfo']['hasNextPage'];
$categories = array(...$graphql['data']['categories']['nodes'], ...$graphql['data']['faqCategories']['nodes']);
?>

<main id="primary" class="site-main">
    <?php echo do_blocks('<!-- wp:mcalpine/featured-insight-hero {"name":"mcalpine/featured-insight-hero","mode":"preview"} /-->'); ?>
    <ul id="insight-archive" class="insight-archive-container">
    </ul>
</main><!-- #main -->

<script>
    const insightArchiveContainer = document.getElementById('insight-archive');
    const allInsights = <?php echo json_encode($items); ?>;
    insightArchiveContainer.innerHTML = '';
    new InsightArchive({
        target: insightArchiveContainer,
        props: {
            allItems: allInsights,
            hasNextPage: <?php echo $hasNextPage ? 'true' : 'false'; ?>,
            endCursor: "<?php echo $endCursor; ?>",
            categories: <?php echo json_encode($categories); ?>
        },
    })
</script>
<?php
get_footer();
