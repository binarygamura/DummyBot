var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleDrone = require('role.drone');
var spawnLogic = require('logic.spawn');

var Util = require('util.common');

module.exports.loop = () => {
    
    Util.clearMemory();
    
    for(var spawnName in Game.spawns){
        spawnLogic.simpleSpawnStrategy(Game.spawns[spawnName]);
    }
    
    
    
    for( var creepName in Game.creeps){
        var creep = Game.creeps[creepName];
        switch(creep.memory.role){
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'repair':
                roleRepair.run(creep);
                break;
            case 'drone':
                roleDrone.run(creep);
                break;
            default:
                console.log('role '+creep.memory.role+' is not supported yet!');
                break;
        }
    }
    
};