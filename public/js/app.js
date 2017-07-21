//  JS Options {
"use strict";
/* global angular Materialize markdown moment*/
//  }
//  {
// ["$scope","$rootScope", "$routeParams", "userService","newObjectService","contextService","listService","skeletal service","angular library service"]
// ["other", "user", "commentURL", "postURL", "eventURL", "comment", "post", "event"]
//  }

var on = function(name, handler) {
    if(this._events.hasOwnProperty(name)) {
        this._events[name].push(handler);
    }
    else {
        this._events[name] = [handler];
    }
}
var invoke = function(name, args) {
    var res = [];
    if(!this._events.hasOwnProperty(name)) return;
    if (!args || !args.length) args = [];
    for (var fn of this._events[name]) {
        res.push(fn.apply(this, args));
    }
    return res;
}

var app = angular.module("jvent", ['ngRoute', 'ngRaven']);
// var app = angular.module("jvent", ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider

    .when('/', {
        controller  : 'eventListCtrl',
        controllerAs: 'eventsView',
        templateUrl : './views/event/list.html'
    })

    .when('/events', {
        controller  : 'eventListCtrl',
        controllerAs: 'eventsView',
        templateUrl : './views/event/list.html'
    })

    .when('/event/new', {
        controller  : 'newEventCtrl',
        controllerAs: 'newEventView',
        templateUrl : './views/event/new.html'
    })

    .when('/event/:eventURL', {
        controller  : 'eventCtrl',
        controllerAs: 'eventView',
        templateUrl : './views/event/page.html'
    })

    .when('/event/:eventURL/posts', {
        controller  : 'postListCtrl',
        controllerAs: 'postsView',
        templateUrl : './views/post/list.html'
    })

    .when('/event/:eventURL/post/new', {
        controller  : 'newPostCtrl',
        controllerAs: 'newPostView',
        templateUrl : './views/post/new.html'
    })

    .when('/event/:eventURL/post/:postURL', {
        controller  : 'postCtrl',
        controllerAs: 'postView',
        templateUrl : './views/post/page.html'
    })
    
    .when('/event/:eventURL/media', {
        controller  : 'mediaListCtrl',
        controllerAs: 'mediaListView',
        templateUrl : './views/media/list.html'
    })
    
    .when('/event/:eventURL/media/:mediaURL', {
        controller  : 'mediaCtrl',
        controllerAs: 'mediaView',
        templateUrl : './views/media/page.html'
    })

    .when('/event/:eventURL/debug', {
        controller  : 'debugCtrl',
        controllerAs: 'debugView',
        templateUrl : './views/event/debug.html'
    })

    .when('/event/:eventURL/users', {
        controller  : 'userListCtrl',
        controllerAs: 'userListView',
        templateUrl : './views/event/userlist.html'
    })

    .when('/me/events', {
        controller  : 'eventMembershipCtrl',
        controllerAs: 'eventMembershipView',
        templateUrl : './views/user/eventlist.html'
    })

    .when('/changepassword', {
        controller  : 'changePasswordCtrl',
        controllerAs: 'changePasswordView',
        templateUrl : './views/user/changepassword.html'
    })

    .when('/login', {
        controller  : 'loginCtrl',
        controllerAs: 'loginView',
        templateUrl : './views/user/login.html'
    })

    .when('/logout', {
        controller  : 'logoutCtrl',
        controllerAs: 'logoutView',
        templateUrl : './views/user/logout.html'
    })

    .when('/signup', {
        controller  : 'signUpCtrl',
        controllerAs: 'signUpView',
        templateUrl : './views/user/signup.html'
    })

    .otherwise({
        controller  : '404Ctrl',
        controllerAs: 'fourOFourView',
        templateUrl : './views/misc/404.html'
    });

}]);

//  Location Services {
app.service('urlService', function() {
    var apiURL = 'api/';
    var apiVersion = 'v0/';

    this.api = function() {
        return(apiURL+apiVersion);
    };

    this.event = function() {
        return(this.api() + 'event/');
    };
    this.eventURL = function(eventURL) {
        return(this.event() + eventURL + '/');
    };
    this.eventJoin = function(eventURL) {
        return(this.eventURL(eventURL) + 'join/');
    };
    this.eventUsers = function(eventURL) {
        return(this.eventURL(eventURL) + 'users/');
    };
    this.eventSettings = function(eventURL) {
        return(this.eventURL(eventURL) + 'settings/');
    };
    this.eventSettingsBackground = function(eventURL) {
        return(this.eventSettings(eventURL) + 'eventBackground/');
    };
    this.eventUsersRole = function(eventURL, role) {
        return(this.eventUsers(eventURL) + role + '/');
    };

    this.post = function(eventURL) {
        return(this.eventURL(eventURL) + 'post/');
    };
    this.postRanked = function(eventURL, rank) {
        return(this.post(eventURL) + '?rank=' + rank);
    };
    this.postURL = function(eventURL, postURL) {
        return(this.post(eventURL) + postURL + '/');
    };
    this.postURLVote = function(eventURL, postURL) {
        return(this.postURL(eventURL, postURL) + 'vote/');
    };

    this.media = function(eventURL) {
        return(this.eventURL(eventURL) + 'media/');
    };

    this.comment = function(eventURL, postURL) {
        return(this.postURL(eventURL, postURL) + 'comment/');
    };
    this.commentURL = function(eventURL, postURL, commentURL) {
        return(this.comment(eventURL, postURL) + commentURL + '/');
    };

    this.user = function() {
        return(this.api() + 'user/');
    };
    this.userEvents = function() {
        return(this.user() + 'events/');
    };
    this.userEventID = function(eventID) {
        return(this.userEvents() + eventID + '/');
    }
    this.userEventsRole = function(role) {
        return(this.userEvents() + 'role/' + role + '/');
    };
    this.userSignUp = function() {
        return(this.user() + 'signup/');
    };
    this.userChangePassword = function() {
        return(this.user() + 'changepassword/');
    };
    this.userAuthenticate = function() {
        return(this.user() + 'authenticate/');
    };
});

