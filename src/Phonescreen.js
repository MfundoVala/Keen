import * as THREE from 'three'
import FontJSON from '../static/fonts/Roboto-msdf.json'
import FontImage from '../static/fonts/Roboto-msdf.png'
import * as ThreeMeshUI from 'three-mesh-ui'

// var WooCommerceAPI = require('woocommerce-api');
// import WooCommerceAPI from 'woocommerce-api'
//    this.WooCommerce = new WooCommerceAPI({
//         url: 'http://spova.app',
//         consumerKey: 'ck_e1ea862e2ec461bf80c14c28b89acdda4ca0c5a1',
//         consumerSecret: 'cs_61b78a72446fd5d8d32eff6a3863fae91d600d49',
//         wpAPI: true,
//         version: 'wc/v1'
//       });
// this.WooCommerce.get('customers', function(err, data, res) {
//     console.log(res);
//   });
 


export default class PhoneScreen
{
    constructor(objsToTest,scene,onPress)
    {
        this.objsToTest = objsToTest
        this.scene = scene
        this.onPress = onPress
        this.createScreen()
        this.createNavButtons()
        // this.createViewButton()

    }

    createScreen(){
        let white = new THREE.Color( 0xfffffff );

        const screen = new ThreeMeshUI.Block( {
            width: 1.25,
            height: 2.25,
            padding: 0.05,
            fontColor: new THREE.Color( 0xffff ),
            backgroundColor: white,
            textAlign: "center",
            justifyContent: "center",
            fontFamily: FontJSON,
            fontTexture: FontImage,
            backgroundOpacity: 1
        } )


        // screen.position.copy(this.cellphone.position)
        screen.position.set(0.01, -0.01, 0.35)
        screen.rotation.y = -Math.PI;
        screen.rotation.x = 0.30;
        screen.rotation.z = 0.015;
        console.log(Math.PI/8)
        this.scene.add(screen)
    }
    
    createViewButton()
    {
        let black = new THREE.Color( 0x000000 );
        let scale = 1;

        this.panel = new ThreeMeshUI.Block( {
            justifyContent: 'center',
            contentDirection: 'row-reverse',
            fontFamily: FontJSON,
            fontTexture: FontImage,
            fontSize: 0.07 * scale,
            padding: 0.02 * scale,
            borderRadius: 0.11 * scale,
            backgroundColor: new THREE.Color( '#0E8973' ),

        } );
    
        this.panel.position.set(0.01, -0.8, 0.6)
        this.panel.position.z -= 0.9
        this.panel.rotation.y = -Math.PI;
        this.panel.rotation.x = 0.30;
        this.panel.rotation.z = 0.015;
        this.scene.add(this.panel)
    }

    createNavButtons()
    {
        let scale = 1;

        const buttonOptions = {
            width: 0.4 * scale,
            height: 0.15 * scale,
            justifyContent: 'center',
            offset: 0.05 * scale,
            margin: 0.02 * scale,
            borderRadius: 0.075 * scale
        };

        const buttonNext = new ThreeMeshUI.Block( buttonOptions );
        const buttonPrevious = new ThreeMeshUI.Block( buttonOptions );
    
        // Options for component.setupState().
        // It must contain a 'state' parameter, which you will refer to with component.setState( 'name-of-the-state' ).
    
        this.hoveredStateAttributes = {
            state: 'hovered',
            attributes: {
                offset: 0.035,
                backgroundColor: new THREE.Color( 0x999999 ),
                backgroundOpacity: 1,
                fontColor: new THREE.Color( 0xffffff )
            },
        };
    
        this.idleStateAttributes = {
            state: 'idle',
            attributes: {
                offset: 0.035,
                backgroundColor: new THREE.Color( 0x666666 ),
                backgroundOpacity: 0.3,
                fontColor: new THREE.Color( 0xffffff )
            },
        };
    
        // Buttons creation, with the options objects passed in parameters.
    
        // Add text to buttons
    
        buttonNext.add(
            new ThreeMeshUI.Text( { content: 'next' } )
        );
    
        // Create states for the buttons.
        // In update, we call component.setState( 'state-name' ) when mouse hover or click
    
        this.selectedAttributes = {
            offset: 0.02,
            backgroundColor: new THREE.Color( 0x777777 ),
            fontColor: new THREE.Color( 0x222222 )
        };
    
        buttonNext.setupState( {
            state: 'selected',
            attributes: this.selectedAttributes,
            onSet: () => {
                this.onPress(true)
                // this.currentMesh = ( this.currentMesh + 1 ) % 3;
                // this.showMesh( this.currentMesh );
                console.log('next');
    
            }
        } );
        buttonNext.setupState( this.hoveredStateAttributes );
        buttonNext.setupState( this.idleStateAttributes );
        buttonNext.position.set(0.01, -0.8, 0.6)
        buttonNext.position.z -= 0.5
        buttonNext.position.x += 0.3

        buttonNext.rotation.y = -Math.PI;
        buttonNext.rotation.x = 0.30;
        buttonNext.rotation.z = 0.015;
    
        //
    
        buttonPrevious.setupState( {
            state: 'selected',
            attributes: this.selectedAttributes,
            onSet: () => {
    
                // this.currentMesh -= 1;
                // if ( this.currentMesh < 0 ) this.currentMesh = 2;
                // this.showMesh( this.currentMesh );
                this.onPress(false)
                console.log('pressed');
    
            }
        } );
        buttonPrevious.setupState( this.hoveredStateAttributes );
        buttonPrevious.setupState( this.idleStateAttributes );
        buttonPrevious.position.set(0.01, -0.8, 0.6)
        buttonPrevious.position.z -= 0.5
        buttonPrevious.position.x -= 0.3

        buttonPrevious.rotation.y = -Math.PI;
        buttonPrevious.rotation.x = 0.30;
        buttonPrevious.rotation.z = 0.015;

        this.objsToTest.push( buttonNext, buttonPrevious );
        this.scene.add( buttonNext, buttonPrevious )
    }

        // Shows the primitive mesh with the passed ID and hide the others
    
    update() {
        ThreeMeshUI.update()
    }
}