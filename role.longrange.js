module.exports = (() => {
    
    
    var findFreeRoomId = function(creep) {
        var room = undefined;
        var spawn = Game.getObjectById(creep.memory.spawnId);
        var exits = Game.map.describeExits(spawn.room.name);
        _.forEach(exits, (roomName) => {
            if(!spawn.memory.neighbours[roomName]){
                spawn.memory.neighbours[roomName] = {
                    harvesters: []
                };
            }
            if(spawn.memory.neighbours[roomName].harvesters.length < Game.botConfig.spawns.lrHarvestersPerRoom) {
                room = Game.rooms[roomName].id;
                return false;
            }                    
        });
        return room;
        
    }
    
    return {
    
        getBestCreep: () => {
            return [MOVE, WORK, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, WORK, CARRY, MOVE];
        },
        
        cleanUp: (creepName) => {
            var spawn = Game.getObjectById(Memory.creeps[creepName].spawnId);
//            for(spawn.memory.neighbours) {
//                
//            }
            
        },
    
        run: (creep) => {
            if(creep.mempory.harvesting && creep.carry.energy == creep.carryCapacity) {
                creep.mempory.harvesting = false;
            }
            else if(!creep.memory.harvesting && creep.carry.energy == 0) {
                creep.mempory.harvesting = true;
            }
            
            
            if(creep.mempory.harvesting) {
                
            }            
            else {
                
            }
        }
    }
})();


