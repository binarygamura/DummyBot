var common = require('logic.common');

module.exports = (() => {
    
    const STATE_HARVESTING = 'harvesting';
    
    const STATE_MOVE_TO_DEST = 'destination';
    
    const STATE_TRANSFER = 'transfer';
    
    const HARVEST_PRIOS = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER ];
    
    var findBestEnergyTarget = function(creep) {
        var spawn = Game.getObjectById(creep.memory.spawnId);
        if(spawn.energy < spawn.energyCapacity) {
            return spawn;
        }
        var target = false;
        var energyConsumers = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => 
            structure.my &&
            (structure.energy < structure.energyCapacity) && 
            (structure.structureType === STRUCTURE_TOWER  || 
            structure.structureType === STRUCTURE_EXTENSION)
        });
        if(energyConsumers && energyConsumers.length > 0){
            var structures = _.groupBy(energyConsumers, (consumer) => consumer.structureType);
            _.forEach(HARVEST_PRIOS, (structureType) => {
                common.debug(creep, 'checking '+structureType);
                if(structures[structureType]) {
                    var temp = _.sortBy(structures[structureType], (structure) => structure.energy - structure.energyCapacity);
                    if(temp.length > 0){
                        target = temp[0];
                        return false;
                    }                    
                }                
            });
        }
        if(!target) {            
            target = creep.room.controller;
        }
        return target;
    };
    
    var run2 = (creep) => {
        
        //initialize creep. assign it to the source (into the spawns memory).        
        if(!creep.spawning && !creep.memory.init && creep.memory.spawnId ){
            var spawn = Game.getObjectById(creep.memory.spawnId);
            spawn.memory.sources[creep.memory.sourceId].push(creep.name);
            creep.memory.init = true;
            creep.memory.id = creep.id;
        }

        creep.memory.state = creep.memory.state || STATE_HARVESTING;
        
        //if the harvester travels across a field without a road, he 
        //should create a construction site.
        var structures = creep.room.lookAt(creep.pos);
        var roadsBelow = _.some(structures, (structure) => structure.type === 'structure' && structure.structure.structureType === STRUCTURE_ROAD);
        var constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

        //but only create a construction site if we dont built too
        //much already.
        if(!creep.spawning && !roadsBelow  && constructionSites.length < 3) {
            console.log('created new road construction site at ('+creep.pos.x+'/'+creep.pos.y+')');
            creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
        }
        
        switch(creep.memory.state) {
            case STATE_HARVESTING:
                if(creep.carry.energy === creep.carryCapacity) {
                    delete creep.memory.target;
                    creep.memory.state = STATE_MOVE_TO_DEST;
                }
                else {
                    if(!creep.memory.target) {
                        common.debug(creep, 'setting new target');
                        var bestSource = Game.getObjectById(creep.memory.sourceId);
                        if(bestSource.energy === 0) {
                            bestSource = false;
                            var temp = creep.room.find(FIND_SOURCES_ACTIVE);
                            if(temp.length) {
                                bestSource = temp[0];
                            }
                        }
                        if(bestSource) {
                            creep.memory.target = bestSource.id;
                        }
                    }
                    if(creep.memory.target) {
                        var resource = Game.getObjectById(creep.memory.target);
                        if(resource.energy > 0) {
                            var result = creep.harvest(resource, RESOURCE_ENERGY);
                            if(result === ERR_NOT_IN_RANGE){
                                creep.moveTo(resource); //, {visualizePathStyle: {stroke: '#009933', opacity: 1}} );
                            }
                        }
                        else {
                            delete creep.memory.target;
                        }
                    }
                }
                break;
            case STATE_MOVE_TO_DEST:
                if(creep.carry.energy === 0) {
                    creep.memory.state = STATE_HARVESTING;
                    delete creep.memory.target;
                }
                else {
                    var target;
                    if(!creep.memory.target){
                        target = findBestEnergyTarget(creep);
                        common.debug(creep, 'finding next destination!');
                        if(target){                            
                            creep.memory.target  = target.id;
                            common.debug(creep, 'set new target to '+target.id);
                        }
                    }
                    if(creep.memory.target) {
                        target = target || Game.getObjectById(creep.memory.target);
                        if(target.energy === target.energyCapacity && (target.structureType !== STRUCTURE_CONTROLLER)){
                            common.debug(creep, 'target is full!'+target.id);
                            delete creep.memory.target;
                        }
                        else {
                            var result = creep.transfer(target, RESOURCE_ENERGY);
                            if(result === ERR_NOT_IN_RANGE) {
                                //{visualizePathStyle: {stroke: '#dc143c', opacity: 1}}
                                creep.moveTo(target);
                            }
                            else if(result === ERR_FULL) {
                                delete creep.memory.target;
                            }
                        }
                    }
                }                    
                break;
        }
    };
    
    return {
        
        getBestCreep: () => {
            return [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, CARRY, WORK, CARRY, WORK];
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

        run: run2
    }
})();
