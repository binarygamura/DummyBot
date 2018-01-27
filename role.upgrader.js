var behaviour = require('logic.common');

module.exports = {
    run: function(creep){
        
        
        if(creep.memory.upgrading && creep.carry.energy === 0){
            creep.memory.upgrading = false;
            creep.say('start harvest...');
        } 
        if(!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('start upgrading...');
        }
        
        if(creep.memory.upgrading){
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }            
        }
        if(!creep.memory.upgrading) {
            behaviour.harvestEnergy(creep);
        }
    }
};


