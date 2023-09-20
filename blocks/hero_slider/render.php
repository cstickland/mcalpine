<div <?php echo get_block_wrapper_attributes(['class' => 'hero-slider']); ?>>
	<ul class="slide-content">
		<?php $slide_number = 0; ?>
		<?php if (have_rows('slides')) :
			while (have_rows('slides')) : the_row();
		?>
				<li class="<?php if ($slide_number == 0) {
								echo 'active';
							} ?> hero-slide" data-slide-number="<?php echo $slide_number; ?>">
					<h1><?php the_sub_field('slide_title'); ?></h1>
					<div><?php the_sub_field('slide_text'); ?></div>
					<?php if (get_sub_field('slide_show_button') == true) { ?>
						<?php if (have_rows('slide_button')) :
							while (have_rows('slide_button')) : the_row(); ?>
								<a href="<?php the_sub_field('slide_button_link'); ?>" class="btn btn-solid">
									<?php the_sub_field('slide_button_text'); ?>
								</a>
						<?php endwhile;
						endif; ?>
					<?php } ?>
				</li>
				<?php $slide_number++; ?>
		<?php endwhile;
		endif; ?>
	</ul>
	<ul class="slide-controls">
		<?php $slide_number = 0; ?>

		<?php if (have_rows('slides')) :
			while (have_rows('slides')) : the_row();
		?>
				<li class="<?php if ($slide_number == 0) {
								echo 'active';
							} ?> hero-slide-control" data-slide-number="<?php echo $slide_number; ?>">
					<h4><?php the_sub_field('slide_title'); ?></h4>
					<div><?php echo implode(' ', array_slice(explode(' ', get_sub_field('slide_text')), 0, 8)); ?></div>

				</li>
				<?php $slide_number++; ?>

		<?php endwhile;
		endif; ?>
	</ul>

</div>
