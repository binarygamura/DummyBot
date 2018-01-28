var behaviour = require('logic.common');

module.exports = (() => {
    
    return {
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
            }
            else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                behaviour.harvestEnergy(creep, source);
            }        
        }
    }
})();

