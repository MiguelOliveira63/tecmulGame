window.onload = function(){
    var config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 600,
        scene: {
            Scene1,
            Scene2,
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
        A TUA
    }

    function create ()
    {
    }

    function update ()
    {
    }
}
