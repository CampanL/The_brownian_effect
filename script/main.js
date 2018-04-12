var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.audio('musique','audio/Musique.ogg');
    game.load.audio('sonMort','audio/death.ogg');
    game.load.audio('sonGagne','audio/finish.ogg');
    game.load.audio('can','audio/boite.ogg');
    game.load.audio('tuyau','audio/Tuyau.ogg');
    game.load.audio('ice','audio/ice.ogg');
    game.load.audio('steam','audio/steam.ogg');
    game.load.audio('gp','audio/gpo.ogg');
    game.load.audio('button','audio/button.ogg');
    game.load.audio('plop','audio/goutte.ogg');
    //decors
    //game.load.image('decorFond', 'assets/fond.png');
    game.load.image('fond2', 'assets/imagefond.png');
    //lvl1
    game.load.image('solPlafond', 'assets/plateforme01.png');
    game.load.spritesheet('conserve','assets/spriteBoiteConserve.png',237,295);
    game.load.image('tomate','assets/tomate1.png');
    game.load.image('rond','assets/rond.png');
    game.load.image('fourchette','assets/cuillere.png');
    game.load.image('tuto','assets/tuto.png');
    game.load.image('tuto1','assets/tuto1.png')
    game.load.image('attention','assets/death.png')
    //lvl2
    game.load.image('platformMur','assets/plateforme_2.png');
    game.load.image('2tuyaux','assets/2tuyaux.png');
    game.load.image('hotteAspirante','assets/aeration.png');
    game.load.image('baseBouton','assets/boutonbase.png');
    game.load.image('bouton','assets/bouton.png');
    game.load.image('tuyauxCoude','assets/tuyauxCoude.png');
    game.load.image('blocBouton','assets/blocBouton.png');
    game.load.image('cache','assets/cache.png')
    //lvl3
    //game.load.image('2tuyaux','assets/2tuyaux.png'); (dans lvl2)
    game.load.image('platformMur3','assets/plateforme_3.png');
    game.load.image('helice','assets/helice1.png');
    //lvl4
    game.load.image('newToast2','assets/newToast2.png');
    game.load.image('grillePain','assets/Grille-pain.png');
    game.load.image('platforme','assets/platforme.png');
    game.load.image('mini-platforme','assets/mini-platforme.png');
    game.load.spritesheet('book','assets/Spritebooks.png',350,394);
    game.load.image('exit','assets/plateforme_4.png');
    game.load.image('plafondgrillePain','assets/plafongrillepain1.png');
    //Arrivée
    game.load.image('panneauFin1','assets/panneaufin1.png');
    game.load.image('panneauFin2','assets/panneaufin2.png');
    game.load.image('yay','assets/yay.png')

    //sprites
    game.load.spritesheet('player', 'assets/player.png', 50,35);
    game.load.spritesheet('effetPlayer', 'assets/effet_player.png', 50,35);
    game.load.spritesheet('effetVentil', 'assets/effetAspir.png', 576,250);
    game.load.spritesheet('voyantHotte', 'assets/boutonhotte.png', 40,35);

    //hitbox
    game.load.physics("cuillereHitbox", "assets/cuillereHitbox.json");
    game.load.physics("tomateHitbox", "assets/tomateHitbox.json");
    game.load.physics("platformMurHitbox", "assets/platformMurHitbox.json");
    game.load.physics("grillePain","assets/grillePain.json");
    game.load.physics("newToast2Hitbox","assets/newToast2Hitbox.json");
    game.load.physics("hotteAspiranteHitbox","assets/hotteAspiranteHitbox.json");
    game.load.physics("tuyauxCoudeHitbox","assets/tuyauxCoudeHitbox.json");
    game.load.physics("platformMur3Hitbox", "assets/platformMur3Hitbox.json");
    game.load.physics("bookHit","assets/book.json");
    game.load.physics("exitHit","assets/exit.json");
    game.load.physics("heliceHitbox","assets/heliceHitbox.json");
}
var timer=0;
var tabCONSERVE = [],
    puissanteTomate = true,
    playerEnContact = false,
    reset=false;
var player,
    etatgoutte,
    etatGlace,
    etatVap,
    gauche,
    droite,
    partieGagnee=false,
    timerFinGame=0,
    compteurEnd=0,
    compteurMort=0,
    compteurcan=0,
    toast=0;
    boutonc=0;

var playerMass = 1,
    playerGravite = 1;
var etat = "goutte",
    etatPrecedent,
    velocityYPrecedent;

var finAnim=false,
    autoriseTransformNuage=false,
    autoriseTransformNuageOK=true;

