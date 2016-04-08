// PlayReady and Widevine License Manager constructor
var LicenseManager = function (vid, pr_la_url, wv_la_url) {
    this.vid = vid;
    this.vid.licenseManager = this;
    this.licenseUrlPlayReady = pr_la_url;
    this.licenseUrlWidevine = wv_la_url;
    if (window.navigator.requestMediaKeySystemAccess) {
        // EME V2 (EdgeHTML+)
        console.log('setting \'encrypted\' event listener');
        vid.addEventListener('encrypted', this.onEncryptedRequest, false);
    }
    else {
        console.log("E11");
        // EME V1 (MSHTML)
        vid.addEventListener('msneedkey', this.getNewPrefixedKeySession, false);
    }
};

LicenseManager.prototype = {
    vid: null,
    LICENSE_TYPE_NONE: 0,
    LICENSE_TYPE_WIDEVINE: 1,
    LICENSE_TYPE_PLAYREADY: 2,
    licenseType: 0,
    licenseUrlPlayReady: 'http://192.168.0.10/license',
    licenseUrlWidevine: null,
    playReadyKeySystem: {
        keySystem: 'com.microsoft.playready',
        supportedConfig: [
            {
                initDataTypes: ['keyids', 'cenc'],
                audioCapabilities:
                    [
                        {
                            contentType: 'audio/mp4; codecs="mp4a"'
                        }
                    ],
                videoCapabilities:
                    [
                        {
                            contentType: 'video/mp4; codecs="avc1"'
                        }
                    ]
            }
        ]
    },
    widevineKeySystem: {
        keySystem: 'com.widevine.alpha',
        supportedConfig: [
            {
                initDataTypes: ['keyids', 'webm'],
                audioCapabilities:
                    [
                        {
                            contentType: 'audio/webm; codecs="opus"'
                        }
                    ],
                videoCapabilities:
                    [
                        {
                            contentType: 'video/webm; codecs="vp9"'
                        }
                    ]
            }
        ]
    },
    onEncryptedRequest: function (e) {
        console.log('onencrypted fired.');
        var lm = e.target.licenseManager;
        // If we have not created a mediaKeys object yet, do it now.
        if (lm.mediaKeys === undefined) {
            lm.initMediaKeys(e);
        }
        lm.handleSession(e.target, e.initDataType, e.initData);
    },
    initMediaKeys: function (e) {
        var that = this;
        this.mediaKeys = null;
        this.vid.pendingSessionData = [];

        // Try PlayReady
        navigator.requestMediaKeySystemAccess(this.playReadyKeySystem.keySystem, this.playReadyKeySystem.supportedConfig).then(function (keySystemAccess) {
            console.log('createMediaKeys (PlayReady)');
            that.licenseType = that.LICENSE_TYPE_PLAYREADY;
            //setLockAndMessage(true, 'Using unprefixed EME and PlayReady DRM.');
            keySystemAccess.createMediaKeys().then(function (createdMediaKeys) {
                that.onMediaKeyAcquired(that, createdMediaKeys);
            }).catch('createMediaKeys() failed');
        }, function () {
            // PlayReady didn't work. Try Widevine.
            navigator.requestMediaKeySystemAccess(that.widevineKeySystem.keySystem, that.widevineKeySystem.supportedConfig).then(function (keySystemAccess) {
                console.log('createMediaKeys (Widevine)');
                that.licenseType = that.LICENSE_TYPE_WIDEVINE;
                //setLockAndMessage(true, 'Using unprefixed EME and Widevine DRM.');
                keySystemAccess.createMediaKeys().then(function (createdMediaKeys) {
                    that.onMediaKeyAcquired(that, createdMediaKeys);
                }).catch('createMediaKeys() failed');
            }, function () { console.log('Your browser/system does not support the requested configurations for playing protected content.'); });
        });
    },
    onMediaKeyAcquired: function (prm, createdMediaKeys) {
        console.log('createMediaKeys success');
        prm.mediaKeys = createdMediaKeys;
        // Flush pending session data.
        for (var i = 0; i < prm.vid.pendingSessionData.length; i++) {
            var data = prm.vid.pendingSessionData[i];
            prm.getNewKeySession(createdMediaKeys, data.initDataType, data.initData);
        }
        prm.vid.pendingSessionData = [];
        prm.vid.setMediaKeys(createdMediaKeys);
    },
    handleSession : function(vid, initDataType, initData) {
        // If we have a mediaKeys object, we can just download a key.
        if (this.mediaKeys) {
            this.getNewKeySession(this.mediaKeys, initDataType, initData);
        }
        else
        {
            console.log('Storing pending session data');
            // Otherwise, we store the session data for when we get a key.
            vid.pendingSessionData.push({ initDataType: initDataType, initData: initData });
        }
    },
    clearEvents: function () {
        video.removeEventListener('encrypted', this.onEncryptedRequest, false);
    },
    downloadNewKey: function (url, keyMessage, callback) {
        console.log('downloadNewKey (xhr)');
        var challenge;
        var xhr = new XMLHttpRequest();
        var index = location.pathname.indexOf('testdrive');
        var finalUrl = url;
        if (index !== -1) {
            finalUrl = location.pathname.substr(0, index) + 'api/testdrive/proxy/?url=' + url;
        }
        xhr.open('POST', finalUrl);
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.response);
                } else {
                    throw 'XHR failed (' + url + '). Status: ' + xhr.status + ' (' + xhr.statusText + ')';
                }
            }
        };
        if (this.licenseType !== this.LICENSE_TYPE_WIDEVINE) {
            // For PlayReady CDMs, we need to dig the Challenge out of the XML.
            var keyMessageXml = new DOMParser().parseFromString(String.fromCharCode.apply(null, new Uint16Array(keyMessage)), 'application/xml');
            if (keyMessageXml.getElementsByTagName('Challenge')[0]) {
                challenge = atob(keyMessageXml.getElementsByTagName('Challenge')[0].childNodes[0].nodeValue);
            } else {
                throw 'Cannot find <Challenge> in key message';
            }
            var headerNames = keyMessageXml.getElementsByTagName('name');
            var headerValues = keyMessageXml.getElementsByTagName('value');
            if (headerNames.length !== headerValues.length) {
                throw 'Mismatched header <name>/<value> pair in key message';
            }
            for (var i = 0; i < headerNames.length; i++) {
                xhr.setRequestHeader(headerNames[i].childNodes[0].nodeValue, headerValues[i].childNodes[0].nodeValue);
            }
        }
        else
        {
            // For Widevine CDMs, the challenge is the keyMessage.
            challenge = keyMessage;
        }

        xhr.send(challenge);
    },
    getNewKeySession: function (mediaKeys, initDataType, initData) {
        console.log('createSession');
        var that = this;
        var keySession = mediaKeys.createSession();
        keySession.addEventListener('message', function (event) {
            console.log('onmessage');
            that.downloadNewKey(that.getLicenseUrl(), event.message, function (data) {
                console.log('event.target.update');
                event.target.update(data);
            });
        }, false);
        keySession.generateRequest(initDataType, initData).catch(function () {
            console.log('Unable to create or initialize key session. Your browser may not support the selected video\'s key system');
        });
    },
    getLicenseUrl: function () {
        if (this.licenseType === this.LICENSE_TYPE_PLAYREADY) {
            return this.licenseUrlPlayReady;
        }
        else if (this.licenseType === this.LICENSE_TYPE_WIDEVINE) {
            return this.licenseUrlWidevine;
        }
        return '';
    },
    getNewPrefixedKeySession : function (e) {
        var key_system = 'com.microsoft.playready';
        var that = this.licenseManager;
        if (!this.msKeys) {
            try {
                /* eslint-disable no-undef */
                this.msSetMediaKeys(new MSMediaKeys(key_system));
                /* eslint-enable no-undef */
                //setLockAndMessage(true, 'Using prefixed EME and PlayReady DRM.');
            } catch (ex) {
                throw 'Unable to create MediaKeys("' + key_system + '"). Verify the components are installed and functional. Original error: ' + ex.message;
            }
        } else {
            return;
        }
        var session = this.msKeys.createSession('video/mp4', e.initData);
        if (!session) {
            throw 'Could not create key session';
        }
        session.addEventListener('mskeymessage', function (event) {
            that.downloadNewKey(event.destinationURL, event.message.buffer, function (data) {
                session.update(new Uint8Array(data));
            });
        });
        session.addEventListener('mskeyerror', function () {
            throw 'Unexpected \'keyerror\' event from key session. Code: ' + session.error.code + ', systemCode: ' + session.error.systemCode;
        });
    }
};
