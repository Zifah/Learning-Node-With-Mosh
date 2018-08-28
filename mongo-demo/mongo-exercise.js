const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Error while connecting to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    return await Course
        .find({
            isPublished: true
        })
        .or([
            {
                price: {
                    $gte: 15
                }
            }, { name: /by/i }
        ])
        .sort('-price')
        .select(['name', 'author', 'price']);
}

async function run() {
    console.log(await getCourses());
}

run();