var indiceLvl2 = 2200,
    indiceLvl3 = 1400+indiceLvl2,
    indiceLvl4 = 415+indiceLvl3,
    indiceArrivee = 2585+indiceLvl4;

var hotteAspiration={
    debX: indiceLvl2-670,
    debY: 0,
    finX: indiceLvl2-100,
    finY: 340,
    puissance: -900,
    on : true
};

zoneTuyau = function (X,Y,puissance)
{
    this.x = X;
    this.y = Y;
    this.debX = X+5;
    this.debY = Y+5;
    this.finX = X+545;
    this.finY = Y+61;
    this.puissance = puissance;
    this.affiche = function()
      {
        var tuyaux2S = game.add.sprite(this.x,this.y,'2tuyaux');
      };
    this.aspire = function()
    {
        if(player.x>this.debX && player.x<this.finX &&
            player.y>this.debY && player.y<this.finY)
        {
            if(player.body.velocity.x>0 && !this.gauche)
            {
                pipe.play()
                player.body.velocity.x = this.puissance;
            }
            else if(player.body.velocity.x<0 && !this.droite)
            {
                pipe.play()
                player.body.velocity.x = -this.puissance;
            }
        }
    }
}
var tuyaux1 = new zoneTuyau(indiceLvl2-139,294,1200);
var tuyaux2 = new zoneTuyau(indiceLvl3-375,294,1200);
var tuyaux3 = new zoneTuyau(indiceLvl4+1246,92,1200);

