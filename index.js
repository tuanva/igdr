const dotenv = require('dotenv');
const { IgApiClient, IgCheckpointError } = require('instagram-private-api');
const Bluebird = require('bluebird');
const inquirer = require('inquirer')

const ig = new IgApiClient();
// ig.state.generateDevice(process.env.IG_USERNAME);
dotenv.config();

async function login() {
    // basic login-procedure
    ig.state.generateDevice(process.env.IG_USERNAME);
    // await ig.simulate.preLoginFlow();

    const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    // console.log('login ok');

    return loggedInUser;
}

/**
 * Sends a regular photo to the thread
 * @param thread
 */
async function sendMessage(thread) {
    console.log(await thread.broadcastText({
        text: 'Hello ',
    }));
}

(async () => {

    Bluebird.try(async () => {
        const auth = await login();//.catch(e => console.log('Login unsuccessful.', e, e.stack));
        console.log(auth);


        const threads = await ig.feed.directInbox().records();

        console.log('List of direct messages: ', threads);

        threads.forEach(function (value) {
            console.log(value);
            // await sendMessage(thread);
        });


        // Create UserFeed instance to get loggedInUser's posts
        const userFeed = ig.feed.user(auth.pk);
        const myPostsFirstPage = await userFeed.items();
        console.log('Feeds', myPostsFirstPage);

        const followersFeed = ig.feed.accountFollowers(auth.pk);

        console.log(followersFeed);

        const wholeResponse = await followersFeed.request();
        console.log(wholeResponse); // You can reach any properties in instagram response
        const items = await followersFeed.items();
        console.log(items); // Here you can reach items. It's array.
        
    }).catch(IgCheckpointError, async () => {
        console.log(ig.state.checkpoint); // Checkpoint info here
        await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
        console.log(ig.state.checkpoint); // Challenge info here

        const { code } = await inquirer.prompt([
            {
                type: 'input',
                name: 'code',
                message: 'Enter code',
            },
        ]);
        console.log(await ig.challenge.sendSecurityCode(code));
    }).catch(e => console.log('Could not resolve checkpoint:', e, e.stack));

    // await sendVideo(thread);
    // await sendPhotoStory(thread);
    // await sendVideoStory(thread);
})();
