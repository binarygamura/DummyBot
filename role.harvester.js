var behaviour = require('logic.common');

module.exports = {
    run: function(creep){
        
        if(!creep.spawning && !creep.memory.init && creep.memory.spawnId ){
            var spawn = Game.getObjectById(creep.memory.spawnId);
            spawn.memory.sources[creep.memory.sourceId].push(creep.name);
            creep.memory.init = true;
            creep.memory.id = creep.id;
        }
        
        if(creep.carry.energy < creep.carryCapacity) {
            behaviour.harvestEnergy(creep, Game.getObjectById(creep.memory.sourceId));
        }
        else {
            var targets = [];
            var spawn = Game.getObjectById(creep.memory.spawnId);
            if(spawn.energy < spawn.energyCapacity) {
                targets.push(spawn);
            }
            if(targets.length > 0){
                if(creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};