function create()
{
//  SON
//
    window.sonGagne = game.add.audio('sonGagne');
    window.sonMort = game.add.audio('sonMort');
    window.musique = game.add.audio('musique');
    window.aspi = game.add.audio('aspi');
    window.can = game.add.audio('can');
    window.pipe = game.add.audio('tuyau');
    window.ice = game.add.audio('ice');
    window.steam = game.add.audio('steam');
    window.gp = game.add.audio('gp');
    window.button = game.add.audio('button');
    window.plop = game.add.audio('plop');
    plop.volume=1.2;
    button.volume=1.5;
    gp.volume=1.2;
    steam.volume=1;
    ice.volume = 0.5;
    pipe.volume=1.4;
    pipe.loop=false;
    sonGagne.volume = 1.2;
    musique.volume = 0.7;
    aspi.volume = 1.4;
    can.volume=1.4
    aspi.loop=true;
    musique.loop = true;
    musique.play();

//  CONTROLES
//
    gauche     = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    droite     = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    etatgoutte = game.input.keyboard.addKey(Phaser.Keyboard.A);
    etatGlace  = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    etatVap    = game.input.keyboard.addKey(Phaser.Keyboard.E);
    restart    = game.input.keyboard.addKey(Phaser.Keyboard.R);

//  PHYSIQUE
//
    // On active P2
    game.physics.startSystem(Phaser.Physics.P2JS);
    //Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.world.defaultContactMaterial.friction = 0.8;
    game.physics.p2.gravity.y = 989;

//  FOND
//
    //paralax1 = game.add.tileSprite(0, 0, 3300,  816, 'fond1');
    window.paralax2 = game.add.tileSprite(0, 0, 7000, 816, 'fond2');

    game.world.setBounds(0, 0, 7000, 600);

//  TUTO
//
    var tuto = game.add.image(120, game.world.height-520,'tuto');
    var tuto1 = game.add.image(700, game.world.height-550,'tuto1');
    var turo2 = game.add.image(350, game.world.height-600,'attention');
//  COLLISION
//
    // On créé les groupes de collision
    window.playerCollisionGroup     = game.physics.p2.createCollisionGroup();
    window.platformsCollisionGroup  = game.physics.p2.createCollisionGroup();
    window.decorCollisionGroup      = game.physics.p2.createCollisionGroup();
    window.interactifCollisionGroup = game.physics.p2.createCollisionGroup();

//  GROUPES
//
    window.platforms = game.add.group();
    platforms.enableBody = true;
    platforms.physicsBodyType = Phaser.Physics.P2JS;
    
    window.elementIneractif = game.add.group();
    elementIneractif.enableBody = true;
    elementIneractif.physicsBodyType = Phaser.Physics.P2JS;

    window.decors = game.add.group();
    decors.enableBody = true;
    decors.physicsBodyType = Phaser.Physics.P2JS;

//  PLATFORMES STATIC GLOBAL
//
    
    // On créé le solPlafond 'solPlafond' dans le groupe 'plateforms'
    window.solPlafond = platforms.create(-200, game.world.height - 52, 'solPlafond');
    // On indique que le solPlafond qu'on vient de créer sera immobile
    solPlafond.body.static = true;
    solPlafond.body.setCollisionGroup(platformsCollisionGroup);
    solPlafond.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
    
    // On créé le sol 'solPlafond' dans le groupe 'plateforms'
    for (var i = 0; (i*1000)<=(indiceLvl2-500); i++) {
        window.solPlafond = platforms.create((indiceLvl2-1000)-(1000*i), game.world.height - 52, 'solPlafond');
        // On indique que le solPlafond qu'on vient de créer sera immobile
        solPlafond.body.static = true;
        solPlafond.body.setCollisionGroup(platformsCollisionGroup);
        solPlafond.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
    }
        
//------------------//
//  OBSTACLE 1
//  (conserves/tomate)
//  ELEMENTS STATIC
//
    // On créé la conserve dans le groupe 'plateforms'
    window.conserveS = game.add.sprite(350,game.world.height - 249,'conserve');
    game.physics.p2.enable(conserveS);
    conserveS.body.static = true;
    // conserveS appartient à 'platformsCollisionGroup'
    conserveS.body.setCollisionGroup(platformsCollisionGroup);
    conserveS.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
    conserveS.animations.add('conserveSCligne',[1,2,3,3,4,0],20,false);
    conserveS.animations.add('conserveSRegard',[5,6,6,6,6,6,6,6,6,6,7,7,8,9,0],15,false);

    window.conserveS = game.add.sprite(-119,game.world.height - 249,'conserve');
    game.physics.p2.enable(conserveS);
    conserveS.body.static = true;
    // conserveS appartient à 'platformsCollisionGroup'
    conserveS.body.setCollisionGroup(platformsCollisionGroup);
    conserveS.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);

    window.conserveS = game.add.sprite(-119,game.world.height-500,'conserve');
    game.physics.p2.enable(conserveS);
    conserveS.body.static = true;
    // conserveS appartient à 'platformsCollisionGroup'
    conserveS.body.setCollisionGroup(platformsCollisionGroup);
    conserveS.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);

    var conserveSMaterial = game.physics.p2.createMaterial('conserveSMaterial', conserveS.body);

    window.rondS = platforms.create(640,game.world.height - 190,'rond');
    rondS.body.static = true;
    // rondS appartient à 'platformsCollisionGroup'
    rondS.body.setCollisionGroup(platformsCollisionGroup);
    rondS.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
    window.rondS = platforms.create(550,game.world.height - 160,'rond');
    rondS.body.static = true;
    // rondS appartient à 'platformsCollisionGroup'
    rondS.body.setCollisionGroup(platformsCollisionGroup);
    rondS.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
    window.rondS = platforms.create(680,game.world.height - 250,'rond');
    rondS.body.static = true;
    // rondS appartient à 'platformsCollisionGroup'
    rondS.body.setCollisionGroup(platformsCollisionGroup);
    rondS.body.collides([platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
//  ELEMENTS MOBILE
//
    

    for (var i = 1; i <= 3; i++) {
        window.conserveM = game.add.sprite(980+Math.random()*8,(game.world.height-19)-(292*0.58*i),'conserve');

        tabCONSERVE.push(conserveM);
        game.physics.p2.enable(tabCONSERVE[i-1], false);
        tabCONSERVE[i-1].scale.setTo(0.46,0.58);
        tabCONSERVE[i-1].body.clearShapes();
        tabCONSERVE[i-1].body.setRectangle(236*0.46, 292*0.58);
        tabCONSERVE[i-1].body.data.mass=3;
        tabCONSERVE[i-1].body.data.gravityScale=1.3;
        tabCONSERVE[i-1].body.static=true;
        // la conserveM créé appartient au groupe de collision 'decorCollisionGroup'
        tabCONSERVE[i-1].body.setCollisionGroup(decorCollisionGroup);
        tabCONSERVE[i-1].body.collides([decorCollisionGroup,platformsCollisionGroup,playerCollisionGroup,interactifCollisionGroup]);
        tabCONSERVE[i-1].animations.add('conserveMCligne',[1,2,3,3,4,0],20,false);
        tabCONSERVE[i-1].animations.add('conserveMRegard',[5,6,6,7,7,7,7,7,8,9,0],15,false);
    }

    window.tomateM;
    tomateM = elementIneractif.create(560,game.world.height-330,'tomate');
    tomateM.body.clearShapes();
    tomateM.body.loadPolygon("tomateHitbox", 'tomate');
    // tomateM appartient à 'decorCollisionGroup'
    tomateM.body.setCollisionGroup(decorCollisionGroup);
    tomateM.body.collides([playerCollisionGroup,platformsCollisionGroup,interactifCollisionGroup]);
    tomateM.body.data.mass=1.8;
    tomateM.body.data.gravityScale=1;

    window.fourchetteM = elementIneractif.create(660,game.world.height-230,'fourchette',true);
    fourchetteM.body.clearShapes();
    fourchetteM.body.loadPolygon("cuillereHitbox", 'fourchette');
    // fourchette appartient à 'interactifCollisionGroup'
    fourchetteM.body.setCollisionGroup(interactifCollisionGroup);
    fourchetteM.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
    window.fourchetteMaterial = game.physics.p2.createMaterial('fourchetteMaterial', fourchetteM.body);
//
//  FIN OBSTACLE 1
//------------------//

//------------------//
//  OBSTACLE 2
//
// SOL/MUR
//
    window.platformMur;
    platformMurS = platforms.create(indiceLvl2,300,'platformMur');
    platformMurS.body.clearShapes();
    platformMurS.body.loadPolygon('platformMurHitbox', 'platformMur');
    platformMurS.body.static = true;
    platformMurS.body.setCollisionGroup(platformsCollisionGroup);
    platformMurS.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
// BOUTON
//
    window.bouton = platforms.create(indiceLvl2-700,game.world.height-130, 'bouton');
    bouton.scale.setTo(0.4,0.26);
    bouton.body.clearShapes();
    bouton.body.setRectangle(230*0.4, 142*0.26);
    bouton.body.setCollisionGroup(interactifCollisionGroup);
    bouton.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
    bouton.body.data.gravityScale = -2.1;
    bouton.body.data.mass = 2;
    bouton.body.fixedRotation=true;

    window.blocBouton1 = platforms.create(bouton.x-52,bouton.y,'blocBouton');
    //blocBouton1.scale.setTo(10,50);
    blocBouton1.body.clearShapes();
    blocBouton1.body.setRectangle(10, 50);
    blocBouton1.body.static = true;
    blocBouton1.body.setCollisionGroup(interactifCollisionGroup);
    blocBouton1.body.collides([interactifCollisionGroup]);

    window.blocBouton2 = platforms.create(bouton.x+51,bouton.y,'blocBouton');
    //blocBouton2.scale.setTo(10,50);
    blocBouton2.body.clearShapes();
    blocBouton2.body.setRectangle(10, 50);
    blocBouton2.body.static = true;
    blocBouton2.body.setCollisionGroup(interactifCollisionGroup);
    blocBouton2.body.collides([interactifCollisionGroup]);
   /* var cache = game.add.image(indiceLvl2-700,game.world.height-100, 'cache')*/
    //console.log(bouton.x+" / "+bouton.y);
//
//  FIN OBSTACLE 2
//------------------//

//------------------//
//  OBSTACLE 3
//
// SOL/MUR
//
    window.platformMur;
    platformMur3S = platforms.create(indiceLvl3,300,'platformMur3');
    platformMur3S.body.clearShapes();
    platformMur3S.body.loadPolygon('platformMur3Hitbox', 'platformMur3');
    platformMur3S.body.static = true;
    platformMur3S.body.setCollisionGroup(platformsCollisionGroup);
    platformMur3S.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);

    window.elice;
    helice = platforms.create(indiceLvl3+430,300,'helice');
    helice.body.clearShapes();
    helice.body.loadPolygon('heliceHitbox', 'helice');
    helice.body.rotateLeft(45);
    helice.body.static = true;
    helice.body.setCollisionGroup(platformsCollisionGroup);
    helice.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
//
//  FIN OBSTACLE 3
//------------------//

//------------------//
//  OBSTACLE 4
//
    window.book = game.add.sprite(indiceLvl4+390, 300,'book');
    game.physics.p2.enable(book, false);
    book.body.clearShapes()
    book.body.loadPolygon('bookHit', 'book')
    book.body.static = true;
    book.body.setCollisionGroup(platformsCollisionGroup);
    book.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
    book.animations.add('bookYeux',[1,2,3],10,false);
    book.animations.add('bookFix',[0],1,true);
/*
    sol = platforms.create(indiceLvl4+925, 390,'mini-platforme');
    sol.body.static = true;
    sol.body.setCollisionGroup(platformsCollisionGroup);
    sol.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);

    sol = platforms.create(indiceLvl4+1187, 390,'mini-platforme');
    sol.body.static = true;
    sol.body.setCollisionGroup(platformsCollisionGroup);
    sol.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);*/

    window.solPlafond = platforms.create((indiceLvl3+1000), game.world.height - 53, 'solPlafond');
    // On indique que le solPlafond qu'on vient de créer sera immobile
    solPlafond.body.static = true;
    solPlafond.body.setCollisionGroup(platformsCollisionGroup);
    solPlafond.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
    
    window.plafondgrillePain = platforms.create((indiceLvl4+875), 41, 'plafondgrillePain');
    // On indique que le solPlafond qu'on vient de créer sera immobile
    plafondgrillePain.body.static = true;
    plafondgrillePain.body.setCollisionGroup(platformsCollisionGroup);
    plafondgrillePain.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
 
    var exit = platforms.create(indiceLvl4+1585, 249,'exit');
    exit.body.clearShapes();
    exit.body.loadPolygon("exitHit", 'exit');
    exit.body.static = true;
    exit.body.setCollisionGroup(platformsCollisionGroup);
    exit.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);

    window.newToast2 = elementIneractif.create(indiceLvl4+818,game.world.height-330,'newToast2');
   // newToast2.body.clearShapes();
    newToast2.body.setRectangle(100,31,0,40);
    newToast2.body.loadPolygon("newToast2Hitbox", 'newToast2');
    newToast2.body.setCollisionGroup(interactifCollisionGroup);
    newToast2.body.collides([interactifCollisionGroup,platformsCollisionGroup,playerCollisionGroup]);
    newToast2.body.data.fixedRotation=true;
    newToast2.body.data.fixedX=true;
    newToast2.body.data.gravityScale=-0.2;
    newToast2.body.data.mass = 8;

    window.blocBouton3 = platforms.create(newToast2.x+38,newToast2.y-69,'blocBouton');
    blocBouton3.scale.setTo(0,0);
    blocBouton3.body.clearShapes();
    blocBouton3.body.setRectangle(8, 130);
    blocBouton3.body.static = true;
    blocBouton3.body.setCollisionGroup(interactifCollisionGroup);
    blocBouton3.body.collides([interactifCollisionGroup]);

    window.blocBouton4 = platforms.create(newToast2.x+435,newToast2.y,'blocBouton');
    blocBouton4.scale.setTo(0,0);
    blocBouton4.body.clearShapes();
    blocBouton4.body.setRectangle(30, 250);
    blocBouton4.body.static = true;
    blocBouton4.body.setCollisionGroup(interactifCollisionGroup);
    blocBouton4.body.collides([interactifCollisionGroup]);

    var grillePain = elementIneractif.create(indiceLvl4+1047,game.world.height-260,'grillePain',true);
    grillePain.body.clearShapes();
    grillePain.body.loadPolygon("grillePain", 'grillePain');
    // grillePain appartient à 'decorCollisionGroup'
    grillePain.body.setCollisionGroup(decorCollisionGroup);
    grillePain.body.static=true;
    grillePain.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
