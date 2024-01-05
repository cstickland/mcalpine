

<button
    type="submit"
    id="search-submit"
    class="search-submit submit-btn"
    value="view all results"
    on:click={(e) => {}}
>
    <div class="result-count"></div>

        <div class="view-all-text">{@html "View All Results"}</div>
    <div class="view-all">
        <div class="view-all-chevron">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13.922"
                height="16.245"
                viewBox="0 0 13.922 16.245"
                ><path
                    d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z"
                    fill="#fff"
                /></svg
            >
        </div>
    </div>
</button>

<style lang="scss">
    .search-submit {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        bottom: 0;
        width: 100%;
        height: 60px;
        text-align: start;
        background-color: #ffffff;
        outline: 0;
        color: #5a5a5a;
        height: 60px;
        padding: 0;
        padding-left: 35px;
        border: 0;
        background-size: 200% 100%;
        background-image: linear-gradient(90deg, white 50%, #222222 50%);
        border-top: solid 1px #f4f4f4;
        cursor: pointer;
        text-transform: capitalize;
        transition: background-position 0.3s ease-in-out;

        &:hover {
            background-position: 100% 0;

            .result-count {
                color: #ffffff;
            }

            .view-all-text {
                color: #ffffff;
            }
        }

        .result-count {
            font-size: 1rem;
            line-height: 1.125rem;
            letter-spacing: 0;
        }

        .view-all {
            color: #222222;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1.75rem;

            .view-all-chevron {
                background-color: #222222;
                height: 100%;
                aspect-ratio: 1;
                display:flex;
                align-items: center;
                justify-content: center;
  
                svg {
                width:2.5rem;
                    fill: #ffffff;
                }
            }
        }
    }
</style>
