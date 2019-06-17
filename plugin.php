<?php
/**
 * Plugin Name: secure-block
 * Plugin URI: https://github.com/cs-ferguson/secure-block
 * Description: A gutenberg block that allows visibility to be limite dby user role
 * Author: Chris Ferguson
 * Author URI: https://github.com/cs-ferguson/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'init.php';