app.service('navService', function($location) {
    this.home = function() {
        $location.path('/');
    };
    this.events = function() {
        $location.path('/events');
    };
    this.event = function(eventURL) {
        $location.path('/event/' + eventURL);
    };
    this.posts = function(eventURL) {
        $location.path('/event/' + eventURL + '/posts');
    };
    this.post = function(eventURL, postURL) {
        $location.path('/event/' + eventURL + '/post/' + postURL);
    };
    this.newEvent = function() {
        $location.path('/event/new');
    };
    this.newPost = function(eventURL) {
        $location.path('/event/' + eventURL + '/post/new');
    };
    this.login = function() {
        $location.path('/login');
    };
    this.logout = function() {
        $location.path('/logout');
    };
    this.signup = function() {
        $location.path('/signup');
    };
});

app.service('validationService', function() {
    return function(value) {
        return {
            isLink: function() {
                var linkRegex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
                return linkRegex.test(value);
            },
            isEmail: function() {
                var emailRegex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
                return emailRegex.test(value);
            },
            inRange: function(min, max) {
                return(value>=min && value<=max);
            },
            min: function(min) {
                return(value>=min);
            },
            max: function(max){
                return(value<=max);
            },
            isIn: function(array) {
                return array.indexOf(value)!=-1;
            }
        }
    }
});
//  }

app.service('markdownService', function($sce) {
    // TODO
    var toHTML = function(markdownText) {
        //Convert to HTML and/or Sanitize and/or process
        return markdown.toHTML(markdownText);
    };
    this.returnMarkdownAsTrustedHTML = function(markdown) {
        if(!markdown) return;
        return $sce.trustAsHtml(toHTML(markdown));
    };
});

app.service('timeService', function() {
    //MomentJS encapsulation happens here.
    this.timeSinceString = function(time) {
        return moment(time).fromNow();
    };
    this.timeAsUTC = function(time) {
        return moment(time).toString();
    };
});



app.factory('userService', function($rootScope, urlService, $http, $q) {
    var obj = {};
    obj.authed = false;
    obj.authStore = null;
    obj.timeCreated = Date.now();
    obj._events = {};
    var logoutCallbacks = [];
    var getAuthStore = function() {
        var storage = [window.localStorage, window.sessionStorage];
        for(var i = 0; i<storage.length;i++) {
            if(storage[i].token) {
                return storage[i];
            }
        }
        return(null);
    };
    var setAuthStore = function(remainSignedIn) {
        if(remainSignedIn) {
            obj.authStore = window.localStorage;
        }
        else {
            obj.authStore = window.sessionStorage;
        }
    };
    var storeToken = function(token) {
        if(obj.authStore) {
            obj.authStore.token = token;
        }
    };
    var setAuthHeader = function(token) {
        console.log("Setting Auth Header");
        $http.defaults.headers.common['Authorization'] = 'JWT '+ token;
    };
    var deleteAuthHeader = function() {
        console.log("Deleting Auth Header");
        $http.defaults.headers.common['Authorization'] = '';
    };
    var getTokenFromServer = function(creds) {
        var req = {
            method: 'POST',
            url: urlService.userAuthenticate(),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'email='+creds.email+'&password='+creds.password,
        };
        return $http(req)
        .then(function(data) {
            return data.data.token;
        });
    };
    var loadUser = function() {
        console.log("Searching for User");
        obj.authStore = getAuthStore();
        if(obj.authStore){
            obj.authed = true;
            setAuthHeader(obj.authStore.token);
            $rootScope.authed = true;
            //Update user data in root scope
            obj.invoke("login");
            console.log("Loaded User");
        }
    };
    obj.invoke = invoke.bind(obj);
    obj.on = on.bind(obj);

    obj.isAuthed = function() {
        return(obj.authed);
    };
    obj.login = function(creds, options) {
        return getTokenFromServer(creds)
        .then(function(token) {
            setAuthStore(options.remainSignedIn);
            storeToken(token);
            setAuthHeader(token);
            //Update user data in root scope
            $rootScope.authed = true;
            obj.authed = true;
            return true;
        })
        .catch(function(error) {
            return false;
        });
    };
    obj.logout = function() {
        obj.authStore.removeItem("token");
        deleteAuthHeader();
        $rootScope.authed = false;
        //Delete user data in root scope
        obj.invoke("logout");
        obj.authed = false;
    };
    obj.register = function(user) {
        var req = {
            method: 'POST',
            url: urlService.userSignUp(),
            data: {
                user: user
            }
        };
        return $http(req)
        .then(function(data) {
            if(data.status == 201) {
                return {success: true, err: null};
            }
        });
    };
    obj.changePassword = function(oldpassword, newpassword) {
        var req = {
            method: 'POST',
            url: urlService.userChangePassword(),
            headers: {
                'oldpassword': oldpassword,
                'newpassword': newpassword
            }
        };
        return $http(req)
        .then(function(data) {
            console.log(data.data); //TODO: write handler
        });
    };
    obj.user = function() {
        return "Username here";
    };
    obj.validPassword = function(password, repassword) {
        if(!password){return false;}
        if(password == repassword){return(true);}
        else {return(false);}
    };
    loadUser();
    return(obj);
});

