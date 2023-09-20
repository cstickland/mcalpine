<script>
    import {
        open,
        searchOpen,
        version,
        openClassVersionTwo,
    } from "../stores.js";

    export let openClass;

    export let position;

    function openKeyPressedHamburger(e) {
        switch (e.key) {
            case "Enter":
                open.set(!$open);
                if (!$open) {
                    searchOpen.set(false);
                }
                break;
        }
    }
</script>

<div
    class="mobile-hamburger {openClass}"
    on:click={() => {
        if ($version == 1) {
            open.set(!$open);

            if (!$open) {
                searchOpen.set(false);
            }
        }
        if ($version == 2) {
            if ($searchOpen) {
                if (position == "controls") {
                    open.set(true);
                    searchOpen.set(false);
                    openClassVersionTwo.set("open");
                } else {
                    searchOpen.set(false);
                    open.set(false);
                    openClassVersionTwo.set("closed");
                }
                return;
            }

            if ($searchOpen == false) {
                open.set(!$open);

                if ($open) {
                    openClassVersionTwo.set("open");
                }
                if (!$open) {
                    openClassVersionTwo.set("closed");
                }
            }
        }
    }}
    on:keypress={() => {
        openKeyPressedHamburger();
    }}
>
    <div class="mobile-line first" />
    <div class="mobile-line second" />
</div>

<style lang="scss">
    @import "../variables.scss";

    .mobile-hamburger {
        display: flex;
        flex-direction: column;
        gap: 3.5px;
        cursor: pointer;

        .mobile-line {
            width: 1.5rem;
            height: 3px;
            background-color: $color__mcalpine-red;
            transform-origin: center;
            transition: all 0.2s ease-in-out;
        }

        &.open {
            .mobile-line {
                &.first {
                    transform: rotate(45deg) translateY(3px) translateX(2px);
                }
                &.second {
                    transform: rotate(-45deg) translateY(-3px) translateX(2px);
                }
            }
        }
    }
</style>
