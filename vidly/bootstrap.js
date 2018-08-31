const genres = require('./routes/genres');

const genreList = [
    { id: 1, name: 'Thriller', description: 'Movies that increase the heart rate' },
    { id: 2, name: 'Rom-Com', description: 'Movies that will make your eyes well up with tears' }
];

for(var i = 0; i < genreList.length; i++){
    genres.database.createGenre(genreList[i]);
}