const { __ } = wp.i18n; // Import __() from wp.i18n
const { InspectorControls, InnerBlocks } = wp.blockEditor;
const { registerStore, withSelect } = wp.data;
const { registerBlockType } = wp.blocks;
const { CheckboxControl, PanelBody } = wp.components;
const { createElement } = wp.element;
const { apiFetch } = wp;

const iconEl = createElement('svg', { width: 20, height: 20, viewBox: "0 0 241.95 283.46" },
  createElement('path', { d: "M41.51,41.51,61.56,61.56a113.38,113.38,0,0,1,160.35,0l20-20.05A141.73,141.73,0,0,0,41.51,41.51 M41.51,41.51,61.56,61.56a113.38,113.38,0,0,0,0,160.35L41.51,242A141.73,141.73,0,0,1,41.51,41.51Z M242,242l-20-20a113.38,113.38,0,0,1-160.35,0L41.51,242A141.73,141.73,0,0,0,242,242Z", fill: "#303030"})
);

const actions = {
	setUserRoles( userRoles ) {
		return {
			type: 'SET_USER_ROLES',
			userRoles,
		};
	},
	receiveUserRoles( path ) {
		return {
			type: 'RECEIVE_USER_ROLES',
			path,
		};
	},
};

const store = registerStore( 'chrisf/secure-block-store', {
	reducer( state = { userRoles: {} }, action ) {
		switch ( action.type ) {
			case 'SET_USER_ROLES':
				return {
					...state,
					userRoles: action.userRoles,
				};
		}

		return state;
	},

	actions,

	selectors: {
		receiveUserRoles( state ) {
			const { userRoles } = state;
			return userRoles;
		},
	},

	controls: {
		RECEIVE_USER_ROLES( action ) {
			return apiFetch( { path: action.path } );
		},
	},

	resolvers: {
		* receiveUserRoles( state ) {
			const userRoles = yield actions.receiveUserRoles( '/tisa/v1/user-roles/' );
			return actions.setUserRoles( userRoles );
		},
	},
} );

const checkBoxChange = ( value, roleKey, allowedRoles, setAttributes ) => {
  let currentRoles = JSON.parse(allowedRoles);
  //check value true or false
  if( value ){
    //add to array if not in already
    if( currentRoles.indexOf( roleKey ) < 0 ){
      currentRoles.push( roleKey );
    }
  } else {
    //remove from array if in there
    let existingIndex = currentRoles.indexOf( roleKey );
    if( existingIndex > -1 ){
      currentRoles.splice( existingIndex, 1);
    }
  }
  setAttributes({ allowedRoles: JSON.stringify(currentRoles) })
}


//THE BLOCK ITSELF
registerBlockType('chrisf/secure-block', {
  title: 'Secure Block',
  icon: iconEl,
  category: 'common',
  attributes: {
    allowedRoles: {
      default: "[]",
  		type: 'string'
    }
  },

  edit:
    withSelect( ( select ) => {
      return {
  			userRoles: select('chrisf/secure-block-store').receiveUserRoles(),
  		};
    })( ( { userRoles, className, attributes, setAttributes } ) => {
      if ( ! userRoles ) {
          return "Loading...";
      }

      console.log(userRoles);

      let roleKeys = Object.keys(userRoles);
      let checkBoxes = roleKeys.map( roleKey => {
        //check if in attribute
        let currentRoles = JSON.parse( attributes.allowedRoles );
        let checked = ( currentRoles.indexOf( roleKey ) > -1 ) ? true : false ;
        console.log(checked);
        return(
          <CheckboxControl
            name="allowed-roles"
            label={userRoles[roleKey]}
            checked={ checked }
            value={roleKey}
            onChange={ value => checkBoxChange( value, roleKey, attributes.allowedRoles, setAttributes )}
          />
        )
      })

      console.log(attributes.allowedRoles);

      return([
        <InspectorControls>
          { checkBoxes }
        </InspectorControls>,
        <section>
          SECURE BLOCK
          <InnerBlocks />
        </section>
      ])
    }),


  save( { attributes } ) {
    // Rendering in PHP
    return(
      <section>
        <InnerBlocks.Content />
      </section>
    );
  }

});
