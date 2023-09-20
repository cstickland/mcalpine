<script>
    import fade from 'svelte/transition';
    export let slides = [];

    let currentSlide = 1;

    function changeSlide(number) {
        if (number == -1) {
            if (currentSlide > 1) {
                currentSlide = currentSlide + number;
                return;
            }
            currentSlide = slides.length;
        }

        if (number == 1) {
            if (currentSlide < slides.length) {
                currentSlide = currentSlide + number;
                return;
            }
            currentSlide = 1;
        }
    }
</script>

<section class="category-slider">
    <div class="category-slide-container">
        {#each slides as slide, i}
            {#if i === currentSlide}
                <img
                    in:fade={{delay: 200, duration: 200}}
                    out:fade={{duration: 200}}
                    class="category-slide" 
                    src={slide} 
                    alt="slide" 
                />
            {/if}
        {/each}
    </div>
    <div class="category-slider-buttons">
        <button on:click={changeSlide(-1)}>-</button>
        <button on:click={changeSlide(1)}>+</button>
    </div>
</section>
