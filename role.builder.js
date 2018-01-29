var behaviour = require('logic.common');

module.exports = (() => {
    
    return {
        
        getBestCreep: () => {
            return [MOVE, WORK, CARRY, WORK, MOVE, WORK, CARRY, WORK, MOVE, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK];
        },
        
        cleanUp: (creep) => {

        },
        run: (creep) => {

            if(creep.memory.building && (creep.carry.energy === 0)) {
                creep.memory.building = false;
            }
            else if(!creep.memory.building && (creep.carry.energy === creep.carryCapacity)) {
                creep.memory.building = true;
            }

            if(creep.memory.building){            
                var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(constructionSite) {
                    if(creep.build(constructionSite) === ERR_NOT_IN_RANGE) {                    
                        creep.moveTo(constructionSite);
                    }
                }
                else {
                    var extensions = creep.room.find(FIND_STRUCTURES, {
                        filter: (extension) => extension.energy < extension.energyCapacity && 
                                (extension.structureType === STRUCTURE_EXTENSION)
                    });
                    if(extensions.length){
                        creep.say('🔌+');
                        if(creep.transfer(extensions[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {                    
                            creep.moveTo(extensions[0]);
                        }
                    }
                    else {
                         if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                }
            }
            else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                behaviour.harvestEnergy(creep, source);
            }        
        }
    }
})();

