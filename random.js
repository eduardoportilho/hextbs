function Random() {}

Random.yesOrNo = function(yesChance) {
  yesChance = yesChance || 0.5;
  return Math.random() < yesChance;
};

Random.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};
