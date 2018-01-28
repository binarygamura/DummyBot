module.exports = (() => {
    
    return {
        cleanUp: (creep) => {

        },

        run: (creep) => {

            var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(enemy) {
                if(creep.attack(enemy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemy);
                }
            }
            else {
                if(Game.flags['Army']){
                    return creep.moveTo(Game.flags['Army']);
                }
                console.log('unable to move army. pls create a flag "Army" to avoid getting your spawn clogged by creeps.');
                
            }
        }
    }
})();

