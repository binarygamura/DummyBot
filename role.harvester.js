var behaviour = require('logic.common');

module.exports = (() => {
    
    return {
        cleanUp: (creepName) => {
            console.log('a harvester has died!');
            if(!Memory.creeps[creepName].spawnId){
                return;
            }            
            var parentSpawn = Game.getObjectById(Memory.creeps[creepName].spawnId);
            var test = parentSpawn.memory.sources[Memory.creeps[creepName].sourceId];
            parentSpawn.memory.sources[Memory.creeps[creepName].sourceId] = test.filter((e) => {
                return e !== creepName;
            });
        },

        run: (creep) => {

            if(!creep.spawning && !creep.memory.init && creep.memory.spawnId ){
                var spawn = Game.getObjectById(creep.memory.spawnId);
                spawn.memory.sources[creep.memory.sourceId].push(creep.name);
                creep.memory.init = true;
                creep.memory.id = creep.id;
            }


            var structures = creep.room.lookAt(creep.pos);

            var roadsBelow = _.filter(structures, {
                filter: (structure) =>  structure.type === 'structure' && structure.structure.structureType === STRUCTURE_ROAD
            });
            var constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

            if(!creep.spawning && roadsBelow.length === 0 && constructionSites.length < 3) {
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
                        filter: (extension) => extension.energy < extension.energyCapacity && extension.structureType === STRUCTURE_EXTENSION
                    });
                    if(extensions.length){
                        console.log('found a extension needing energy!');
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
