
module.exports = (() => {
    
    var generatePopulationStats = () => {
        
        var stats = {
            roleStats: {
                builder: 0,
                harvester: 0,
                upgrader: 0,
                drone: 0,
                repair: 0,
                other: 0
            },
            total: 0
        };
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role){
                var role = !_.isUndefined(stats.roleStats[creep.memory.role]) ? creep.memory.role : 'other';
                stats.roleStats[role]++;
            }
            
        }
        console.log(JSON.stringify(stats));
        
        stats.total = stats.roleStats.builder 
                + stats.roleStats.harvester 
                + stats.roleStats.upgrader
                + stats.roleStats.drone
                + stats.roleStats.repair
                + stats.roleStats.other;
        return stats;
    };
    
    
    
    
    var simpleSpawnStrategy = (spawn) => {
        
        if(!spawn.memory.sources) {                              
            spawn.memory.sources = {};
            var sources = spawn.room.find(FIND_SOURCES);
            if(sources.length){
                _.sortBy(sources, (source) => {
                    var path = PathFinder.search(source, spawn);
                    return (!path || path.incomplete) ? 2000 : path.cost;
//                    return 0;
                });
            };
            
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
        
        var stats = generatePopulationStats();
        
        
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