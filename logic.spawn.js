
module.exports = (() => {
    
    const SPAWN_WORKERS_PER_SOURCE = 3;
    
    /**
     * Generate some statistics about the creeps polulation.
     * This function should only be called once per tick, best directly at
     * the beginning of the game loop.
     */
    var generatePopulationStats = (roles, spawn) => {
        
        var stats = {
            roleStats: {
                other: 0
            }, 
            total: 0
        };
        _.keys(roles).forEach((roleName) => {
            stats.roleStats[roleName] = 0;
        });
                
        _.filter(Game.creeps, (creep) => creep.my && (!spawn || (spawn.id === creep.memory.spawnId)))
            .forEach((creep) => {
                if(creep.memory.role) {               
                    var role = !_.isUndefined(stats.roleStats[creep.memory.role]) ? creep.memory.role : 'other';
                    stats.roleStats[role]++;
                    stats.total++;               
                }
             });
        return stats;
    };
    
    var getMaxBody = (parts, maxEnergy) => {
        var energy = 0;
        return _.takeWhile(parts, (part) => {
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
    
    
    var getNextCandiateRole = (spawn, stats) => {
        //first create some harvesters for each energy resource.
        for(var sourceId in spawn.memory.sources){
            
            var harvesters = spawn.memory.sources[sourceId];
            if(harvesters.length < Game.botConfig.spawns.harvesterPerSource){
                return nextRole = 'harvester';
            }
        }
        
        //Go through the predefined limits of creeps per spawn (see config.js)
        //Calculate for each role the number of creeps to spawn.
        var needed = _.mapValues(Game.botConfig.spawns.prefs, (min, key) => Math.max(0, min - stats.roleStats[key]));
        
        //filter out 'others' and 'harvesters' since we already handled harvesters
        //above.
        var nextRole = false;
        needed = _.omit(needed, ['other', 'harvester']);
        console.log("current: ",JSON.stringify(stats));
        console.log("needed: ",JSON.stringify(needed));
        _.find(needed, (value, key) => {
            if(value > 0) {
                nextRole = key;
                return true;
            }
            return false;
        });
        
        return nextRole;
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
        
        //dont bother about the next creep while spawning or being low on energy.
        if(spawn.spawning || spawn.room.energyCapacityAvailable > spawn.room.energyAvailable) {
            return;
        }
        
        var nextRole = getNextCandiateRole(spawn, generatePopulationStats(roles, spawn));
        
        
        if(nextRole){
            var nextCreep = {
                spawnId: spawn.id,
                body: getMaxBody(roles[nextRole].getBestCreep(), spawn.room.energyAvailable),
                role: nextRole
            };
            
            if(nextRole === 'harvester') {                
                for(var sourceId in spawn.memory.sources){            
                    var harvesters = spawn.memory.sources[sourceId];
                    if(harvesters.length < 3){
                        nextCreep.sourceId =  sourceId;
                        nextCreep.init = false;
                        break;
                    }
                }     
            }
            
            var name = spawn.spawnCreep(nextCreep.body, nextCreep.role+'_'+Game.time,{memory: _.omit(nextCreep, ['body'])});
            if(!(name < 0)){
                console.log('spawned new creep "'+name+'"');
            }
            else {
                console.log('failed to spawn creep error='+name, JSON.stringify(nextCreep));
            }
        }
    };
    
    return {
      generatePopulationStats: generatePopulationStats,
      simpleSpawnStrategy: simpleSpawnStrategy
    };    
})();