//
//  FIN OBSTACLE 4
//------------------//

//------------------//
//  ARRIVEE
//
    window.panneauFin1 = game.add.image(indiceArrivee-300, game.world.height-337,'panneauFin1');
    var yay= game.add.image(indiceArrivee+200, game.world.height-248,'yay')

    window.solPlafond = platforms.create(indiceArrivee, game.world.height - 53, 'solPlafond');
    // On indique que le solPlafond qu'on vient de créer sera immobile
    solPlafond.body.static = true;
    solPlafond.body.setCollisionGroup(platformsCollisionGroup);
    solPlafond.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);
//
//  FIN ARRIVEE
//------------------//


//-----------------//
// PLAYER
//
// PROPRIETES GENERALES
//
    player = game.add.sprite(30,game.world.height-132, 'player');
    game.physics.p2.enable(player, false);
    player.body.fixedRotation = true;
    player.smoothed = false;
    
    //var elementInteractifCollisionGroup = game.physics.p2.createCollisionGroup();

    player.body.clearShapes();
    player.body.setCircle(12,-3,5);

//    var playerMaterial = game.physics.p2.createMaterial('playerMaterial', player.body);

/*    var contactMaterialConserveSPlayer = game.physics.p2.createContactMaterial(conserveSMaterial,playerMaterial);
    contactMaterialConserveSPlayer.friction = 1;
    contactMaterialConserveSPlayer.restitution = 10;
    contactMaterialConserveSPlayer.stiffness = 10e10;
    contactMaterialConserveSPlayer.relaxation = 10;
    contactMaterialConserveSPlayer.frictionStiffness = 10e7;
    contactMaterialConserveSPlayer.frictionRelaxation = 3;
    contactMaterialConserveSPlayer.surfaceVelocity = 10;*/