app.service('jventService', function(urlService, $http, $q) {
    this.createEvent = function(event) {
        var url = urlService.event();
        var data = {
            event: event
        };
        return $http.post(url, data)
        .then(function(response) {
            var eventURL = response.data.event.url;
            return eventURL;
        },
        function(response) {
            throw response.data; //HACK: Does this even make sense?
        });
    };
    this.setEventBackground = function(media, eventURL) {
        var url = urlService.eventSettingsBackground(eventURL);
        var data = {
            media: media
        };
        return $http.post(url, data)
        .then(function(response) {
            return;
            // TODO
        },
        function(response) {
            // TODO
        });
    }
    this.getEvents = function() {
        // $http.get('debugjson/events.json').then(function (data) {
        return $http.get(urlService.event())
        .then(function (data) {
            return data.data.events;
        });
    };
    this.getEvent = function(eventURL, moderator) {
        moderator = moderator ? 1 : 0;
        var req = {
            method: 'GET',
            url: urlService.eventURL(eventURL),
            headers: {
                'Moderator': moderator
            }
        };
        return $http(req)
        .then(function (data) {
            return data.data.event;
        });
    };
    this.joinEvent = function(eventURL) {
        var url = urlService.eventJoin(eventURL);
        return $http.patch(url)
        .then(function(response) {
            //Response
            return;
        },
        function(response) {
            throw Error(); //TODO: Describe error
        });
    };
    this.createPost = function(media, post, eventURL) {
        var url = urlService.post(eventURL);
        var data = {
            post: post,
        };
        if(!!media) {
            data.media = media;
        }
        return $http.post(url, data)
        .then(function(response){
            var res = {};
            res.postURL = response.data.post.url;
            if(response.data.media) {
                res.mediaURL = response.data.media.url;
            }
            return res;
        });
    };
    this.getPosts = function(eventURL) {
        var req = {
            method: 'GET',
            url: urlService.postRanked(eventURL, "hot"), //TODO: Temporary
        };
        return $http(req)
        .then(function(data) {
            return data.data.posts;
        });
    };
    this.getPost = function(postURL, eventURL) {
        var req = {
            method: 'GET',
            url: urlService.postURL(eventURL, postURL)
        };
        return $http(req)
        .then(function(data) {
            return data.data.post;
        });
    };
    this.createMedia = function(media, eventURL) {
        var url = urlService.media(eventURL);
        var data = {
            media: media
        };
        return $http.post(url, data)
        .then(function(response) {
            var mediaURL = response.data.media.url;
            return mediaURL;
        });
    };
    this.postVote = function(eventURL, postURL, direction) {
        var url = urlService.postURLVote(eventURL, postURL);
        var data = {
            direction: direction
        };
        return $http.patch(url, data)
        .then(function(response) {
            // TODO
        });
    };
    this.getUserList = function(eventURL, role) {
        var url = urlService.eventUsersRole(eventURL, role);
        return $http.get(url)
        .then(function(response) {
            return response.data;
        });
    };
    this.getEventMemberships = function() {
        var url = urlService.userEvents();
        return $http.get(url)
        .then(function(response) {
            return response.data;
        });
    };
    this.getEventMembershipByEventID = function(eventID) {
        var url = urlService.userEventID(eventID);
        return $http.get(url)
        .then(function(response) {
            return response.data;
        });
    }
    this.getEventMembershipsByRole = function(role) {
        var url = urlService.userEventsRole(role);
        return $http.get(url)
        .then(function(response) {
            return response.data;
        });
    };
});

app.service('mediaService', function($http) {
    return function(media) {
        /* var requestFunction = function() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://i.imgur.com/7hCs9b8.png', true);
            xhr.responseType = 'blob';

            xhr.onload = function(e) {
              if (this.status == 200) {
                var blob = new Blob([this.response], {type: 'image/png'});
                console.log(URL.createObjectURL(blob))
              }
            };
        }; */
        var requestFunction = function() {
            var config = {
                method: 'GET',
                url: media.link,
                responseType: 'blob',
                headers: {
                   'Authorization': undefined
                 },
            };
            return $http(config)
            .then(function(response) {
                var blob = new Blob([response.data], {type: response.headers('content-type')})
                return URL.createObjectURL(blob);
            });
        };
        var getMediaBlob = function() {
            return requestFunction();
        }
        return {
            getMediaBlob: getMediaBlob
        }
    }
});

//  Types {
app.service('Media', function($http, $q) {
    var Media = class {
        constructor(media) {
            this._events = {};
            this.on = on.bind(this)
            this.invoke = invoke.bind(this)
            this._time = {};
            this._ = media;
            this._time.fetch = Date.now();
            this.invoke("load");
        }

        getAsBlob() {
            var _this = this;
            return $q((resolve, reject) => {resolve()})
            .then(function() {
                if(_this._blobURL) return;
                var config = {
                    method: 'GET',
                    url: _this.link,
                    responseType: 'blob',
                    headers: {
                       'Authorization': undefined
                     },
                };
                return $http(config)
                .then(Media.blobifyResponseData)
                .then(function(blobURL) {
                    _this._blobURL = blobURL;
                    _this.invoke("blobURL-change", [blobURL]);
                });
            })
            .then(function() {
                return _this._blobURL;
            });
        }

        static blobifyResponseData(response) {
            var blob = new Blob([response.data], {type: response.headers('content-type')})
            var blobURL = URL.createObjectURL(blob);
            return blobURL;
        }

        get link() {
            return this._.link;
        }

    };
    return Media;
});

app.service('Event', function(jventService, $q) {
    var Event = class {
        constructor(event) {
            this._events = {};
            this.on = on.bind(this)
            this.invoke = invoke.bind(this)
            this._time = {};
            this._ = event;
            this._time.fetch = Date.now();
            this.invoke("load");
        }

        static deserializeArray(rawEventArray) {
            var EventObjectArray = [];
            for (var event of rawEventArray) {
                EventObjectArray.push(new Event(event));
            }
            return EventObjectArray;
        }

        get id() {
            return this._._id
        }
        get url() {
            return this._.url;
        }
        get visibility() {
            return this._.visibility;
        }
        get ingress() {
            return this._.ingress;
        }
        get name() {
            return this._.name;
        }
        get organizer() {
            return this._.organizer;
        }
        get byline() {
            return this._.byline;
        }
        get backgroundImage() {
            return this._.backgroundImage;
        }
        get eventMembership() {
            return this._eventMembership;
        }
        set backgroundImage(value) {
            this._.backgroundImage = value;
        }
        set eventMembership(value) {
            this._eventMembership = value;
        }

        join() {
            var promises = this.invoke("join");
            return $q.all(promises);
        }

    };
    return Event;
});

app.service('Post', function(jventService, $q) {
    var Post = class {
        constructor(post) {
            //initialize post
            this._events = {};
            this.on = on.bind(this)
            this.invoke = invoke.bind(this)
            this._time = {};
            this._ = post; //TODO: rename to _post?
            this._time.fetch = Date.now();
            this.invoke("load");
        }

        static fromPostURL(postURL, eventURL) {
            return jventService.getPost(postURL, eventURL)
            .then(function(post) {
                return new Post(post);
            });
        }
        static deserializeArray(rawPostArray) {
            var PostObjectArray = [];
            for (var post of rawPostArray) {
                PostObjectArray.push(new Post(post));
            }
            return PostObjectArray;
        }

        get url() {
            return this._.url;
        };
        get media() {
            return this._.media;
        }
        get time() {
            return this._.time;
        }
        get submitter() {
            return this._.submitter;
        }
        get title() {
            return this._.title;
        }
        get content() {
            return this._.content;
        }
        get vote() {
            return this._.vote;
        }
        set vote(v) {
            if(this._.vote!=v) {
                this._.vote = v;
                this.invoke("vote", [v]);
            }
        }

        comment(comment) {
            var promises = this.invoke("comment"); //Comment as eventArgs
            return $q.all(promises);
        }

        static getPost() {

        }
    }
    return Post;
});

