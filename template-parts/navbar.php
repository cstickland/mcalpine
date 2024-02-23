<header>
    <nav class="main-nav <?php if (!is_archive()) {
                                echo get_field('navbar_color');
                            } ?>">
        <section class="desktop-menu container">
            <div class="nav-content">
                <?php get_template_part("/template-parts/search-form") ?>
                <div class="nav-container">
                    <div class="nav-links">
                        <div class="desktop-mega-menu" id="desktop-mega-menu">Products</div>
                        <?php wp_nav_menu(array('theme_location' => 'navbar')) ?>
                    </div>
                </div>
            </div>
        </section>
        <section class="mobile-menu" id='mobile-menu'>
        </section>
    </nav>
</header>
