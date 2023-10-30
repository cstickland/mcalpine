<script>
    export let timeline = [];
</script>

<div class="timeline-container">
    <ul>
        {#each timeline as time}
            <li>{time}</li>
        {/each}
    </ul>
</div>
