function Random() {}

Random.yesOrNo = function(yesChance) {
  yesChance = yesChance || 0.5;
  return Math.random() < yesChance;
};

Random.getRandomIntExclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

Random.getRandomIntInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};

Random.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/**
 * Simulate attack using risk logic: each atacker-defesor pair generates a dice roll and 
 * only one will survive. The attack is successfull if all defensors die.
 * @param  {number} attackingPopulation
 * @param  {number} defendingPopulation
 * @return {Object} result - Result object.
 *         {number} result.attackerKills - How many attacker died?
 *         {number} result.defenderKills - How many defensors died?
 *         {boolean} result.attackWin - Attack successfull?
 */
Random.simulateRiskAttack = function(attackingPopulation, defendingPopulation) {
  var attacks = Math.min(attackingPopulation, defendingPopulation);
  var attackerKills = 0, defenderKills = 0;
  while (attacks-- > 0) {
    if (Random.yesOrNo()) {
      defenderKills++;
    } else {
      attackerKills++;
    }
  }
  return {
    attackerKills: attackerKills,
    defenderKills: defenderKills,
    attackWin: defenderKills === defendingPopulation
  }
};
