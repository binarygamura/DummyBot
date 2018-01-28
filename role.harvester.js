var behaviour = require('logic.common');

module.exports = (() => {
    
    return {
        
        getBestCreep: () => {
            return [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK];
        },
        
        cleanUp: (creepName) => {
            console.log('a harvester has died!');
            if(!Memory.creeps[creepName].spawnId){
                return;
            }
            //remove the died creep from its assoc. table (creep -> energy source)
            var parentSpawn = Game.getObjectById(Memory.creeps[creepName].spawnId);
            var test = parentSpawn.memory.sources[Memory.creeps[creepName].sourceId];
            parentSpawn.memory.sources[Memory.creeps[creepName].sourceId] = test.filter((e) => {
                return e !== creepName;
            });
        },

        run: (creep) => {
            
            //initialize creep. assign us to the source (into the spawns memory).
            if(!creep.spawning && !creep.memory.init && creep.memory.spawnId ){
                var spawn = Game.getObjectById(creep.memory.spawnId);
                spawn.memory.sources[creep.memory.sourceId].push(creep.name);
                creep.memory.init = true;
                creep.memory.id = creep.id;
            }


            //if the harvester travels across a field without a road, he 
            //should create a construction site.
            var structures = creep.room.lookAt(creep.pos);
            var roadsBelow = _.some(structures, (structure) => structure.type === 'structure' && structure.structure.structureType === STRUCTURE_ROAD);
            var constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

            //but only create a construction site if we dont built too
            //much already.
            if(!creep.spawning && roadsBelow === 0 && constructionSites.length < 3) {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
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

                if(targets.length === 0){
                    var extensions = creep.room.find(FIND_STRUCTURES, {
                        filter: (extension) => extension.energy < extension.energyCapacity && 
                                (extension.structureType === STRUCTURE_EXTENSION || extension.structureType === STRUCTURE_TOWER)
                    });
                    if(extensions.length){
                        creep.say('🔌');
                        targets.push(extensions[0]);
                    }
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
    }
})();
