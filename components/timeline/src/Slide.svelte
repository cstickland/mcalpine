<script>
    export let title = '';
    export let text = '';
    export let image = [];
    export let date = '';

    export let active = false;

</script>

<li class="history-slide {active ? 'active' : ''}">
    <div class="slide-content">
        <div class="image-container">
            <div class="image-hash"></div>
            <h2>{date}</h2>
            <img src={image.url} alt={image.alt} />
        </div>
        <div class="slide-text-container">
            <div class="red-color-block"></div>
            <h2>{title}</h2>
            <div>{@html text}</div>
        </div>
    </div>
    <div class="dividing-red-block"></div>
    <div class="dividing-hash"></div>
</li>

<style lang="scss">
    .history-slide {
        &.active {
            background: transparent linear-gradient(194deg, #7CAEF2 0%, #7CAEF200 100%) 0% 0% no-repeat padding-box;
        }
    }
</style>