app.service('EventMembership', function(jventService, $q) {
    var EventMembership = class {
        constructor(eventMembership) {
            //initialize post
            this._events = {};
            this.on = on.bind(this)
            this.invoke = invoke.bind(this)
            this._time = {};
            this._ = eventMembership._eventMembership; //TODO: rename to _eventMembership?
            this._time.fetch = Date.now();
            this.invoke("load");
        }

        getRoles() {
            return this._.roles;
        }
        hasRole(role) {
            if(!this.isFetched()) return false;
            return(this._.roles.indexOf(role)!=-1);
        }
        isFetched() {
            return(!!this._);
        }
        get eventURL() {
            return this._.event.url;
        }

        static deserializeArray(rawEventMembershipArray) {
            var EventMembershipObjectArray = [];
            for (var eventMembership of rawEventMembershipArray) {
                EventMembershipObjectArray.push(new EventMembership(eventMembership));
            }
            return EventMembershipObjectArray;
        }
        static deserializeObject(rawEventMembershipObject) {
            return new EventMembership(rawEventMembershipObject);
        }
    }
    return EventMembership;
})
//  }

//  List Providers {
app.factory('eventListService', function(jventService, eventMembershipService, userService, Event, Media, $q) {
    var eventListService = {};
    var lastQuery = {};
    var lastUpdate;
    eventListService.query = {};
    eventListService.eventList = [];
    eventListService.cacheTime = 60000;
    eventListService.loadedEventList = false;
    var fresh = function() {
        return (Date.now() - lastUpdate) < eventListService.cacheTime;
    };
    var queryChange = function() {
        //TODO: compare eventListService.query and lastQuery
        return false;
    };
    var setEventList = function(rawEventList) {
        var newEventList = Event.deserializeArray(rawEventList);
        for (var event of newEventList) {
            if(event.backgroundImage) event.backgroundImage = new Media(event.backgroundImage);
            //TODO: Set eventMembership for event
            eventMembershipService.getEventMembership(event)
            .then(function(eventMembership) {
                event.eventMembership = eventMembership;
            })
        }
        userService.on("logout", function() {
            for (var event of newEventList) {
                event.eventMembership = null;
            }
        })
        eventListService.eventList = newEventList;
        lastUpdate = Date.now();
        eventListService.loadedEventList = true;
    };
    eventListService.getEventList = function() {
        return $q((resolve, reject) => {resolve()})
        .then(function() {
            if(queryChange() || !fresh()) {
                return jventService.getEvents()
                .then(function(rawEventList) {
                    setEventList(rawEventList);
                });
            }
        })
        .then(function() {
            return(eventListService.eventList);
        });
    };
    return eventListService;
});

app.factory('userMembershipService', function(userService, contextEvent, jventService, $q) {
    var userMembershipService = {};
    userMembershipService.userLists = {};
    userMembershipService.cacheTime = 60000;
    userMembershipService.roles = [];
    var updateRequired = function(userList) {
        return !((Date.now() - userList.lastUpdate) < userMembershipService.cacheTime);
    };
    var downloadAndCreateList = function(role) {
        return jventService.getUserList(contextEvent.event.url, role)
        .then(function(list) {
            var userList = {
                list: list,
                role: role,
                lastUpdate: Date.now(),
                //lastQuery: query
            };
            return userList;
        });
    };
    userMembershipService.getUserList = function(role) {
        return $q(function(resolve, reject) {
            var userList = userMembershipService.userLists[role];
            if(userList && !updateRequired(userList)) {
                resolve(userList);
            }
            else {
                downloadAndCreateList(role)
                .then(function(uL) {
                    resolve(uL);
                });
            }
        })
        .then(function(userList) {
            userMembershipService.userLists[role] = userList;
            return userList;
        });
    };
    userMembershipService.initialize = function(eventURL) {
        return contextEvent.getEvent(eventURL)
        .then(function(event) {
            //Check for moderator status.
            return event;
        })
        .then(function(event) {
            userMembershipService.roles = event.roles;
        });
    };
    return userMembershipService;
});

/*app.factory('eventMembershipService', function(userService, jventService, $q) {
    var eventMembershipService = {};
    eventMembershipService.eventLists = {};
    eventMembershipService.cacheTime = 60000;
    eventMembershipService.roles = [];
    var updateRequired = function(eventList) {};
    var downloadAndCreateList = function(role) {
        return jventService.getEventMembershipList(role)
        .then(function(list) {
            var eventList = {
                list: list,
                role: role,
                lastUpdate: Date.now()
                //lastQuery: query
            };
            return eventList;
        });
    };
    var getEventList = function(role) {
        return $q(function(resolve, reject) {
            var eventList = eventMembershipService.eventLists[role];
            if(eventList && !updateRequired(eventList)) {
                resolve(eventList);
            }
            else {
                downloadAndCreateList(role)
                .then(function(eL) {
                    resolve(eL);
                });
            }
        })
        .then(function(eventList) {
            eventMembershipService.eventLists[role] = eventList;
            return eventList;
        });
    };
    var isEventInList = function(list, eventURL) {
        //TODO: Better implementation
        for(var eventMembership of list) {
            if(eventMembership._eventMembership.event.url==eventURL) {
                return true;
            }
        }
        return false;
    };
    eventMembershipService.getEventList = getEventList;
    eventMembershipService.isEventRole = function(role, eventURL) {
        return $q(function(resolve, reject) {
            if(userService.authed) {
                getEventList(role)
                .then(function(eventList) {
                    resolve(isEventInList(eventList.list, eventURL));
                });
            }
            else {
                resolve(false);
            }
        });
    };
    userService.on("logout", function() {
        eventMembershipService.eventLists = {};
        eventMembershipService.roles = [];
    });
    return eventMembershipService;
});*/

