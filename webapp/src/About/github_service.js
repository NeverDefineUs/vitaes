const { Octokit } = require("@octokit/core");
const token = require("./tokens.js")
const octokit = new Octokit({ auth: token.default });

const gh = {
    getCollaborators: async function() {                
        return octokit.request('GET /repos/:owner/:repo/collaborators', {
        owner: "NeverDefineUs",
        repo: "vitaes"
        }).then(response => {
            return response.data
        }).catch(err => {
            return err
        })
    },

    getContributorStats: async function() {              
        return octokit.request('GET /repos/:owner/:repo/stats/contributors', {
        owner: "NeverDefineUs",
        repo: "vitaes"
        }).then(response => {
            return response.data
        }).catch(err => {
            return err
        })
    }


}


export default gh;