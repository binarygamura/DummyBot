var behaviour = require('logic.common');


module.exports = (() => {
    
    return {
        
        priority: 1,
        
        cleanUp: (creep) => {
    
        },
        
        run: (creep) => {
            if(creep.memory.repair && creep.carry.energy === 0){
                creep.memory.repair = false;
                creep.say('start harvest...');
            } 
            if(!creep.memory.repair && creep.carry.energy === creep.carryCapacity) {
                creep.memory.repair = true;
                creep.say('start repair...');
            }

            if(creep.memory.repair){
                
                var damagedStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && (structure.structureType !== STRUCTURE_CONTROLLER)
                });
                if(damagedStructures.length){
                    if(creep.repair(damagedStructures[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(damagedStructures[0]);
                    }
                }
                
                if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }            
            }
            if(!creep.memory.repair) {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                behaviour.harvestEnergy(creep, source);
            }
        }
    };
})();

