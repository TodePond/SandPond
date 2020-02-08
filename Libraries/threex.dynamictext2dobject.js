var THREEx	= THREEx	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		Constructor							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * create a plane on which we map 2d text
 */
THREEx.DynamicText2DObject	= function(){
        var geometry = new THREE.PlaneGeometry(1,1,1)
        var material = new THREE.MeshPhongMaterial({
                transparent: true
        })

        THREE.Mesh.call( this, geometry, material )

        // create the dynamicTexture
        console.assert(this.dynamicTexture === undefined)
        var dynamicTexture      = new THREEx.DynamicTexture(512,512)

        this.dynamicTexture     = dynamicTexture
        // same parameters as THREEx.DynamicTexture.drawTextCooked
        // - TODO take it from the default paramters of the functions
        //   - no need to duplicate here
        this.parameters = {
                text            : 'Hello World',
                margin		: 0.1,
                lineHeight	: 0.2,
                align		: 'left',
                fillStyle	: 'blue',
        }

        // set the texture material
        material.map    = this.dynamicTexture.texture

        this.update()
}

THREEx.DynamicText2DObject.prototype = Object.create( THREE.Mesh.prototype );

THREEx.DynamicText2DObject.prototype.update = function(){
        var dynamicTexture = this.dynamicTexture
        var parameters = this.parameters
        var context = dynamicTexture.context
	// update the text
	dynamicTexture.clear()
        // actually draw the text
	dynamicTexture.drawTextCooked(parameters)
}
