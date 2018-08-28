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

async function displayCourses() {
    const courses = await Course
        .find()
        .sort({ name: 1})
        .select([ 'name', 'author' ]);
    console.log(courses);
}

displayCourses();