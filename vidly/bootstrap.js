const genres = require('./routes/genres');

const genreList = [
    { name: 'Thriller', description: 'Movies that increase the heart rate' },
    { name: 'Rom-Com', description: 'Movies that will make your eyes well up with tears' }
];

for(var i = 0; i < genreList.length; i++){
    genres.database.createGenre(genreList[i]);
}