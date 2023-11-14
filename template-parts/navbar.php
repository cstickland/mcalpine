<header>
    <nav class="main-nav <?php the_field('navbar_color'); ?>">
        <section class="desktop-menu container">
            <div class="nav-content">
                <div>
                    <a href='<?php echo site_url(); ?>' class='site-logo'>
                        <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 699.73 114.15">
                            <defs>
                                <style>
                                    .cls-1 {
                                        fill: #e63228;
                                        stroke-width: 0px;
                                    }
                                </style>
                            </defs>
                            <g id="Layer_1-2">
                                <g id="McAlpine_Logo_-_New">
                                    <rect class="cls-1" x="465.55" width="36.42" height="114.15" />
                                    <polygon class="cls-1" points="662.08 71.55 687.57 71.55 699.12 42.6 662.08 42.6 662.08 28.95 688.17 28.95 699.73 0 662.08 0 636.51 0 625.66 0 625.66 114.15 636.51 114.15 662.08 114.15 688.17 114.15 699.73 85.2 662.08 85.2 662.08 71.55" />
                                    <polygon class="cls-1" points="346.9 0 310.48 0 310.48 114.15 328.69 114.15 346.9 114.15 362.39 114.15 373.94 82.9 346.9 82.9 346.9 0" />
                                    <polygon class="cls-1" points="576.94 47.83 550.68 0 514.26 0 514.26 114.15 550.68 114.15 550.68 66.32 576.94 114.15 613.36 114.15 613.36 0 576.94 0 576.94 47.83" />
                                    <path class="cls-1" d="m435.72,0h-54.1v114.15h36.42v-28.71h17.69c10.15,0,18.38-8.23,18.38-18.38V18.38c0-10.15-8.23-18.38-18.38-18.38Zm-8.26,48.73c0,4.3-3.36,8.35-9.42,8.35v-31.16c4.71,0,9.42,3.26,9.42,7.96v14.85Z" />
                                    <path class="cls-1" d="m257.76,0h-36.42l-16.6,114.15h36.42l2.04-14.06h18.12l2.04,14.06h36.42L283.18,0h-25.43Zm-11.81,81.19l6.31-43.39,6.31,43.39h-12.62Z" />
                                    <polygon class="cls-1" points="125.83 0 108.15 0 89.42 0 80.58 60.76 71.75 0 53.02 0 35.33 0 16.6 0 0 114.15 36.42 114.15 44.17 60.81 51.93 114.15 72.82 114.15 88.35 114.15 109.24 114.15 116.99 60.81 124.75 114.15 161.17 114.15 144.57 0 125.83 0" />
                                    <path class="cls-1" d="m161.31,17.91h0v33.7h0c0,9.89,8.02,17.91,17.91,17.91h23.01v-17.91h-3.9c-5.37,0-9.72-4.35-9.72-9.72v-14.26c0-5.37,4.35-9.72,9.72-9.72h3.9V0h-23.01c-9.89,0-17.91,8.02-17.91,17.91Z" />
                                </g>
                            </g>
                        </svg>
                    </a>
                </div>
                <div class="nav-container">
                    <div></div>
                    <?php get_template_part("/template-parts/search-form") ?>
                    <div class="nav-links">
                        <div class="desktop-mega-menu" id="desktop-mega-menu">Products</div>
                        <?php wp_nav_menu(array('theme_location' => 'navbar')) ?>
                    </div>
                </div>
                <div></div>
            </div>

        </section>
        <section class="mobile-menu" id='mobile-menu'>
        </section>
    </nav>
</header>