app.factory('eventMembershipService', function(jventService, userService, EventMembership, $q) {
    var eventMembershipService = {};
    eventMembershipService.eventMemberships = {};
    eventMembershipService.cacheTime = 60000;
    eventMembershipService.initialFetch = false;
    eventMembershipService.fetchMembership = function(event) {
        return $q((resolve, reject) => {resolve()})
        .then(function() {
            return jventService.getEventMembershipByEventID(event.id)
        })
        .then(function(rawEventMembership) {
            return EventMembership.deserializeObject(rawEventMembership);
        });
    };
    eventMembershipService.fetchMemberships = function() {
        return $q((resolve, reject) => {resolve()})
        .then(function() {
            return jventService.getEventMemberships();
        })
        .then(function(rawEventMemberships) {
            return EventMembership.deserializeArray(rawEventMemberships);
        });
    };
    eventMembershipService.getEventMembership = function(event) {
        //Returns corresponding eventMembership, or nothing.
        return $q((resolve, reject) => {resolve()})
        .then(function() {
            if(!userService.authed) return null;
            var eventMembership = eventMembershipService.eventMemberships[event.url];
            if(eventMembership && eventMembership.isFetched()) return eventMembership;
            return eventMembershipService.fetchMembership(event)
            .then(function(fetchedMembership) {
                eventMembershipService.eventMemberships[event.url] = fetchedMembership;
                return fetchedMembership;
            });
        });
    };
    eventMembershipService.getEventMemberships = function() {
        //Returns all eventMemberships
        return $q((resolve, reject) => {resolve()})
        .then(function() {
            if(!userService.authed) return null;
            if(eventMembershipService.initialFetch) return eventMembershipService.eventMemberships;
            return eventMembershipService.fetchMemberships()
            .then(function(fetchedMemberships) {
                for (var fetchedMembership of fetchedMemberships) {
                    eventMembershipService.eventMemberships[fetchedMembership.eventURL] = fetchedMembership;
                }
                eventMembershipService.initialFetch = true;
                return eventMembershipService.eventMemberships;
            });
        });
    }
    eventMembershipService.retrieveEventMembership = function(eventURL) {
        return eventMembershipService.eventMemberships[eventURL];
    }

    userService.on("login", function() {
        //TODO: Fetch and store user's eventMemberships
        console.log("asdf");
    });
    userService.on("logout", function() {
        //Delete user's eventMemberships
        eventMembershipService.eventMemberships = {};
    });

    eventMembershipService.getEventMemberships();
    return eventMembershipService;
})

app.factory('userListService', function(contextEvent, jventService, $q) {
    var userListService = {};
    var lastQuery = {};
    var lastUpdate;
    userListService.userList; //TYPE?
    userListService.query = {};
    userListService.userListCollection = [];
    userListService.cacheTime = 60000;
    var fresh = function() {
        return (Date.now() - lastUpdate) < userListService.cacheTime;
    };
    var queryChange = function() {
        //TODO: compare eventListService.query and lastQuery
        return false;
    };
    var setUserList = function(userList) {
        userListService.userList = userList;
    };
    userListService.getUserList = function() {
        return $q(function(resolve, reject) {
            if(queryChange() || !fresh()) { // OR check if the query result has changed
                return jventService.getUserList()
                .then(function(userList) {
                    setUserList(userList);
                    return resolve(userList);
                });
            }
            else {
                return resolve(userListService.userList);
            }
        });
    };
    return userListService;
});

app.factory('postListService', function(Post, contextEvent, jventService, $q) {
    var postListService = {};
    var lastQuery = {};
    var lastUpdate;
    postListService.query = {};
    postListService.postList = [];
    postListService.cacheTime = 60000;
    postListService.loadedPostList = false;
    postListService.eventURL;
    var queryChange = function() {
        //TODO: compare postListService.query and lastQuery
        return false;
    };
    var eventChange = function(event) {
        return postListService.eventURL != event.url;
    };
    var fresh = function() {
        return (Date.now() - lastUpdate) < postListService.cacheTime;
    };
    var setPostList = function(rawPostList, event) {
        var newPostList = Post.deserializeArray(rawPostList);
        for (var post of newPostList) {
            post.on("vote", function(direction) {
                return jventService.postVote(contextEvent.event.url, this.url, direction);
            });
        }
        postListService.postList = newPostList;
        postListService.eventURL = event.url;
        lastUpdate = Date.now();
        postListService.loadedPostList = true;
    };
    var requiresUpdate = function() {
        return(queryChange() || !fresh());
    };
    postListService.getPostList = function(eventURL) {
        return contextEvent.getEvent(eventURL)
        .then(function(event) {
            if(requiresUpdate() || eventChange(event)) {
                return jventService.getPosts(eventURL)
                .then(function(rawPostList) {
                    setPostList(rawPostList, event);
                    return;
                });
            }
        })
        .then(function() {
            return({postList: postListService.postList});
        });
    };

    return postListService;
});
//  }

//  Context Providers {
app.factory('contextEvent', function(eventMembershipService, userService, Event, jventService, $q) {
    var contextEvent = {};
    contextEvent.event = {};
    contextEvent.cacheTime = 60000;
    contextEvent.loadedEvent = false;
    var lastUpdate;
    var fresh = function() {
        return (Date.now() - lastUpdate) < contextEvent.cacheTime;
    };
    var setEvent = function(event) {
        return $q((resolve, reject) => {resolve()})
        .then(function() {
            event.on("join", function() {
                console.log("Joining event");
                return jventService.joinEvent(event.url);
            });
            userService.on("logout", function() {
                event.eventMembership = null;
            });
            return eventMembershipService.getEventMembership(event)
            .then(function(eventMembership) {
                event.eventMembership = eventMembership;
                contextEvent.event = event;
                lastUpdate = Date.now();
                contextEvent.loadedEvent = true;
                return event;
            });
        })
    };
    var requiresUpdate = function(eventURL) {
        return(eventURL!=contextEvent.event.url||!fresh());
    };
    contextEvent.getEvent = function(eventURL) {
        return $q((resolve, reject) => {resolve()})
        .then(function() {
            var eventMembership = eventMembershipService.retrieveEventMembership(eventURL);
            if(!eventMembership) return false;
            return eventMembership.hasRole("moderator");
        })
        .then(function(result) {
            if(requiresUpdate(eventURL)) {
                return jventService.getEvent(eventURL, result)
                .then(function(rawEvent) {
                    return new Event(rawEvent);
                })
                .then(function(event) {
                    return setEvent(event);
                });
            }
            return contextEvent.event;
        });
    };
    // contextEvent.join = function() {
    //     return jventService.joinEvent(contextEvent.event.url);
    // };
    return contextEvent;
});

