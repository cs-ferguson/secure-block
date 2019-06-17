<?php
// block.php
function render_secure_block( $attributes, $content ) {

  //construct array for checks
  $allowed_roles = json_decode( $attributes['allowedRoles'], true );

  $access_allowed = false;

  if( is_user_logged_in() ) {
    $user = wp_get_current_user();
    foreach( $allowed_roles as $role ){
      if( in_array( $role, $user->roles) ){
        $access_allowed = true;
      }
    }
  }

  if( $access_allowed ){
    return $content;
  } else {
    $dom = new DomDocument();
  	$dom->loadXML( $content );
    $finder = new DomXPath( $dom );
    $links = $finder->evaluate( "//a" );

    foreach($links as $link){
      $link->removeAttribute('href');
    }
    return $dom->saveXML();
  }
}

register_block_type( 'chrisf/secure-block', array(
    'render_callback' => 'render_secure_block',
    'attributes' => array(
      'allowedRoles' => array(
        'type' => 'string',
        'default' => '[]'
      )
    )
  )
);