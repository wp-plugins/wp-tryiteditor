<?php
/*
 Plugin Name: wp-tryitEditor
 Plugin URI: http://onethird.net/tryitEditor/wp-tryiteditor.html
 Description: front-end editor by tryitEditor
 Version: 0.40
 Author: takeda yuji
 Author URI: http://onethird.net/
 License: GPL2
 */

new tryitEditor;

class tryitEditor {
	public $package;
	public $wp_version;

	private $tryitEditor;
	function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	function init() {
		global $post;
		if (current_user_can( 'edit_post', $post->ID )) {
			add_action( 'wp_ajax_tryitEditor_post', array( $this, 'ajax_post' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_scripts' ) );
		}
	}

	function ajax_post() {
		require_once( ABSPATH . '/wp-admin/includes/post.php' );

		$post_data = (array)get_post( (int) $_POST['ID'] );
		$post_data['post_ID'] = $post_data['ID'];
		$post_data['post_content'] = $_POST['post_content'];
		$post_id = edit_post($post_data);

		$post = get_post( $post_id );

		wp_send_json_success( array(
			'post' => $post
		) );
	}
	
	function wp_enqueue_scripts() {
		global $post;
		wp_enqueue_script('tryit', $this->url( '/js/tryit.js' ), array(), false, true );
		wp_enqueue_script('tryitEditor', $this->url( '/js/tryitEditor.js' ), array(), false, true );
		add_filter('the_content', array($this, 'the_content'), 20);
		wp_enqueue_script('wplink');
		wp_localize_script('wplink', 'ajaxurl', admin_url('admin-ajax.php'));
		wp_enqueue_media(); 
	}
	
	function the_content( $content ) {
		global $post;
		if (is_main_query() && in_the_loop() && (did_action('wp_head') - (int) doing_filter('wp_head')) ) {
$r = <<<EOT
			<div id="tryitEditor-content-{$post->ID}" class="tryitEditor-content" onclick='ot.create_tryiteditor({$post->ID})' >$content</div>
EOT;
			return $r;
		}
		return $content;
	}

	function url($path) {
		$url = plugin_dir_url(__FILE__);
		if (is_string($path)) {
			$url .= ltrim( $path, '/' );
		}
		return $url;
	}

}