app.factory('contextPost', function(contextEvent, mediaService, Media, Post, jventService, $q) {
    var contextPost = {};
    contextPost.post = {};
    contextPost.cacheTime = 60000;
    contextPost.loadedPost = false;
    var lastUpdate;
    var fresh = function() {
        return (Date.now() - lastUpdate) < contextPost.cacheTime;
    };
    var setPost = function(post) {
        post.on("vote", function(direction) {
            return jventService.postVote(contextEvent.event.url, this.url, direction);
        });
        if(post.media && post.media.media) {
            post.media.media = new Media(post.media.media);
        }
        contextPost.post = post;
        lastUpdate = Date.now();
        contextPost.loadedPost = true;
    };
    // var resolveMedia = function() {
    //     return $q((resolve, reject) => {resolve()})
    //     .then(function() {
    //         mediaService(contextPost.post.media).getMediaBlob()
    //     })
    // }
    var requiresUpdate = function(postURL) {
        return(postURL!=contextPost.post.url||!fresh());
    }
    contextPost.getPost = function(postURL) {
        //Verify membership with contextEvent
        return $q((resolve, reject) => {resolve()})
        .then(function() {
            if(requiresUpdate(postURL)) {
                // return Post.fromPostURL(postURL, contextEvent.event.url)
                return jventService.getPost(postURL, contextEvent.event.url)
                .then(function(rawPost) {
                    return new Post(rawPost);
                })
                .then(function(post) {
                    setPost(post);
                    return post;
                });
            }
            return contextPost.post;
        })
        .then(function(post) {
            var response = {post: post};
            if(!post.media || !post.media.media) return response;
            response.mediaPromise = post.media.media.getAsBlob();
            return response;
        });
    };
    return contextPost;
});
//  }

//  New Providers {
app.factory('newEventService', function(userService, validationService, jventService) {
    var newEventService = {};
    var event = {};
    newEventService.event = event;
    newEventService.event.organizer = {
        name: userService.user()
    }; //Is this even required?
    newEventService.publish = function() {
        if(valid.all()) {
            return jventService.createEvent(newEventService.event)
            .then(function(eventURL) {
                reset();
                return(eventURL);
            });
        }
    };
    var reset = function() {
        newEventService.event = {};
    };
    var valid = {
        name: function() {
            return (!!event.name && validationService(event.name.length).inRange(4, 64));
        },
        byline: function() {
            if(!event.byline) return true;
            return validationService(event.byline.length).max(128);
        },
        description: function() {
            if(!event.description) return true;
            return validationService(event.description.length).max(1024);
        },
        visibility: function() {
            return validationService(event.visibility).isIn(["public", "unlisted", "private"]);
        },
        ingress: function() {
            return validationService(event.ingress).isIn(["everyone", "link", "invite"]);
        },
        comment: function() {
            return validationService(event.comment).isIn(["anyone", "attendee", "nobody"]);
        },
        all: function() {
            return (valid.name()&&valid.byline()&&valid.description()&&valid.visibility()&&valid.ingress()&&valid.comment());
        }
    };
    newEventService.valid = valid;
    return(newEventService);
});

app.factory('newMediaService', function(userService, contextEvent, validationService, jventService) {
    var newMediaService = {};
    var media = {};
    newMediaService.media = media;
    newMediaService.publish = function() {
        if(!valid.all()) throw Error("Validation Failed");
        return jventService.createMedia(newMediaService.media, contextEvent.event.url)
        .then(function(mediaURL) {
            reset();
            return(mediaURL);
        });
    };
    var valid = {
        link: function() {
            return validationService(newMediaService.   media.link).isLink();
        },
        all: function() {
            return (valid.link());
        }
    }
    newMediaService.valid = valid;
    newMediaService.initialized = function() {
        if(!newMediaService.media.link) return false;
        return newMediaService.media.link!="";
    }
    var reset = function() {
        newMediaService.media = {};
    };
    newMediaService.reset = reset;
    return(newMediaService);
});

app.factory('newPostService', function(userService, contextEvent, newMediaService, validationService, jventService) {
    var newPostService = {};
    var post = {};
    newPostService.post = post;
    newPostService.media = newMediaService.media;
    var publishPost = function() {
        if(!valid.all()) throw Error("Validation Failed");
        return jventService.createPost(undefined, newPostService.post, contextEvent.event.url)
        .then(function(response) {
            reset();
            return(response);
        });
    };
    var publishPostAndMedia = function() {
        if(!valid.all()||!newMediaService.valid.all()) throw Error("Validation Failed");
        return jventService.createPost(newMediaService.media, newPostService.post, contextEvent.event.url)
        .then(function(response) {
            reset();
            return(response);
        });
    };
    newPostService.publish = function() {
        if(newMediaService.initialized()) {
            return publishPostAndMedia();
        }
        else {
            return publishPost();
        }
    };
    var valid = {
        title: function() {
            return validationService(newPostService.post.title.length).inRange(1, 144);
        },
        all: function() {
            return (valid.title());
        }
    };
    newPostService.valid = valid;
    var reset = function() {
        newMediaService.reset();
        newPostService.post = {};
    };
    newPostService.reset = reset;
    return(newPostService);
});
//  }

//  Controllers {

app.controller('homeController', function($scope, $rootScope, eventMembershipService, userService, navService, $location) {
    $scope.homeClick = function() {
        navService.home();
    };
    $scope.createEventClick = function() {
        if(userService.authed) {
            navService.newEvent();
        }
        else {
            navService.login();
        }
    };
    $scope.loginClick = function() {
        navService.login();
    };
    $scope.logoutClick = function() {
        if(userService.authed) {
            navService.logout();
        }
    };
    $scope.settingsClick = function() {
        $location.path('/settings');
    };
    $scope.profileClick = function() {
        $location.path('/profile');
    };
    $scope.signupClick = function() {
        navService.signup();
    };
    $scope.userService = userService;
    // setInterval(function() {console.log(userService)}, 1000);
});