// Animation Player
//
    player.animations.add('goutteFixe', [0,1,2,3,4,5], 8, true);
    player.animations.add('nuageFixe', [10,11,12,13,14], 8, true);
    player.animations.add('glaconFixe', [20,21,22,23,24], 8, true);
    //transformations:
    player.animations.add('glaconAgoutte', [27,28,29,30,31,32,33], 13, false);
    player.animations.add('nuageAgoutte', [10,8], 8, false);

    player.animations.add('goutteAnuage', [53,54,55], 25, false);
    player.animations.add('glaconAnuage', [18,11], 8, false);

    player.animations.add('goutteAglacon', [36,37,38,39,40,41], 10, false);
    player.animations.add('nuageAglacon', [11,18], 8, false);
    //deplacement
    player.animations.add('goutteDroite', [63,64,65,66,67], 12, false);
    player.animations.add('goutteGauche', [72,73,74,75,76], 12, false);
    //autres anim
    player.animations.add('chuteGoutte', [48,49,50,51], 12, true);
    player.animations.add('atterrissageGoutte', [45,46,47], 13, false);

    player.animations.play('glaconAgoutte');
// Animation Effet player
//
    // On indique que le player est dans le groupe 'playerCollisionGroup'
    player.body.setCollisionGroup(playerCollisionGroup);
    player.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup], function(){
        //player.body.velocity.y=-10;
        playerEnContact = true;
    });
