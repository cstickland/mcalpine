<div <?php echo get_block_wrapper_attributes(['class' => 'interactive-map-block']); ?> id="interactive-map">

    <!-- Start Stockist.co widget -->
    <stockist-store-locator data-stockist-widget-tag="u7092">
        Loading store locator from <a href="https://stockist.co">Stockist store locator</a>...
    </stockist-store-locator>
    <script async src="https://stockist.co/embed/v1/widget.min.js"></script>
    <!-- End Stockist.co widget -->

</div>

<style>
    #map .h1 {
        color: blue;
        font-size: 100px;
    }

    .map-search {
        display: none;
    }

    .acf-map {
        display: none;
    }

    .small-hero-content {
        padding-bottom: 3rem;
    }
</style>