//Event
app.controller('eventListCtrl', function($scope, eventListService, navService, $q) {
    $scope.loadEventMedia = function(event) {
        return event.backgroundImage.getAsBlob()
        .then(function(blobURL) {
            event.image = blobURL;
        });
    }
    $scope.loadEvents = function(eventList) {
        //  TODO: Super temporary. Get rid of this crap.
        return $q((resolve, reject) => {resolve()})
        .then(function() {
            $scope.eventArray = eventList;
            var mediaPromises = [];
            for (let event of eventList) {
                if(!event.backgroundImage) continue;
                mediaPromises.push($scope.loadEventMedia(event));
            }
            return $q.all(mediaPromises);
        })
    }
    $scope.initialize = function() {
        return eventListService.getEventList()
        .then($scope.loadEvents);
    };
    $scope.initialize();
    // $scope.query = {
    //     find: {
    //         time: {
    //             enabled: false
    //         }
    //     }
    // };
    $scope.eventClick = function(eventURL) {
        navService.event(eventURL);
    };
    $scope.organizerClick = function(event) {
        //TODO: Navigate to page showing all events organised by event.organizer
        console.log(event);
    };
});

app.controller('newEventCtrl', function($scope, userService, newEventService, navService) {
    if(!userService.authed) {
        navService.login();
    }
    $scope.newEvent = newEventService.event;
    $scope.valid = newEventService.valid;
    $scope.newEventEnabled = function() {
        return !$scope.pendingRequest && $scope.valid.all();
    };
    $scope.pendingRequest = false;
    $scope.createEvent = function() {
        if(!$scope.pendingRequest) {
            $scope.pendingRequest = true;
            newEventService.publish()
            .then(function(eventURL) {
                navService.event(eventURL);
            },
            function(err) {
                for (var i = 0; i < err.length; i++) {
                    Materialize.toast(err[i].param + ' ' + err[i].msg, 4000);
                }
            })
            .finally(function() {
                $scope.pendingRequest = false;
            });
        }
    };
    //TODO: Migrate more functionality to eventCreate. Get rid of jventService from here
});

app.controller('eventCtrl', function($scope, $routeParams, contextEvent, markdownService, navService) {
    $scope.loaded = false;
    $scope.loadEvent = function(event) {
        $scope.event = event;
        $scope.loaded = true;
    };
    $scope.refresh = function() {
        return contextEvent.getEvent($routeParams.eventURL)
        .then($scope.loadEvent)
        .catch(function(error) {
            Materialize.toast(error.status + ' ' + error.statusText, 4000);
        });
    };
    $scope.refresh();
    $scope.descriptionAsHTML = markdownService.returnMarkdownAsTrustedHTML;

    $scope.joinPending = false;
    $scope.join = function() {
        //Make sure request can be made
        $scope.joinPending = true;
        contextEvent.event.join()
        .then(function() {
            //Redirect to content upon success
            console.log("Joined event");
        })
        .catch(function(err) {
            //err
        })
        .finally(function() {
            $scope.joinPending = false;
        });
    };
    $scope.view = function() {
        navService.posts(contextEvent.event.url);
    };

    var status = {
        joined: {
            text: "Joined",
            icon: "check",
            status: true
        },
        unjoined: {
            text: "Join",
            icon: "add",
            status: false
        }
    };
    $scope.joinedStatus = function() {
        if($scope.event.eventMembership && $scope.event.eventMembership.hasRole("attendee")) return status.joined;
        return status.unjoined;
    };
});

app.controller('userListCtrl', function($scope, $routeParams, userMembershipService) {
    $scope.selectedList = {};
    $scope.refresh = function() {
        return userMembershipService.initialize($routeParams.eventURL)
        .then(function() {
            $scope.roles = userMembershipService.roles;
        });
    };
    $scope.refresh();
    $scope.getUserList = function(role) {
        userMembershipService.getUserList(role)
        .then(function(userList) {
            $scope.selectedList = userList;
            console.log(userList);
        });
    };
});

app.controller('debugCtrl', function($scope, $routeParams, contextEvent, jventService) {
    $scope.loaded = false;
    $scope.loadEvent = function(event) {
        $scope.event = event;
        console.log($scope.event)
        $scope.loaded = true;
    };
    $scope.refresh = function() {
        return contextEvent.getEvent($routeParams.eventURL)
        .then($scope.loadEvent)
        .catch(function(error) {
            Materialize.toast(error.status + ' ' + error.statusText, 4000);
        });
    };
    $scope.refresh();
    $scope.setEventBackground = function() {
        var media = {
            link: $scope.backgroundLink
        }
        jventService.setEventBackground(media, $scope.event.url);
    }
})

//Post
app.controller('postListCtrl', function($scope, $routeParams, contextEvent, postListService, timeService, navService) {
    $scope.loaded = false;

    $scope.initialize = function() {
        contextEvent.getEvent($routeParams.eventURL)
        .then(function(event) {
            $scope.event = event;
            return postListService.getPostList($routeParams.eventURL)
            .then($scope.loadPosts);
        });
    };
    $scope.loadPosts = function(response) {
        $scope.postList = response.postList;
        $scope.loaded = true;
        //TODO: MEDIA?
    };

    $scope.newPost = function() {
        navService.newPost(contextEvent.event.url);
    };
    $scope.postClick = function(postURL) {
        navService.post(contextEvent.event.url, postURL);
    };
    $scope.submitterClick = function(post) {
        //TODO: Either navigate to user's profile, or user's activity within the event
        console.log(post);
    };

    $scope.resolveTimeString = function(time) {
        return timeService.timeSinceString(time);
    };
    $scope.resolveTime = function(time) {
        return timeService.timeAsUTC(time);
    };

    $scope.voteDirection = function(post) {
        return post.vote;
    };
    $scope.voteClick = function(direction, post) {
        if(direction==$scope.voteDirection(post)) {
            post.vote = 0;
        }
        else {
            post.vote = direction;
        }
    };

    $scope.initialize();
});