//
//  FIN PLAYER
//---------------//

    window.panneauFin2 = game.add.image(panneauFin1.x+258, panneauFin1.y+76,'panneauFin2');

//------------------//
//  OBSTACLE 2
//
    tuyaux1.affiche();

    hotteAspirante = game.add.image(indiceLvl2-688,-11, 'hotteAspirante');//affiche l'image de la hotte au premier plan
    window.hotteAspirante = platforms.create(indiceLvl2-400,50, 'hotteAspirante');
    hotteAspirante.body.clearShapes();
    hotteAspirante.body.loadPolygon("hotteAspiranteHitbox", 'hotteAspirante');
    hotteAspirante.body.static = true;
    hotteAspirante.body.setCollisionGroup(platformsCollisionGroup);
    hotteAspirante.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);

    window.baseBouton = platforms.create(indiceLvl2-700,game.world.height-120, 'baseBouton');
    baseBouton.scale.setTo(0.4,0.4);
    baseBouton.body.clearShapes();
    baseBouton.body.setRectangle(300*0.4, 86*0.4);
    baseBouton.body.static = true;
    baseBouton.body.setCollisionGroup(platformsCollisionGroup);
    baseBouton.body.collides([playerCollisionGroup,platformsCollisionGroup]);

    window.tuyauxCoude = platforms.create(indiceLvl2-800,game.world.height-140, 'tuyauxCoude');
    tuyauxCoude.body.clearShapes();
    tuyauxCoude.body.loadPolygon("tuyauxCoudeHitbox", 'tuyauxCoude');
    tuyauxCoude.body.static = true;
    tuyauxCoude.body.setCollisionGroup(platformsCollisionGroup);
    tuyauxCoude.body.collides([playerCollisionGroup,platformsCollisionGroup,decorCollisionGroup,interactifCollisionGroup]);

    window.effetVentil = game.add.sprite(indiceLvl2-400,250,'effetVentil');
    game.physics.p2.enable(effetVentil, false);
    effetVentil.body.static=true;
    effetVentil.animations.add('ventilActiv', [0,1,2,3,4], 9, true);
    effetVentil.animations.add('ventilDesactiv',[5],1,true);

    window.voyantHotte = game.add.sprite(indiceLvl2-600,95,'voyantHotte');
    voyantHotte.scale.setTo(0.7,0.7);
    game.physics.p2.enable(voyantHotte, false);
    voyantHotte.body.static=true;
    voyantHotte.animations.add('voyantOn', [0],1,true);
    voyantHotte.animations.add('voyantOff',[1],1,true);
//
//  FIN OBSTACLE 2
//------------------//

//------------------//
//  OBSTACLE 3
//
    tuyaux2.affiche();
//
//  FIN OBSTACLE 3
//------------------//

//------------------//
//  OBSTACLE 3
//
    tuyaux3.affiche();
//
//  FIN OBSTACLE 3
//------------------//

//  CALLBACK DES COLLISIONS
//
    tomateM.body.collides(decorCollisionGroup, activeChute, this);

//  CAMERA
//
    game.camera.follow(player);
}

