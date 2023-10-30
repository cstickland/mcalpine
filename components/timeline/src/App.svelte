<script>
    export let allSlides = [];
    import Timeline from './Timeline.svelte';
    import Slide from './Slide.svelte';



</script>

<section class="history-slider">
    <div class="slides">
        <ul class="slide-list">
            {#each allSlides as slide}
                <Slide {...slide} />
            {/each}
        </ul>
    </div>
    <Timeline />
</section>
