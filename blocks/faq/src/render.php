<div <?php echo get_block_wrapper_attributes(['class' => 'faq']); ?> id="query-<?php echo str_replace(' ', '_', get_field('title')); ?>">
	<h1 class="title"><?php the_field('title'); ?></h1>
	<ul class="questions">
		<?php if (have_rows('accordion')) :
			while (have_rows('accordion')) : the_row();
		?>
				<li class="accordion">
					<h3 class="question" itemScope itemProp="mainEntity" itemtype="https://schema.org/Question">
						<span itemprop="name">
							<?php the_sub_field('question'); ?>
						</span>
					</h3>
					<div class="answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
						<span itemprop="text">
							<?php the_sub_field('answer'); ?>
						</span>
					</div>
				</li>
		<?php endwhile;
		endif; ?>
	</ul>
</div>
