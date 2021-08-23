function logError(text, fatal) {
    console.error("(EE) " + text);

    if (typeof gtag === "function") {
        gtag('event', 'exception', {
            'description': text,
            'fatal': fatal // set to true if the error is fatal
        });
    }
}

// ------------------------------------------------------------------------------

var instantGamesInitialized = false;
var runtimeInitialized = false;

function tryToRun() {
    if (instantGamesInitialized === true && runtimeInitialized === true) {
        try {
            Module.callMain();
        } catch (error) {
            logError(error, true);
        }
    } else {
        setTimeout(function() {
            tryToRun();
        }, 500);
    }
}

window.onload = function() {
    tryToRun();
};

// -----------------------------------------------------------------------------

var UserInfo = {
    uid: "",
    name: "",
    photoUrl: "",
    lang: "ru"
};

var OKIG = {};

function onWindowResize() {
    if (!config.lockorientation) {
        return;
    }

    if (!OKIG.type || OKIG.type !== 'mobile') {
        return;
    }

    var w = window.innerWidth,
        h = window.innerHeight;

    if (w == 0 || h == 0) {
        return;
    }

    var isLandscape = config.lockorientation === 'landscape';
    var isValid = isLandscape ? (w > h) : (h > w);

    var rotateDevice = document.getElementById('rotateDevice');

    if (!rotateDevice && !isValid) {
        rotateDevice = document.createElement('div');
        rotateDevice.id = 'rotateDevice';
        rotateDevice.style = 'position:absolute; right:0; top:0; width:100%; height:100%; z-index:99999; background:coral; display:table; overflow:hidden;';
        document.body.appendChild(rotateDevice);

        var info = document.createElement('div');
        info.innerHTML = 'Rotate you device!<br/>ÐŸÐ¾Ð²ÐµÑ€Ð½Ð¸Ñ‚Ðµ Ð²Ð°ÑˆÐµ ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ð¾!';
        info.style = 'display:table-cell; text-align:center; vertical-align:middle; font-size:300%; color:white;';
        rotateDevice.appendChild(info);
    }

    if (rotateDevice) {
        rotateDevice.style.display = isValid ? "none" : "table";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var mobile = OKSDK.Util.getRequestParameters().mob;
    OKIG.type = mobile ? 'mobile' : 'portal';

    if (!mobile) {
        console.log('(II) FAPI starting');

        window.API_callback = function(method, result, data) {
            // console.log("-- API_callback: '" + method + "' result: '" + result + "' data: " + data);

            if (method === 'getPageInfo' && config.fitwindow) {
                var wi = JSON.parse(data);
                // console.log("(II) Window info: " + JSON.stringify(wi));

                FAPI.UI.scrollTo(wi.offsetLeft, wi.offsetTop);
                FAPI.UI.setWindowSize(wi.innerWidth, wi.innerHeight);
            }

            if (typeof Module.ccall === 'function') {
                if (method === 'showNotification') {
                    if ('showNotification' in OKIG) {
                        Module.ccall('onInvited', 'null', ['number','number'], [OKIG.showNotification,result === 'ok']);
                        delete OKIG.showNotification;
                    }
                } else if (method === 'postMediatopic') {
                    if ('postMediatopic' in OKIG) {
                        Module.ccall('onShared', 'null', ['number','number'], [OKIG.postMediatopic,result === 'ok']);
                        delete OKIG.postMediatopic;
                    }
                } else if (method === 'prepareMidroll') {
                    var isReady = data === 'ready' ? 1 : 0;
                    Module.ccall('onPrepareMidroll', 'null', ['number'], [isReady]);
                } else if (method === 'showMidroll') {
                    var isCompleted = data === 'complete' ? 1 : 0;
                    Module.ccall('onShowMidroll', 'null', ['number'], [isCompleted]);
                } else if (method === 'showPayment') {
                    if ('payment' in OKIG) {
                        if (result == 'cancel') {
                            Module.ccall('onOrderCancel', 'null', ['number','string'], [OKIG.payment.ptr, OKIG.payment.itemId]);
                        } else if (result == 'ok') {
                            Module.ccall('onOrderSuccess', 'null', ['number','string'], [OKIG.payment.ptr, OKIG.payment.itemId]);
                        } else {
                            Module.ccall('onOrderFail', 'null', ['number','string'], [OKIG.payment.ptr, OKIG.payment.itemId]);
                        }

                        delete OKIG.payment;
                    }
                }
            }
        };

        var rParams = FAPI.Util.getRequestParameters();
        // console.log("-- params: " + JSON.stringify(rParams));
        FAPI.init(rParams["api_server"], rParams["apiconnection"],
            function() {
                console.log("(II) FAPI.init initialized")//: '" + JSON.stringify(arguments) + "'");

                FAPI.UI.getPageInfo();

                FAPI.Client.call({
                    "method": "users.getCurrentUser",
                    "fields": "first_name,last_name,locale,pic128x128"
                }, function(method, result, data) {
                    // console.log("(II) FAPI.Client.call: " + JSON.stringify(result));

                    if (result) {
                        UserInfo.uid = result.uid;
                        UserInfo.name = result.first_name + ' ' + result.last_name;
                        UserInfo.photoUrl = result.pic128x128;
                        UserInfo.lang = result.locale;

                        // console.log("(II) UserInfo: " + JSON.stringify(UserInfo));
                        // console.log("(II) OKIG: " + JSON.stringify(OKIG));

                        instantGamesInitialized = true;
                    }
                });
            },
            function(error) {
                console.log("(EE) FAPI.init error: '" + JSON.stringify(error) + "'");
            }
        );
    } else {
        console.log('(II) OKSDK starting');

        if (config.lockorientation) {
            window.addEventListener('resize', onWindowResize, false);
            window.addEventListener('orientationchange', onWindowResize, false);
            onWindowResize();
        }

        window.addEventListener('message', function(event) {
            // console.log("Message listener args: '" + JSON.stringify(arguments) + "'");

            if ('postMediatopic' in OKIG) {
                if (event.data) {
                    // console.log("Share args: '" + event.data + "'");
                    try {
                        let data = JSON.parse(event.data);
                        let isShared = data.type == 'success' || data.id;
                        // console.log("Share result: '" + (isShared ? 'shared' : 'canceled') + "'");
                        Module.ccall('onShared', 'null', ['number','number'], [OKIG.postMediatopic,isShared]);
                        delete OKIG.postMediatopic;
                    } catch(e) {
                    }
                }
            }

            if ('showNotification' in OKIG) {
                if (event.data) {
                    // console.log("Invite args: '" + event.data + "'");
                    try {
                        let data = JSON.parse(event.data);
                        // console.log("Invite result: '" + data.code + "'");
                        Module.ccall('onInvited', 'null', ['number','number'], [OKIG.showNotification,data.code == 'OK']);
                        delete OKIG.showNotification;
                    } catch(e) {
                    }
                }
            }

            if ('payment' in OKIG) {
                function processLegacyPayment(event) {
                    return JSON.parse(event.data || "");
                }

                function processNewPayment(event) {
                    switch (event.data) {
                    case "payment=ok":
                        return {"type": "payment", "result": "ok"};
                    case "payment=cancel":
                        return {"type": "payment", "result": "cancel"};
                    default:
                        return {};
                    }
                }

                // Since we are using separate window when opening a payment, we should send/receive messages
                // to communicate with the opened window
                var result;
                try {
                    result = processLegacyPayment(event);
                } catch(e) {
                    result = processNewPayment(event);
                }
                if (result.type == 'payment') {
                    let paymentResult = result.result;
                    if (paymentResult == 'cancel') {
                        Module.ccall('onOrderCancel', 'null', ['number','string'], [OKIG.payment.ptr, OKIG.payment.itemId]);
                    } else if (paymentResult == 'ok') {
                        Module.ccall('onOrderSuccess', 'null', ['number','string'], [OKIG.payment.ptr, OKIG.payment.itemId]);
                    } else {
                        Module.ccall('onOrderFail', 'null', ['number','string'], [OKIG.payment.ptr, OKIG.payment.itemId]);
                    }
                    // let fromAndroid = result.fromAndroid || OKSDK.Util.isLaunchedFromOKApp();
                    // console.log('Payment returned result: ' + JSON.stringify(paymentResult) + '\n' + 'From android: ' + fromAndroid);
                }

                delete OKIG.payment;
            }

        }, false);

        OKSDK.init(config,
            function() {
                console.log("(II) OKSDK.init initialized")//: '" + JSON.stringify(arguments) + "'");

                OKSDK.REST.call("users.getCurrentUser", {
                        "fields": "first_name,last_name,locale,pic128x128"
                    },
                    function(status, data, error) {
                        // console.log("OKSDK.REST.call: '" + JSON.stringify(arguments) + "'");

                        if (status == "ok") {
                            UserInfo.uid = data.uid;
                            UserInfo.name = data.first_name + ' ' + data.last_name;
                            UserInfo.photoUrl = data.pic128x128;
                            UserInfo.lang = data.locale;

                            // console.log("UserInfo: " + JSON.stringify(UserInfo));
                            // console.log("OKIG: " + JSON.stringify(OKIG));

                            instantGamesInitialized = true;
                        } else if (status == "error") {
                            console.log("(EE) OKSDK.REST.call error: " + JSON.stringify(error));
                        }
                    });
            },
            function(error) {
                console.log("(EE) OKSDK.init error: '" + OKSDK.Util.toString(error) + "'");
            }
        );
    }
});

// ------------------------------------------------------------------------------

var Module = {
    noInitialRun: true,
    noExitRuntime: true,

    preRun: [],
    postRun: [],

    printErr: function(text) {
        if (arguments.length > 1) {
            text = Array.prototype.slice.call(arguments).join(' ');
        }

        logError(text, false);
    },

    onRuntimeInitialized: (function() {
        runtimeInitialized = true;

        window.addEventListener('mousedown', function(evt) {
            window.focus();
            evt.stopPropagation();
            evt.target.style.cursor = 'default';
        }, false);
    })(),

    canvas: (function() {
        var canvas = document.getElementById('canvas');
        return canvas;
    })(),

    setStatus: function(text) {},

    totalDependencies: 0,
    monitorRunDependencies: function(left) {}
};