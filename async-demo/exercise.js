
async function sendEmailToCustomer(id) {
  const customerPromise = getCustomer(id);
  const moviesPromise = getTopMovies();
  const allPromises = await Promise.all([customerPromise, moviesPromise]);
  await sendEmail(allPromises[0].email, allPromises[1]);
}

sendEmailToCustomer(10);

function getCustomer(id) {
  return new Promise((resolve, reject) => {
    console.log('Fetching customer...');
    setTimeout(() => {
      const customer = {
        id: id,
        name: 'Mosh Hamedani',
        isGold: true,
        email: 'mosh-hamedani@gmail.com'
      };
      console.log('Customer: ', customer);
      resolve(customer);
    }, 4000);
  });
}

function getTopMovies() {
  return new Promise((resolve, reject) => {
    console.log('Fetching top movies...');
    setTimeout(() => {
      const movies = ['movie1', 'movie2'];
      console.log('Top movies: ', movies);
      resolve(movies);
    }, 4000);
  });
}

function sendEmail(email, movies) {
  return new Promise((resolve, reject) => {
    console.log(`Sending top movies to ${email}`);
    setTimeout(() => {
      resolve();
    }, 4000);
  });
}