const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost/playground', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'offline']
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function (value, callback) {
                setTimeout(() => {
                    const isValid = value && value.length > 0;
                    callback(isValid);
                }, 4000);
            },
            message: 'A course should have at least, one tag.'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () {
            return this.isPublished;
        }
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Machine Learning Course',
        author: 'Hafiz Adewuyi',
        category: '-',
        tags: null,
        isPublished: true,
        price: 15
    });

    try {
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message);
    }
}

async function getCourses() {
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

async function updateCourseQueryFirst(id) {
    const course = await Course.findById(id);

    if (!course) {
        console.log('Did not find a course with id: ', id);
        return;
    }

    course.isPublished = false,
        course.author = 'Another Author';
    const result = await course.save();
    console.log(result);
}

async function updateCourse(id) {
    const result = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: true
        }
    }, { new: true });

    console.log(result);
}

async function removeCourse(id) {
    const deleted = await Course.findByIdAndRemove(id);
    console.log('Deleted course:', deleted);
}

createCourse();