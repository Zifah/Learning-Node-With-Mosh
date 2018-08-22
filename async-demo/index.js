console.log('Before');
getUser(1, (user) => {
    console.log(user);
    getRepositories(user.gitHubUsername, (repositories) => {
        console.log(`${user.gitHubUsername}'s repositories: `, repositories);
    });
});
console.log('After');

function getUser(id, callback){
    setTimeout(() => {
        console.log('Reading a user from a database...');
        callback({ id: id, gitHubUsername: 'Zifah'});
    }, 2000);
}

function getRepositories(username, callback){
    setTimeout(() => {
        console.log(`Reading ${username}'s repositories from GitHub API`);
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
}