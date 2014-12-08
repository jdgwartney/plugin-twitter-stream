Boundary Twitter Stream Plugin
------------------------------

To get statistics from Twitter, you need to setup a twitter application first to get the required API keys.

### Platforms
- Windows
- Linux
- OS X
- SmartOS

### Prerequisites
- node version 0.8.0 or later
- npm version 1.4.21 or later

### Plugin Setup

1. To create a new application go to the [create page](https://dev.twitter.com/apps/new).
2. Once you have your new twitter application generate the accessToken key and secret

### Plugin Configuration Fields

|Field Name         |Description                                                                                 |
|:------------------|:-------------------------------------------------------------------------------------------|
|Consumer Key       |Your Twitter Consumer Key                                                                   |
|Consumer Secret    |Your Twitter Consumer Secret                                                                |
|Access Token Key   |Your Twitter Access Token Key                                                               |
|Access Token Secret|Your Twitter Access Token Secret                                                            |
|Keyword Filter     |The keywords you want to profile                                                            |
|User Filter        |The user you want to profile, in the format screen_name|userId, ex. SteveMartinToGo|14824849|

### Metrics Collected

Tracks the keywords and user metrics from [twitter](http://www.twitter.com)

|Metric Name          |Description                             |
|:--------------------|:---------------------------------------|
|Twitter Keyword Count|The number of times a keyword is mention|
|Twitter User Count   |The number of times a user tweets       |
