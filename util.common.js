module.exports = (() => {
    
    var clearMemory = () => {
        for(var name in Memory.creeps){
            if(!Game.creeps[name]){
                if(Memory.creeps[name].role){
                    switch(Memory.creeps[name].role) {
                        case 'harvester':
                            console.log('a harvester has died!');
                            var parentSpawn = Game.getObjectById(Memory.creeps[name].spawnId);
                            var test = parentSpawn.memory.sources[Memory.creeps[name].sourceId];
                            parentSpawn.memory.sources[Memory.creeps[name].sourceId] = test.filter((e) => {
                                return e !== name;
                            });
                            break;
                    }
                }

                delete Memory.creeps[name];
            }
        }
    };
    
    return {
        clearMemory: clearMemory
    }
})();

