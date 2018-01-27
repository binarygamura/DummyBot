/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = (function(){
    
    var clearMemory = function(){
        for(var name in Memory.creeps){
            if(!Game.creeps[name]){
                if(Memory.creeps[name].role){
                    switch(Memory.creeps[name].role) {
                        case 'harvester':
                            console.log('a harvester has died!');
                            var parentSpawn = Game.getObjectById(Memory.creeps[name].spawnId);
                            var test = parentSpawn.memory.sources[Memory.creeps[name].sourceId];
                            parentSpawn.memory.sources[Memory.creeps[name].sourceId] = test.filter((e) => {
                                return e != name;
                            });
                            break;
                    }
                }

                delete Memory.creeps[name];
//                _.forEach(Game.spawns, (value, key) => {
//                    
//                });
            }
        }
    };
    
    return {
        clearMemory: clearMemory
    }
})();

