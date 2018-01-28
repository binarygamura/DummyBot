
module.exports = (() => {
    
    /**
     * Generate some statistics about the creeps polulation.
     * This function should only be called once per tick, best directly at
     * the beginning of the game loop.
     */
    var generatePopulationStats = (roles) => {
        
        var stats = {
            roleStats: {
                other: 0
            }, 
            total: 0
        };
        _.keys(roles).forEach((roleName) => {
            stats.roleStats[roleName] = 0;
        });
                
        _.filter(Game.creeps, (creep) => creep.my).forEach((creep) => {
           if(creep.memory.role) {               
               var role = !_.isUndefined(stats.roleStats[creep.memory.role]) ? creep.memory.role : 'other';
               stats.roleStats[role]++;
               stats.total++;               
           }
        });
        console.log(JSON.stringify(stats));
        return stats;
    };
    
    var getMaxBody = (parts, maxEnergy) => {
        var energy = 0;
        _.takeWhile(parts, (part) => {
            if(!BODYPART_COST[part]){
                console.log('unable to get energy costs for part '+part);
                return false;
            }
            var cost = BODYPART_COST[part];
            if(energy + cost > maxEnergy){
                return false;
            }
            energy += cost;
            return true;
        });
    };
    
    
    var simpleSpawnStrategy = (spawn, roles) => {
        
        //initialize the memory of the source at the start of its life cycle.
        if(!spawn.memory.sources) {
            //assign at most two sources within the room to this spawn.
            spawn.memory.sources = {};
            var sources = spawn.room.find(FIND_SOURCES);
            if(sources.length){
                //sort the list of sources by distance.
                _.sortBy(sources, (source) => {
                    var path = PathFinder.search(source, spawn);
                    return (!path || path.incomplete) ? 2000 : path.cost;
                });
            };
            //take to two nearest resource sources.
            _.take(sources, 2).forEach((source) => {
                spawn.memory.sources[source.id] = [];
            });            
        }
        
        var creepToSpawn = null;
        
        for(var sourceId in spawn.memory.sources){
            
            var harvesters = spawn.memory.sources[sourceId];
            if(harvesters.length < 3){
                creepToSpawn = {
                    role: 'harvester', 
                    sourceId: sourceId, 
                    spawnId: spawn.id, 
                    init: false,
                    body: [WORK, CARRY, MOVE, WORK]};
                break;
            }
        }        
        
        var stats = generatePopulationStats(roles);
        
        
        if(!creepToSpawn){
            if(stats.roleStats.builder < 4) {            
                creepToSpawn = creepToSpawn = {
                        role: 'builder', 
                        body: [WORK, CARRY, MOVE, WORK]};
                }
        }
        
        
         if(!creepToSpawn){
            if(stats.roleStats.upgrader < 2) {            
                creepToSpawn = creepToSpawn = {
                        role: 'upgrader', 
                        body: [WORK, CARRY, MOVE, WORK]};
                }
        }
        
        if(!creepToSpawn){
            if(stats.roleStats.drone < 6) {            
                creepToSpawn = creepToSpawn = {
                        role: 'drone', 
                        body: [ATTACK, ATTACK, MOVE, MOVE]};
                }
        }
        
        if(!creepToSpawn){
            if(stats.roleStats.repair < 2) {            
                creepToSpawn = creepToSpawn = {
                        role: 'repair', 
                        body: [WORK, CARRY, MOVE, WORK]};
                }
        }
        
        
        if(spawn.energy === spawn.energyCapacity && creepToSpawn) {
            
            var name = spawn.spawnCreep(creepToSpawn.body, creepToSpawn.role+"_"+Game.time,{memory: _.pick(creepToSpawn, ['role', 'sourceId', 'spawnId'])});
            if(!(name < 0)){
                console.log("created new spawn!");
            }
            else {
                console.log("failed! "+name);
            }
        }
    };
    
    return {
      generatePopulationStats: generatePopulationStats,
      simpleSpawnStrategy: simpleSpawnStrategy
    };    
})();