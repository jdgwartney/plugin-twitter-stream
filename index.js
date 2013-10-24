var _param = require('./param.json');
var _Stream = require('twitter-stream-oauth');

var _keywords = []; // keywords that we will track
var _users = [];  // users that we will track

var _kTweets = {}; // tweet history so we can capture stats
var _uTweets = {}; // user history so we can capture stats

function handleError(err) {
    console.log(err);
    process.exit(-1);
}

function arr2obj(arr) {
    var obj = {};
    arr.forEach(function(value) {
        obj[value] = 0;
    });
    return obj;
}

// validate the params
if (!_param.consumerKey)
    return handleError('Your `consumerKey` is missing');
if (!_param.consumerSecret)
    return handleError('Your `consumerSecret` is missing');
if (!_param.accessTokenKey)
    return handleError('Your `accessTokenKey` is missing');
if (!_param.accessTokenSecret)
    return handleError('Your `accessTokenSecret` is missing');
if (!_param.keywords && !_param.users)
    return handleError('Your `keywords` and `users` filter\'s are missing, what are we searching for?');

// set the default poll interval if it was missed
_param.pollInterval = _param.pollInterval || 1000;

// the twitter filter
var apiParams = {};

// parse the keyword filter
if (_param.keywords) {
    _param.keywords.forEach(function(k) {
        if (k) _keywords.push(k.toLowerCase());
    });

    if (_keywords.length > 0) {
        apiParams.track = _keywords.join(',');
    }

    _kTweets = arr2obj(_keywords);
}

// parse the user filter
if (_param.users) {

    var api = [];

    _param.users.forEach(function(u) {
        if (!u) return;
        if (u.indexOf('|') === -1 ) return;

        var user = u.split('|');
        _users.push(user[0].toLowerCase());
        api.push(user[1]);
    });

    if (api.length > 0) {
        apiParams.follow = api.join(',');
    }

    _uTweets = arr2obj(_users);
}

// create our filtered twitter stream
var _stream = new _Stream({
    consumer_key: _param.consumerKey,
    consumer_secret: _param.consumerSecret,
    access_token_key: _param.accessTokenKey,
    access_token_secret: _param.accessTokenSecret,
    api: 'filter',
    api_params: apiParams
});

// hook up the twitter stream
_stream.stream();

//stream JSON data
_stream.on('data', function(data) {

    if (!data)
        return;
    if (data.constructor !== Array)
        data = [data];

    // lower case the data so we only have to do it once
    data.forEach(function(tweet) {
        if (data.text)
            data.text = data.text.toLowerCase();
        if (data.user && data.user.screen_name)
            data.user.screen_name = data.user.screen_name.toLowerCase();
    });

    if (_keywords) {
        data.forEach(function(tweet) {
            _keywords.forEach(function(k) {
                if (tweet.text && tweet.text.indexOf(k) !== -1) {
                    if (!_kTweets[k])
                        _kTweets[k] = 1;
                    else
                        _kTweets[k] += 1;
                }
            });

        });
    }

    if (_users) {
        data.forEach(function(tweet) {
            _users.forEach(function(u) {
                if (tweet.user && tweet.user.screen_name && tweet.user.screen_name === u) {
                    if (!_uTweets[u])
                        _uTweets[u] = 1;
                    else
                        _uTweets[u] += 1;
                }
            });
        });
    }
});

//connected
_stream.on('connected', function(){
    console.log('Stream created');
});

//connection errors (request || response)
_stream.on('error', function(error){
    console.error('Connection error:');
    console.error(error);
});

//stream close event
_stream.on('close', function(error){
    console.log('Stream closed');
    console.log(error);
});

function poll() {

    var keywords = _kTweets;
    _kTweets = arr2obj(_keywords);
    var users = _uTweets;
    _uTweets = arr2obj(_users);

    if (Object.keys(keywords).length > 0) {
        Object.keys(keywords).forEach(function(k) {
            console.log('TWITTER_KEYWORD_COUNT %d %s', keywords[k], k);
        });
    }

    if (Object.keys(users).length > 0) {
        Object.keys(users).forEach(function(u) {
            console.log('TWITTER_USER_COUNT %d %s', users[u], u);
        });
    }

    setTimeout(poll, _param.pollInterval);
}

poll();
