const mixerOauth = require('mixer-shortcode-oauth');
const mixerInteractive = require('beam-interactive-node2');
const ws = require('ws');
const fs = require('fs');
const gc = require('./gameClient.js');
const utilities = require('./utilities.js');

const authFile = "mixer_auth.json";

const scenesArray = [
    {
        sceneID: 'default',
        controls: [],
        containers: []
    }
];


function main() {
    fs.readFile(
        authFile,
        {
            encoding: 'utf-8'
        },
        (error, contents) => {
            if (error) {
                errorMessage = 'Error loading auth token: ' + error + '\n';
                errorMessage += 'Ensure mixer_auth.json file exists.';
                utilities.logFatal(errorMessage);
            }

            try {
                authToken = JSON.parse(contents);
                if (typeof authToken.oauthClient !== 'string') {
                    utilities.logFatal('OAuth Client is not defined in mixer_auth.json');
                }

                if (typeof authToken.versionID !== 'number') {
                    utilities.logFatal('versionID is not defined in mixer_auth.json');
                }

                const authInfo = {
                    client_id: authToken.oauthClient,
                    client_secret: null,
                    scopes: [
                        'interactive:manage:self',
                        'interactive:play',
                        'channel:teststream:view:self',
                        'interactive:robot:self'
                    ]
                };

                const store = new mixerOauth.LocalTokenStore(__dirname + '/mixertoken.json');
                const auth = new mixerOauth.ShortcodeAuthClient(authInfo, store);
                auth.on('code', code => {
                    utilities.log(`Go to https://mixer.com/go?code=${code} `);
                });

                auth.on('authorized', (token) => {
                    utilities.log('Got token!');

                    mixerInteractive.setWebSocket(ws);
                    client = new mixerInteractive.GameClient();

                    gc.setMixerClient(client);
                    client.on('open', gc.onInteractiveOpen);
                    client.on('error', gc.onInteractiveError);

                    client.open({
                        authToken: token.access_token,
                        versionId: authToken.versionID
                    }).then(() => {
                        client.on('error', gc.onInteractiveError); // Gotta do this twice?
                        client.on('message', gc.onInteractiveMessage);
                        client.getScenes().then(() => {
                            client.updateScenes({
                                scenes: scenesArray
                            })
                        }).then(() => {
                            client.ready()
                                .then(gc.onInteractiveReady)
                                .catch(gc.onInteractiveError);

                        }).catch(gc.onInteractiveError);
                    }).catch(gc.onInteractiveError);
                });

                auth.on('expired', () => {
                    utilities.logFatal('Auth request expired');
                });

                auth.on('declined', () => {
                    utilities.logFatal('Auth request declined');
                });

                auth.on('error', (e) => {
                    utilities.logFatal('Auth error: ' + e);
                });

                auth.doAuth();
            } catch (e) {
                utilities.log('Error processing token: ' + e);
                process.exit(1);
            }
        }
    );
}

main();

