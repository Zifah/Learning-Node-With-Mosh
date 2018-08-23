async function displayCommits() {
    try {
        const user = await getUser(1);
        const repositories = await getRepositories(user.gitHubUsername);
        const commits = await getCommits(repositories[0]);
        console.log('Commits:', commits);
    }

    catch(err){
        console.log('Error', err);
    }
}

console.log('Before');
displayCommits();
console.log('After');


function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Reading a user from a database...');
            resolve({ id: id, gitHubUsername: 'Zifah' });
        }, 2000);
    });
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Reading ${username}'s repositories from GitHub API`);
            // resolve(['repo1', 'repo2', 'repo3']);
            reject(new Error('Could not get the repos!'));
        }, 2000);
    });
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Fetching GitHub commits on repo: ${repo}`);
            resolve(['commit1']);
        }, 2000);
    });
}