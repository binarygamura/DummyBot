module.exports = (() => {
    
    //logic for a single tower. attack the closest enemy if present and repair
    //structures near by.
    var handleTower = (tower) => {
        var enemy = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(enemy) {
            tower.attack(enemy);
        }
        
        var damagedStructure = tower.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        })
        if(damagedStructure) {
            tower.repair(damagedStructure);
        }
    };
    
    
    //iterate over every tower within the game and apply logic to our ones.
    var handleTowers = () => {
        _.filter(Game.structures, (structure) => {
            return structure.my && structure.structureType === STRUCTURE_TOWER;
        }).forEach(handleTower);
    };
    
    return {
        handleTowers: handleTowers
    };
})();

