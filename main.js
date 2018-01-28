var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repair: require('role.repair'),
    drone: require('role.drone')
}

var spawnLogic = require('logic.spawn');
var Util = require('util.common');




module.exports.loop = (() => {
    
    
    var cleanUp = () => {
        for(var name in Memory.creeps){
            if(!Game.creeps[name]){
                if(!Memory.creeps[name].role) {
                    console.log('died creep '+name+' had no role!');
                    delete Memory.creeps[name];
                    continue;
                }
                var roleName = Memory.creeps[name].role;
                if(!roles[roleName]){
                    console.log('role '+roleName+' is not implemented!');
                    delete Memory.creeps[name];
                    continue;
                }
                roles[roleName].cleanUp(name);                
                delete Memory.creeps[name];
            }
        }
    };
    
    var runSpawns = () => {
        for(var spawnName in Game.spawns){
            spawnLogic.simpleSpawnStrategy(Game.spawns[spawnName]);
        }
    };
    
    //iterate over every creep and run its logic based on its role.
    var runCreeps =() => {
        for( var creepName in Game.creeps){
            var creep = Game.creeps[creepName];
            if(!creep.memory.role){
                console.log('creep '+creep.name+' has no role assigned!');
                continue;
            }
            if(!roles[creep.memory.role]){
                console.log('role '+creep.memory.role+' is currently not supported.');
                continue;
            }
            roles[creep.memory.role].run(creep);
        }
    };
    
    return () => {
        cleanUp();
        runSpawns();
        runCreeps();
    };
})();