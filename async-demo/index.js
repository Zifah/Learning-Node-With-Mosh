console.log('Before');
getUser(1, displayUser);
console.log('After');

function displayRepositories(username, repositories){
    console.log(`${username}'s repositories: `, repositories);
}

function displayUser(user){
    console.log(user);
    getRepositories(user.gitHubUsername, displayRepositories);
}

function getUser(id, callback){
    setTimeout(() => {
        console.log('Reading a user from a database...');
        callback({ id: id, gitHubUsername: 'Zifah'});
    }, 2000);
}

function getRepositories(username, callback){
    setTimeout(() => {
        console.log(`Reading ${username}'s repositories from GitHub API`);
        callback(username, ['repo1', 'repo2', 'repo3']);
    }, 2000);
}