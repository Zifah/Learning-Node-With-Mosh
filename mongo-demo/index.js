const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost/playground', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', e));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'ReactJs Course',
        author: 'Mosh Hamedani',
        tags: ['angular', 'frontend'],
        isPublished: false
    });

    const result = await course.save();
    console.log(result);
}

async function getCourses(){
    var courses = await Course
    .find()
    .and([
        { author: /^Mosh/ },
        { author: /Hamedani$/ },
        { isPublished: true }
    ])
    .limit(10)
    .sort({ name: 1 })
    .countDocuments();
    console.log(courses);
}

async function updateCourseQueryFirst(id){
    const course = await Course.findById(id);

    if(!course){
        console.log('Did not find a course with id: ', id);
        return;
    }

    course.isPublished = false,
    course.author = 'Another Author';
    const result = await course.save();
    console.log(result);
}

async function updateCourse(id){
    const result = await Course.findByIdAndUpdate(id , {
        $set: {
            author: 'Jason',
            isPublished: true
        }
    }, { new: true });

    console.log(result);
}

updateCourse('5b842c7fc6870e52bcbec8c0');