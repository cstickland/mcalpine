<div <?php echo get_block_wrapper_attributes(['class' => 'contact']); ?>">

    <div class="contact-text">
        <h2><?php the_field('contact_block_title', 'option'); ?></h2>
        <p><?php the_field('contact_text_paragraph', 'option'); ?></p>
    </div>
    <form id="contact-form" name="contact-form" action="#" method="post">
        <input type="hidden" name="action" value="contact"></input>
        <input type="hidden" name="submitted" value="contact"></input>
        <div class="contact-select">Hello! I am a
            <select name="customer-type">
                <option value="homeowner">Homeowner</option>
                <option value="tradesman">Tradesman</option>
            </select>
        </div>
        <input class='contact-field' type="text" placeholder="First Name" name="first-name" required>
        <input class='contact-field' type="text" placeholder="Last Name" name="last-name" required />
        <input class='contact-field' type="email" placeholder="Email" name="email" required />
        <input class='contact-field' type="tel" placeholder='Phone Number' name='phone-number' />
        <input class='contact-field' type="text" placeholder="Company" name="company" />
        <input class='contact-field' type="text" placeholder="Postcode" name="postcode" />
        <textarea class="contact-field" name="message" placeholder='Message'></textarea>
        <div class="form-checkbox-submit">
            <div class="checkbox-container">
                <input type="checkbox" name="privacy" />
                <label for="privacy">I understand and agree to the privacy policy.</label>
            </div>
            <div class="checkbox-container">
                <input type="checkbox" name="newsletter" />
                <label for="newsletter">Are you a UK Installer? Subscribe to the McAlpine Newsletter</label>
            </div>
            <input type="submit" id="wp-submit" class="btn btn-black" value="Enquire" />
        </div>
        <input type="hidden" name="redirect_to" value='' />
    </form>
    <div class="contact-link">
        <p><?php the_field('contact_block_link_text', 'option'); ?></p>
        <?php $link = get_field('contact_block_link', 'option');
        if ($link) :
            $link_url = $link['url'];
            $link_title = $link['title'];
            $link_target = $link['target'] ? $link['target'] : '_self';
        ?>
            <a class="btn btn-red btn-outline" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
        <?php endif; ?>
    </div>
</div>