function update(){

    if(Math.random()>0.8)
    {
        if(Math.random()<0.1)
        {
        conserveS.animations.play('conserveSRegard');
        }
        if(Math.random()>0.9)
        {
            tabCONSERVE[Math.round(Math.random()*2)].animations.play('conserveMCligne')
        }
        if(Math.random()<0.08)
        {
            tabCONSERVE[Math.round(Math.random()*2)].animations.play('conserveMRegard')
        }
    }
    if(Math.random()<0.01)
    {        
        conserveS.animations.play('conserveSCligne');
        book.animations.play('bookYeux');
        book.animations.currentAnim.onComplete.add(function(){
            book.animations.play('bookFix');
        },this);
    }

    paralax2.x= game.camera.x*0.3;
    paralax2.y= game.camera.y*0.3;

    player.body.velocity.x=0;
    player.body.data.gravityScale=playerGravite;
    player.body.data.mass=playerMass;
//*********************//
// Changement d'état

    if(player.body.velocity.y<1)
    {
        autoriseTransformNuageOK = true;
    }
    if(playerEnContact && autoriseTransformNuageOK)
    {
        autoriseTransformNuage = true;
        autoriseTransformNuageOK = false;
        playerEnContact = false;
    }

    if (etatgoutte.isDown)
    {
      etat = "goutte";
    }
    else if (etatVap.isDown)
    {
        if(autoriseTransformNuage)
        {
          etat = "nuage";
          autoriseTransformNuage = false;
        }
    }
    else if (etatGlace.isDown)
    {
      etat = "glacon";
    }

    if(partieGagnee)
    {
        playerMass=1;
        playerGravite=0;
        compteurEnd++;
        if (compteurEnd==1)
        {
            sonGagne.play();
            compteurEnd=2;
        }
        if (player.x<panneauFin1.x+350)
        {
            player.body.velocity.x=500;
            player.animations.play('goutteDroite');
        }else{
            player.animations.play('goutteFixe');
        }
        player.body.velocity.y=0;

        if(timerFinGame==0)
        {
            timerFinGame=game.time.time;
        }
        if(game.time.time-timerFinGame>3000 && game.time.time-timerFinGame<3100)
        {
            console.log("end");
            document.location.href='end.html';
        }
    }
    else
    {
    //*********************//
    // Différents etats
        switch (etat)
        {
            case "goutte":
                if(etatPrecedent=="glacon")
                {
                    finAnim= false;
                    player.animations.play('glaconAgoutte');
                }
                else if(etatPrecedent=="nuage")
                {
                    finAnim = false;
                    player.animations.play('nuageAgoutte');
                }
                //lorsque l'anim de la transformation est terminé
                player.animations.currentAnim.onComplete.add(function()
                    {
                        finAnim = true;
                    }, this);
                playerMass=0.04;
                playerGravite=0.9;
                player.body.setCircle(12,-2,4);
                if (finAnim)
                {
                    if (player.body.velocity.y>150)
                    {
                        player.animations.play('chuteGoutte');
                    }else if(velocityYPrecedent-player.body.velocity.y>400){
                        plop.play();
                        player.animations.play('atterrissageGoutte');
                        player.animations.currentAnim.onComplete.add(function(){
                            player.animations.play('goutteFixe');
                        },this); 
                    }
                    else if(player.animations.currentAnim.name=="chuteGoutte"){
                        player.animations.play('goutteFixe');
                    }else if (gauche.isDown)
                    {
                        player.animations.play('goutteGauche');
                    }
                    else if (droite.isDown)
                    {
                        player.animations.play('goutteDroite');
                    }else if(player.body.velocity.y<50){
                        player.animations.currentAnim.onComplete.add(function(){
                            player.animations.play('goutteFixe');
                        },this); 
                    }
                }else{
                    player.animations.currentAnim.onComplete.add(function()
                    {
                        player.animations.play('goutteFixe');
                    }, this);
                }
                if (gauche.isDown)
                {
                    player.body.velocity.x = -250;
                }
                else if (droite.isDown)
                {
                    player.body.velocity.x = 250;
                }
            break;

            case "nuage":
                if(etatPrecedent=="goutte")
                {
                    steam.play();
                    player.body.velocity.y=player.body.velocity.y/2;
                    player.animations.play('goutteAnuage');
                    var effetPlayer = game.add.sprite(player.x-30,player.y-19,'effetPlayer');
                    effetPlayer.animations.add('effetGouteAnuage', [0,1,2,3],20,false);
                    effetPlayer.animations.play('effetGouteAnuage');
                    effetPlayer.animations.currentAnim.onComplete.add(function()
                    {
                        effetPlayer.kill();
                    });               
                }
                else if(etatPrecedent=="glacon")
                {
                    player.animations.play('glaconAnuage');
                    steam.play()
                }
                player.animations.currentAnim.onComplete.add(function()
                    {
                        player.animations.play('nuageFixe');
                    }, this);
                playerMass=0.05;
                playerGravite=-0.2;
                player.body.setCircle(11,-2,1);
                if (gauche.isDown)
                {
                  player.body.velocity.x = -100;
                }
                else if (droite.isDown)
                {
                  player.body.velocity.x = 100;
                }
            break;

            case "glacon":
                if(etatPrecedent=="goutte")
                {
                    player.animations.play('goutteAglacon');
                    ice.play();
                }
                else if(etatPrecedent=="nuage")
                {
                    player.animations.play('nuageAglacon');
                    ice.play();
                }
                player.animations.currentAnim.onComplete.add(function()
                    {
                        player.animations.play('glaconFixe');
                    }, this);
                playerMass=4.5;
                playerGravite=1.5;
                //player.body.clearShapes();
                player.body.setRectangle(31,31,-2);
            break;
        }
    }


    player.body.setCollisionGroup(playerCollisionGroup);
    etatPrecedent = etat;
    velocityYPrecedent = player.body.velocity.y;

    if(player.x>hotteAspiration.debX && player.x<hotteAspiration.finX &&
        player.y>hotteAspiration.debY && player.y<hotteAspiration.finY)
    {
        if(hotteAspiration.on)
        {
            player.body.velocity.y = hotteAspiration.puissance;
        }
    }
    tuyaux1.aspire();
    tuyaux2.aspire();
    tuyaux3.aspire();
// RESTART
//
if (restart.isDown) 
    {
        document.location.href='jeu.html';
    };
// POSITION TOAST
//
    newToast2.body.velocity.x = 0;
    if(newToast2.x<indiceLvl4+817)
    {
        newToast2.body.velocity.x=5;
    }
    if(newToast2.y>315)
    {
        newToast2.body.velocity.y=0;
        newToast2.body.static=true;
    }
    if (newToast2.y>300) 
    {
        toast++
        if (toast ==1) 
            {
            gp.play();
            }

    }

// CONDITION DE "MORT"
//
    if (player.y<-10 || player.y>game.world.height+100 || player.x<-28)
    {
        compteurMort+=1;

        if (compteurMort==1) 
        {
            sonMort.volume=1;
            sonMort.play();
        }       
    }
    if(compteurMort>=1)
    {
        compteurMort++;
        player.kill()
    }
    if (compteurMort >=150 && compteurMort<155) 
    {
        document.location.href="jeu.html";
    }
//
// FIN DU JEU
//
    if(player.x>=panneauFin1.x-250)
    {
        etat = "goutte";
    }
    if(player.x>=panneauFin1.x+100)
    {
        partieGagnee = true;
    }

// POSITION BOUTON
//
    bouton.body.velocity.x=0;
    if(bouton.y<450)
    {
        bouton.body.data.gravityScale=0;
        bouton.body.data.mass = 5;
        bouton.body.velocity.y = 0;
        boutonc = 0;
    }else if (bouton.y>472){
        boutonc++
        if (boutonc==1) 
        {
            button.play()
        }
        
        if(bouton.body.data.mass>4)
        {
            hotteAspiration.on = !hotteAspiration.on;
        }
        bouton.body.data.gravityScale = -1.5;
        bouton.body.data.mass = 0.9;
    }
    if(hotteAspiration.on)
    {
        effetVentil.animations.play('ventilActiv');
        voyantHotte.animations.play('voyantOn');
    }else{
        effetVentil.animations.play('ventilDesactiv');
        voyantHotte.animations.play('voyantOff');
    }
}

function render() {
    //console.log("pos Y = "+player.y);
    //console.log("velocyté Y = "+player.body.velocity.y);
    //console.log("player en contact ? "+playerEnContact);
    //console.log("autoriseTransformNuageOK > "+autoriseTransformNuageOK);
    //console.log("autoriseTransformNuage > "+autoriseTransformNuage);
    //console.log("------------------------\n");
}

function activeChute(body1,body2){
    //console.log("body2 velo y = "+body1.velocity.y);
    //console.log("body2 velo x = "+body1.velocity.x);
    if (body1.velocity.y>80 || (body1.velocity.x<-3 || body1.velocity.x>40))
    {
        for (var i = tabCONSERVE.length - 1; i >= 0; i--) {
            tabCONSERVE[i].body.static = false;
        }
        if(puissanteTomate)
        {
            console.log(" -> body2 velo x = "+body1.velocity.x);
            console.log(" -> body2 velo y = "+body1.velocity.y);
            body1.velocity.x=700;
            puissanteTomate=false;
            compteurcan+=1;
            if (compteurcan==1)
                {
                    can.play();
                };
        }
    }
}