app.controller('newPostCtrl', function($scope, $routeParams, userService, newMediaService, newPostService, contextEvent, markdownService, navService) {
    if(!userService.authed) {
        navService.login();
    }
    newPostService.reset();
    $scope.refresh = function() {
        return contextEvent.getEvent($routeParams.eventURL)
        .then(function(event) {
            $scope.event = event;
        })
        .catch(function(error) {
            Materialize.toast(error.status + ' ' + error.statusText, 4000);
        });
    };
    $scope.refresh();
    $scope.descriptionAsHTML = markdownService.returnMarkdownAsTrustedHTML;
    $scope.newPost = newPostService.post;
    $scope.validPost = newPostService.valid;
    $scope.newMedia = newMediaService.media;
    $scope.validMedia = newMediaService.valid;
    $scope.newPostEnabled = function() {
        var validMedia = $scope.validMedia.all()
        return !$scope.pendingRequest && $scope.validPost.all() && (validMedia);
    };
    $scope.pendingRequest = false;
    $scope.createPost = function() {
        if(!$scope.pendingRequest) {
            $scope.pendingRequest = true;
            newPostService.publish()
            .then(function(response) {
                navService.post($scope.event.url, response.postURL);
            },
            function(err) {
                for (var i = 0; i < err.length; i++) {
                    Materialize.toast(err[i].param + ' ' + err[i].msg, 4000);
                }
            })
            .finally(function() {
                $scope.pendingRequest = false;
            });
        }
    };
});

app.controller('postCtrl', function($scope, $routeParams, contextPost, contextEvent, markdownService, timeService, navService, $sce, $window) {
    $scope.loaded = false;
    $scope.descriptionAsHTML = markdownService.returnMarkdownAsTrustedHTML;

    $scope.initialize = function() {
        contextEvent.getEvent($routeParams.eventURL)
        .then(function(event) {
            $scope.event = event;
            return contextPost.getPost($routeParams.postURL) // Where is event resolved?
            .then($scope.loadPost)
            .catch(function(error) {
                Materialize.toast(error.status + ' ' + error.statusText, 4000);
            });
        });
    };
    $scope.loadPost = function(response) {
        var post = response.post;
        $scope.post = post;
        $scope.loaded = true;
        if(!response.mediaPromise) return;
        response.mediaPromise
        .then(function(mediaBlobURL) {
            console.log(mediaBlobURL);
        })
    };

    $scope.titleClick = function() {
        $window.open(contextPost.post.link, "_self");
    };

    $scope.getTimeString = function(timeType) {
        if(!$scope.loaded) return "Somewhere back in time... or not.";
        var time = $scope.post.time[timeType];
        return timeService.timeSinceString(time);
    };
    $scope.getTime = function(timeType) {
        if(!$scope.loaded) return "Somewhere back in time... or not.";
        var time = $scope.post.time[timeType];
        return timeService.timeAsUTC(time);
    };

    $scope.voteDirection = function() {
        if(!$scope.post) return;
        return $scope.post.vote;
    };
    $scope.voteClick = function(direction) {
        if(direction==$scope.voteDirection()) {
            // contextPost.castVote(0);
            $scope.post.vote = 0;
        }
        else {
            $scope.post.vote = direction;
        }
    };

    $scope.initialize();
});

//Media
app.controller('mediaListCtrl', function($scope) {
    
});

app.controller('mediaCtrl', function($scope) {
    
});

//User
app.controller('signUpCtrl', function($scope, userService, navService) {
    if(userService.authed) {
        navService.home();
    }
    $scope.newUser = {};
    $scope.newUser.email;
    $scope.newUser.username;
    $scope.newUser.password;
    $scope.newUser.repassword;
    $scope.validPassword = function() {
        return userService.validPassword($scope.newUser.password, $scope.newUser.repassword);
    };
    $scope.createAccount = function () {
        if($scope.validPassword() && $scope.newUser.email && $scope.newUser.username) {
            userService.register($scope.newUser)
            .then(function(status) {
                if(status.success) {
                    navService.login();
                }
            });
        }
    };
});

app.controller('loginCtrl', function($scope, userService, navService) {
    $scope.email;
    $scope.password;
    $scope.remainSignedIn = false;
    $scope.signInPending = false;
    $scope.signIn = function() {
        if($scope.email && $scope.password) {
            $scope.signInPending = true;
            var creds = {
                email: $scope.email,
                password: $scope.password
            };
            userService.login(creds, {remainSignedIn:$scope.remainSignedIn})
            .then(function(success) {
                if (success) {
                    navService.home();
                }
            })
            .finally(function() {
                $scope.signInPending = false;
            });
        }
    };
    $scope.signUp = function() {
        navService.signup();
    };
    console.log(userService);
});

app.controller('logoutCtrl', function($scope, userService, navService) {
    if(userService.isAuthed) {
        userService.logout();
        navService.login();
    }
});

app.controller('eventMembershipCtrl', function($scope, eventMembershipService, navService) {
    $scope.selectedList = {};
    $scope.roles = ["attendee", "viewer", "invite", "moderator"];
    $scope.getEventList = function(role) {
        eventMembershipService.getEventList(role)
        .then(function(eventList) {
            $scope.selectedList = eventList;
            console.log(eventList);
        });
    };
    $scope.navigateEvent = function(eventURL) {
        navService.event(eventURL);
    };
});

app.controller('changePasswordCtrl', function($scope, userService) {
    $scope.oldpassword;
    $scope.password;
    $scope.repassword;
    $scope.changePassword = function() {
        if($scope.validPassword() && $scope.oldpassword) {
            userService.changePassword($scope.oldpassword, $scope.password)
            .then(function(status) {
                //TODO: Handle
            });
        }
    };
    $scope.validPassword = function() {
        return userService.validPassword($scope.password, $scope.repassword);
    };
});

//Error
app.controller('404Ctrl', function($scope, $location) {
    $scope.wrongPath = $location.path();
    $scope.redirect = function() {
        if($location.path()==$scope.wrongPath) {
            window.history.back();
        }
    };
    setTimeout($scope.redirect, 5000);
});
//  }
