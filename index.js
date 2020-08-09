const dotenv = require('dotenv');
const { DirectThreadEntity, IgApiClient } = require('instagram-private-api');

const ig = new IgApiClient();
// ig.state.generateDevice(process.env.IG_USERNAME);
dotenv.config();

async function login() {
    // basic login-procedure
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
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
    await login();

    // get the first thread
    const [thread] = await ig.feed.directInbox().records();

    console.log(thread);

    await sendMessage(thread);
    // await sendVideo(thread);
    // await sendPhotoStory(thread);
    // await sendVideoStory(thread);
})();
