/**
 * Memorama, Match Match, Match Up, Memory, Pelmanism, Shinkei-suijaku, Pexeso or simply Pairs
 */

const cities = ['Prague', '...'];
cities = cities.concat(cities);
cities.sort(() => {
  return 0.5 - Math.random();
});