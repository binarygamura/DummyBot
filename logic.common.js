

module.exports = (() => {
    
    var harvestEnergy = (creep, source) => {
        if(!source){
            var sources = creep.room.find(FIND_SOURCES);
            if(sources.length > 0){
                source = sources[0];
            }
        }
        
        if(creep.harvest(source) === ERR_NOT_IN_RANGE){
            creep.moveTo(source);
        }        
    };
    
    return {
        harvestEnergy: harvestEnergy
    };
})();

