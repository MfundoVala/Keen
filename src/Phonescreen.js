import * as ThreeMeshUI from 'three-mesh-ui'
import * as THREE from 'three'

import FontJSON from '../static/fonts/Roboto-msdf.json'
import FontImage from '../static/fonts/Roboto-msdf.png'

export default class PhoneScreen
{
    constructor()
    {
        return this.create()
    }

    create(){
        let white = new THREE.Color( 0xffffffff );
        const screen = new ThreeMeshUI.Block( {
            width: 1.25,
            height: 2.25,
            padding: 0.05,
            fontColor: new THREE.Color( 0x222222 ),
            backgroundColor: white,
            justifyContent: 'center',
            textAlign: 'center',
            fontFamily: FontJSON,
            fontTexture: FontImage,
            backgroundOpacity: 1
        } );

        // screen.position.copy(this.cellphone.position)
        screen.position.set(0.01, -0.01, 0.35)
        screen.rotation.y = -Math.PI;
        screen.rotation.x = 0.30;
        screen.rotation.z = 0.015;
        console.log(Math.PI/8)
        return screen
    } 
    
    update() {
        ThreeMeshUI.update()
    }
}