//  JS Options {
"use strict";
/* global $ angular Materialize markdown moment Q URL Blob*/
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
};
var invoke = function(name, args) {
    var res = [];
    if(!this._events.hasOwnProperty(name)) return;
    if (!args || !args.length) args = [];
    for (var fn of this._events[name]) {
        res.push(fn.apply(this, args));
    }
    return res;
};

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
    let apiURL = 'api/';
    let apiVersion = 'v0/';

    this.api = ()=> `${apiURL}${apiVersion}`;

    this.event = ()=> `${this.api()}event/`;
    this.eventURL = (eventURL)=> `${this.event()}${eventURL}/`;
    this.eventJoin = (eventURL)=> `${this.eventURL(eventURL)}join/`;
    this.eventUsers = (eventURL)=> `${this.eventURL(eventURL)}users/`;
    this.eventSettings = (eventURL)=> `${this.eventURL(eventURL)}settings/`;
    this.eventSettingsBackground = (eventURL)=> `${this.eventSettings(eventURL)}eventBackground/`;
    this.eventUsersRole = (eventURL, role)=> `${this.eventUsers(eventURL)}${role}/`;

    this.post = (eventURL)=> `${this.eventURL(eventURL)}post/`;
    this.postRanked = (eventURL, rank)=> `${this.post(eventURL)}?rank=${rank}`;
    this.postURL = (eventURL, postURL)=> `${this.post(eventURL)}${postURL}/`;
    this.postURLVote = (eventURL, postURL)=> `${this.postURL(eventURL, postURL)}vote/`;

    this.media = (eventURL)=> `${this.eventURL(eventURL)}media/`;

    this.comment = (eventURL, postURL)=> `${this.postURL(eventURL, postURL)}comment/`;
    this.commentURL = (eventURL, postURL, commentURL)=> `${this.comment(eventURL, postURL)}${commentURL}/`;

    this.user = ()=> `${this.api()}user/`;
    this.userMe = ()=> `${this.user()}me/`;
    this.userMeevent = ()=> `${this.userMe()}event/`;
    this.userMeEventRole = (role)=> `${this.userMeevent()}role/${role}/`;
    this.userMeEventID = (eventID)=> `${this.userMeevent()}${eventID}/`;
    this.userMeEventPost = (eventID)=> `${this.userMeEventID(eventID)}post/`;
    this.userMeEventPostVotes = (eventID)=> `${this.userMeEventPost(eventID)}votes/`;
    this.userMeEventMedia = (eventID)=> `${this.userMeEventID(eventID)}media/`;
    this.userMePost = ()=> `${this.userMe()}post/`;
    this.userMePostVotes = ()=> `${this.userMePost()}votes/`;
    this.userMeMedia = ()=> `${this.userMe()}media/`;
    this.userMeChangePassword = ()=> `${this.userMe()}changepassword/`;

    this.userEvents = ()=> `${this.user()}events/`;
    this.userEventID = (eventID)=> `${this.userEvents()}${eventID}/`;
    this.userEventsRole = (role)=> `${this.userEvents()}role/${role}/`;
    this.userSignUp = ()=> `${this.user()}signup/`;
    this.userAuthenticate = ()=> `${this.user()}authenticate/`;
    
    this.service = ()=> `${this.api()}service/`;
    this.serviceMedia = ()=> `${this.service()}media/`;
    this.serviceMediaImage = ()=> `${this.serviceMedia()}image/`;
    this.serviceMediaImageToken = ()=> `${this.serviceMediaImage()}token/`;
});

app.service('navService', function($location) {
    this.home = ()=> $location.path(`/`);
    this.events = ()=> $location.path(`/events`);
    this.event = (eventURL)=> $location.path(`/event/${eventURL}`);
    this.posts = (eventURL)=> $location.path(`/event/${eventURL}/posts`);
    this.post = (eventURL, postURL)=> $location.path(`/event/${eventURL}/post/${postURL}`);
    this.newEvent = ()=> $location.path(`/event/new`);
    this.newPost = (eventURL)=> $location.path(`/event/${eventURL}/post/new`);
    this.login = ()=> $location.path(`/login`);
    this.logout = ()=> $location.path(`/logout`);
    this.signup = ()=> $location.path(`/signup`);
});
//  }

//  Auxiliary Service {
app.service('validationService', function() {
    return function(value) {
        return {
            isLink: ()=> {
                let linkRegex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
                return linkRegex.test(value);
            },
            isEmail: ()=> {
                let emailRegex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
                return emailRegex.test(value);
            },
            isVote: ()=> (value===-1||value===0||value===1),
            inRange: (min, max)=> (value>=min && value<=max),
            min: (min)=> (value>=min),
            max: (max)=> (value<=max),
            isIn: (array)=> (array.indexOf(value)!=-1),
            isOfType: (type)=> (typeof(value)==type),
            isOfObjectType: (type)=> (value.constructor.name==type)
        };
    };
});

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

app.service('dialogService', function() {
    this.networkError = function(error) {
        Materialize.toast(`${error.status} ${error.statusText}`, 4000);
    };
    this.paramMsgArrayError = function(error) {
        for (let err of error) {
            Materialize.toast(`${err.param} ${err.msg}`, 4000);
        }
    };
    this.genericError = function(error) {
        Materialize.toast(`${error.name}: ${error.message}`);
    };
    this.message = function(message) {
        Materialize.toast(message);
    };
});
//  }

//  Data Services {
app.factory('userService', function($rootScope, urlService, $http) {
    var userService = {};
    userService.authed = false;
    userService.authStore = null;
    userService.timeCreated = Date.now();
    userService._events = {};
    var logoutCallbacks = [];
    var getAuthStore = function() {
        let stores = [window.localStorage, window.sessionStorage];
        for(let store of stores) {
            if(store.token) {
                return store;
            }
        }
        return(null);
    };
    var setAuthStore = function(remainSignedIn) {
        if(remainSignedIn) {
            userService.authStore = window.localStorage;
        }
        else {
            userService.authStore = window.sessionStorage;
        }
    };
    var storeToken = function(token) {
        if(!userService.authStore) return;
        userService.authStore.token = token;
    };
    var setAuthHeader = function(token) {
        console.log("Setting Auth Header");
        $http.defaults.headers.common['Authorization'] = `JWT ${token}`;
    };
    var deleteAuthHeader = function() {
        console.log("Deleting Auth Header");
        $http.defaults.headers.common['Authorization'] = '';
    };
    var getTokenFromServer = async function(creds) {
        let req = {
            method: 'POST',
            url: urlService.userAuthenticate(),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: `email=${creds.email}&password=${creds.password}`,
        };
        let response = await $http(req);
        return response.data.token;
    };
    var loadUser = function() {
        console.log("Searching for User");
        userService.authStore = getAuthStore();
        if(userService.authStore){
            userService.authed = true;
            setAuthHeader(userService.authStore.token);
            $rootScope.authed = true;
            //Update user data in root scope
            userService.invoke("login");
            console.log("Loaded User");
        }
    };
    userService.invoke = invoke.bind(userService);
    userService.on = on.bind(userService);

    userService.isAuthed = function() {
        return(userService.authed);
    };
    userService.login = async function(creds, options) {
        try {
            let token = await getTokenFromServer(creds)
            setAuthStore(options.remainSignedIn);
            storeToken(token);
            setAuthHeader(token);
            //Update user data in root scope
            $rootScope.authed = true;
            userService.authed = true;
            return true;
        }
        catch (error) {
            return false;
        }
    };
    userService.logout = function() {
        userService.authStore.removeItem("token");
        deleteAuthHeader();
        $rootScope.authed = false;
        //Delete user data in root scope
        userService.invoke("logout");
        userService.authed = false;
    };
    userService.register = async function(user) {
        let req = {
            method: 'POST',
            url: urlService.userSignUp(),
            data: {
                user: user
            }
        };
        let response = await $http(req);
        if(response.status == 201) {
            return {success: true, err: null};
        }
    };
    userService.changePassword = async function(oldpassword, newpassword) {
        let req = {
            method: 'POST',
            url: urlService.userMeChangePassword(),
            headers: {
                'oldpassword': oldpassword,
                'newpassword': newpassword
            }
        };
        let response = await $http(req);
        console.log(response.data); //TODO: write handler
    };
    userService.user = function() {
        return "Username here";
    };
    userService.validPassword = function(password, repassword) {
        if(!password) return false;
        if(password == repassword) return(true);
        return(false);
    };
    loadUser();
    return(userService);
});

app.service('jventService', function(urlService, $http) {
    this.createEvent = async function(event) {
        let url = urlService.event();
        let data = {
            event: event
        };
        let response = await $http.post(url, data);
        return response.data.event.url;
    };
    this.setEventBackground = async function(media, eventURL) {
        let url = urlService.eventSettingsBackground(eventURL);
        let data = {
            media: media
        };
        let response = await $http.post(url, data);
    };
    this.getEvents = async function() {
        // $http.get('debugjson/events.json')
        let data = await $http.get(urlService.event());
        return data.data.events;
    };
    this.getEvent = async function(eventURL, moderator) {
        moderator = moderator ? 1 : 0;
        let req = {
            method: 'GET',
            url: urlService.eventURL(eventURL),
            headers: {
                'Moderator': moderator
            }
        };
        let data = await $http(req);
        return data.data.event;
    };
    this.joinEvent = async function(eventURL) {
        let url = urlService.eventJoin(eventURL);
        return await $http.patch(url);
    };
    this.createPost = async function(media, post, eventURL) {
        let url = urlService.post(eventURL);
        let data = {
            post: post,
        };
        if(!!media) data.media = media;
        let response = await $http.post(url, data);
        let res = {};
        res.postURL = response.data.post.url;
        if(response.data.media) {
            res.mediaURL = response.data.media.url;
        }
        return res;
    };
    this.getPosts = async function(eventURL) {
        let req = {
            method: 'GET',
            url: urlService.postRanked(eventURL, "hot"), //TODO: Temporary
        };
        let response = await $http(req);
        return response.data.posts;
    };
    this.getPost = async function(postURL, eventURL) {
        let req = {
            method: 'GET',
            url: urlService.postURL(eventURL, postURL)
        };
        let response = await $http(req);
        return response.data.post;
    };
    this.createMedia = async function(media, eventURL) {
        let url = urlService.media(eventURL);
        let data = {
            media: media
        };
        let response = await $http.post(url, data);
        return response.data.media.url;
    };
    this.postVote = async function(eventURL, postURL, direction) {
        let url = urlService.postURLVote(eventURL, postURL);
        let data = {
            direction: direction
        };
        let response = await $http.patch(url, data);
    };
    this.getUserList = async function(eventURL, role) {
        let url = urlService.eventUsersRole(eventURL, role);
        let response = await $http.get(url);
        return response.data;
    };
    this.getPostVotes = async function(eventURL) {
        let url = urlService.userMePostVotes();
        if(eventURL) url = urlService.userMeEventPostVotes(eventURL);
        let response = await $http.get(url);
        return response.data.votes;
    };
    this.getEventMemberships = async function() {
        let url = urlService.userEvents();
        let response = await $http.get(url);
        return response.data;
    };
    this.getEventMembershipByEventID = async function(eventID) {
        let url = urlService.userEventID(eventID);
        let response = await $http.get(url);
        return response.data;
    };
    this.getEventMembershipsByRole = async function(role) {
        let url = urlService.userEventsRole(role);
        let response = await $http.get(url);
        return response.data;
    };
    this.getImageUploadToken = async function(fileName, fileType) {
        let url = urlService.serviceMediaImageToken();
        let req = {
            url: url,
            method: "GET",
            params: {
                "fileName": fileName,
                "fileType": fileType
            }
        };
        let response = await $http(req);
        return response.data;
    };
});

app.service('awsService', function($http) {
    this.uploadImageToS3 = async function(image, signedRequestURL) {
        let blob = new Blob([image], {type: image.type});
        let config = {
            url: signedRequestURL,
            method: 'PUT',
            headers: {
                'Authorization': undefined,
                'Content-Type': image.type 
            },
            processData: false,
            data: blob,
            // transformRequest: angular.identity
        };
        let response = await $http(config);
        return response.data;
    };
});

app.service('mediaService', function($http) {
    return function(media) {
        var requestFunction = async function() {
            let config = {
                method: 'GET',
                url: media.link,
                responseType: 'blob',
                headers: {
                   'Authorization': undefined
                 },
            };
            let response = await $http(config);
            let blob = new Blob([response.data], {type: response.headers('content-type')});
            return URL.createObjectURL(blob);
        };
        var getMediaBlob = function() {
            return requestFunction();
        };
        return {
            getMediaBlob: getMediaBlob
        };
    };
});
//  }

//  Types {
app.service('Media', function($http, $q) {
    var Media = class {
        constructor(media) {
            this._events = {};
            this.on = on.bind(this);
            this.invoke = invoke.bind(this);
            this._time = {};
            this._ = media;
            this._time.fetch = Date.now();
            this.invoke("load");
        }

        async getAsBlob() {
            if(this._blobURL) return this._blobURL;
            let config = {
                method: 'GET',
                url: this.link,
                responseType: 'blob',
                headers: {
                   'Authorization': undefined
                 },
            };
            let response = await $http(config);
            this._blobURL = Media.blobifyResponseData(response);
            this.invoke("blobURL-change", [this._blobURL]);
            return this._blobURL;
        }

        static blobifyResponseData(response) {
            let blob = new Blob([response.data], {type: response.headers('content-type')});
            let blobURL = URL.createObjectURL(blob);
            return blobURL;
        }

        get link() {
            //TODO: find a more elegant solution
            console.warn("HACK: Changed link protocol arbitrarily");
            if(window.location.protocol=="https:") {
                return this._.link.replace("http:", "https:");
            }
            return this._.link;
        }

    };
    return Media;
});

app.service('Event', function(jventService, $q) {
    var Event = class {
        constructor(event) {
            this._events = {};
            this.on = on.bind(this);
            this.invoke = invoke.bind(this);
            this._time = {};
            this._ = event;
            this._time.fetch = Date.now();
            this.invoke("load");
        }

        static deserializeArray(rawEventArray) {
            let EventObjectArray = [];
            for (let event of rawEventArray) {
                EventObjectArray.push(new Event(event));
            }
            return EventObjectArray;
        }

        get id() {
            return this._._id;
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

        async join() {
            let promises = this.invoke("join");
            return await Promise.all(promises);
        }

    };
    return Event;
});

app.service('Post', function(jventService, validationService, $q) {
    var Post = class {
        constructor(post) {
            //initialize post
            this._events = {};
            this.on = on.bind(this)
            this.invoke = invoke.bind(this)
            this._time = {};
            this._ = post; //TODO: rename to _post?
            this._time.fetch = Date.now();
            this._vote = {
                object: undefined,
                direction: undefined
            }
            this.invoke("load");
        }

        static async fromPostURL(postURL, eventURL) {
            let post = await jventService.getPost(postURL, eventURL);
            return new Post(post);
        }
        static deserializeArray(rawPostArray) {
            let PostObjectArray = [];
            for (let post of rawPostArray) {
                PostObjectArray.push(new Post(post));
            }
            return PostObjectArray;
        }

        get id() {
            return this._._id;
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
            if(this._vote.object) return this._vote.object.direction;
            return this._vote.direction;
        }
        set vote(v) {
            if(typeof(v)=="object" && v.constructor.name=="PostVote") {
                this._vote.object = v;
                // this.invoke("vote", [v.direction]);
                this._vote.direction = undefined;
            }
            if(typeof(v)=="number" && validationService(v).isVote()) {
                this._vote.direction = v;
                this._vote.object = undefined;
                this.invoke("vote", [v]);
            }
        }

        async comment(comment) {
            let promises = this.invoke("comment"); //Comment as eventArgs
            return await Promise.all(promises);
        }

        static getPost() {

        }
    };
    return Post;
});

app.service('EventMembership', function(jventService) {
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
            let EventMembershipObjectArray = [];
            for (let eventMembership of rawEventMembershipArray) {
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
app.factory('eventListService', function(jventService, eventMembershipService, userService, Event, Media) {
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
    var setEventList = async function(rawEventList) {
        let newEventList = Event.deserializeArray(rawEventList);
        for (let event of newEventList) {
            if(event.backgroundImage) event.backgroundImage = new Media(event.backgroundImage);
            //TODO: Set eventMembership for event
            // event.eventMembership = await eventMembershipService.getEventMembership(event);
        }
        userService.on("logout", function() {
            for (let event of newEventList) {
                event.eventMembership = null;
            }
        })
        eventListService.eventList = newEventList;
        lastUpdate = Date.now();
        eventListService.loadedEventList = true;
    };
    eventListService.getEventList = async function() {
        if(queryChange() || !fresh()) {
            setEventList(await jventService.getEvents());
        }
        return(eventListService.eventList);
    };
    return eventListService;
});

app.factory('userMembershipService', function(userService, contextEvent, jventService) {
    var userMembershipService = {};
    userMembershipService.userLists = {};
    userMembershipService.cacheTime = 60000;
    userMembershipService.roles = [];
    var updateRequired = function(userList) {
        return !((Date.now() - userList.lastUpdate) < userMembershipService.cacheTime);
    };
    var downloadAndCreateList = async function(role) {
        let list = await jventService.getUserList(contextEvent.event.url, role);
        let userList = {
            list: list,
            role: role,
            lastUpdate: Date.now(),
            //lastQuery: query
        };
        return userList;
    };
    userMembershipService.getUserList = async function(role) {
        let userList = userMembershipService.userLists[role];
        if(!userList || updateRequired(userList)) {
            userList = await downloadAndCreateList(role);
        }
        userMembershipService.userLists[role] = userList;
        return userList;
    };
    userMembershipService.initialize = async function(eventURL) {
        let event = await contextEvent.getEvent(eventURL)
        //Check for moderator status.
        userMembershipService.roles = event.roles;
    };
    return userMembershipService;
});

app.factory('eventMembershipService', function(jventService, userService, EventMembership) {
    var eventMembershipService = {};
    eventMembershipService.eventMemberships = {};
    eventMembershipService.cacheTime = 60000;
    eventMembershipService.initialFetch = false;
    eventMembershipService.fetchMembership = async function(event) {
        let rawEventMembership = await jventService.getEventMembershipByEventID(event.id)
        return EventMembership.deserializeObject(rawEventMembership);
    };
    eventMembershipService.fetchMemberships = async function() {
        let rawEventMemberships = await jventService.getEventMemberships();
        return EventMembership.deserializeArray(rawEventMemberships);
    };
    eventMembershipService.getEventMembership = async function(event) {
        //Returns corresponding eventMembership, or nothing.
        if(!userService.authed) return null;
        let eventMembership = eventMembershipService.eventMemberships[event.url];
        if(eventMembership && eventMembership.isFetched()) return eventMembership;
        
        let fetchedMembership = await eventMembershipService.fetchMembership(event);
        eventMembershipService.eventMemberships[event.url] = fetchedMembership;
        return fetchedMembership;
    };
    eventMembershipService.getEventMemberships = async function() {
        //Returns all eventMemberships
        if(!userService.authed) return null;
        if(eventMembershipService.initialFetch) return eventMembershipService.eventMemberships;
        let fetchedMemberships = await eventMembershipService.fetchMemberships();
        for (let fetchedMembership of fetchedMemberships) {
            eventMembershipService.eventMemberships[fetchedMembership.eventURL] = fetchedMembership;
        }
        eventMembershipService.initialFetch = true;
        return eventMembershipService.eventMemberships;
    }
    eventMembershipService.retrieveEventMembership = function(eventURL) {
        return eventMembershipService.eventMemberships[eventURL];
    }

    userService.on("login", function() {
        //TODO: Fetch and store user's eventMemberships
    });
    userService.on("logout", function() {
        //Delete user's eventMemberships
        eventMembershipService.eventMemberships = {};
    });

    eventMembershipService.getEventMemberships();
    return eventMembershipService;
})

app.factory('postVoteService', function(jventService, userService) {
    var PostVote = class PostVote {
        constructor(postVote) {
            this._time = {};
            this._ = postVote;
            this._time.fetch = Date.now();
        }
        get direction() {
            return this._.direction;
        }
        get post() {
            return this._.post;
        }
        get event() {
            return this._.event;
        }
    };
    var postVoteService = class postVoteService {
        constructor() {
            this._ = {};
            this._.votes = {};
            this.fetchAllVotes();

            userService.on("login", ()=> {
                console.log("login")
            })
            userService.on("logout", ()=> {
                this.flushVotes();
            })
        }
        async fetchAllVotes() {
            let rawPostVoteArray = await jventService.getPostVotes();
            for (let rawPostVote of rawPostVoteArray) {
                let newPostVote = new PostVote(rawPostVote);
                this._.votes[newPostVote.post] = newPostVote;
            }
        }
        flushVotes() {
            this._.votes = {};
        }
        getVote(post) {
            return this._.votes[post.id];
        }
    };
    return new postVoteService();
});

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
    userListService.getUserList = async function() {
        if(queryChange() || !fresh()) { // OR check if the query result has changed
            let userList = await jventService.getUserList()
            setUserList(userList);
        }
        return userListService.userList;
    };
    return userListService;
});

app.factory('postListService', function(Post, contextEvent, postVoteService, jventService, $q) {
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
        let newPostList = Post.deserializeArray(rawPostList);
        for (let post of newPostList) {
            post.on("vote", function(direction) {
                return jventService.postVote(contextEvent.event.url, this.url, direction);
            });
            post.vote = postVoteService.getVote(post);
        }
        postListService.postList = newPostList;
        postListService.eventURL = event.url;
        lastUpdate = Date.now();
        postListService.loadedPostList = true;
    };
    var requiresUpdate = function() {
        return(queryChange() || !fresh());
    };
    postListService.getPostList = async function(eventURL) {
        let event = await contextEvent.getEvent(eventURL);
        if(requiresUpdate() || eventChange(event)) {
            let rawPostList = await jventService.getPosts(eventURL);
            setPostList(rawPostList, event);
        }
        return({postList: postListService.postList});
    };

    return postListService;
});
//  }

//  Context Providers {
app.factory('contextEvent', function(eventMembershipService, userService, Event, jventService) {
    var contextEvent = {};
    contextEvent.event = {};
    contextEvent.cacheTime = 60000;
    contextEvent.loadedEvent = false;
    var lastUpdate;
    var fresh = function() {
        return (Date.now() - lastUpdate) < contextEvent.cacheTime;
    };
    var setEvent = async function(event) {
        event.on("join", function() {
            console.log("Joining event");
            return jventService.joinEvent(event.url);
        });
        userService.on("logout", function() {
            event.eventMembership = null;
        });
        event.eventMembership = await eventMembershipService.getEventMembership(event);
        contextEvent.event = event;
        contextEvent.loadedEvent = true;
        lastUpdate = Date.now();
        return event;
    };
    var requiresUpdate = function(eventURL) {
        return(eventURL!=contextEvent.event.url||!fresh());
    };
    contextEvent.getEvent = async function(eventURL) {
        let eventMembership = eventMembershipService.retrieveEventMembership(eventURL);
        let result = false;
        if(eventMembership) result = await eventMembership.hasRole("moderator");
        if(requiresUpdate(eventURL)) {
            let rawEvent = await jventService.getEvent(eventURL, result);
            let event = new Event(rawEvent);
            await setEvent(event);
        }
        return contextEvent.event;
    };
    return contextEvent;
});

app.factory('contextPost', function(contextEvent, mediaService, postVoteService, Media, Post, jventService) {
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
        post.vote = postVoteService.getVote(post);
        if(post.media && post.media.media) {
            post.media.media = new Media(post.media.media);
        }
        contextPost.post = post;
        lastUpdate = Date.now();
        contextPost.loadedPost = true;
    };
    var requiresUpdate = function(postURL) {
        return(postURL!=contextPost.post.url||!fresh());
    }
    contextPost.getPost = async function(postURL) {
        //Verify membership with contextEvent
        if(requiresUpdate(postURL)) {
            let rawPost = await jventService.getPost(postURL, contextEvent.event.url);
            setPost(new Post(rawPost));
        }
        let post = contextPost.post;
        let response = {post: post};
        if(!post.media || !post.media.media) return response;
        response.mediaPromise = post.media.media.getAsBlob();
        return response;
    };
    return contextPost;
});
//  }

//  New Providers {
app.factory('newEventService', function(userService, validationService, jventService, awsService) {
    var newEventService = {};
    var event = {};
    newEventService.event = event;
    newEventService.event.organizer = {
        name: userService.user()
    }; //Is this even required?
    
    var publishImage = async function(image) {
        let response = await jventService.getImageUploadToken(image.name, image.type);
        await awsService.uploadImageToS3(image, response.signedRequest);
        return response.url;
    };
    newEventService.publish = async function() {
        if(!valid.all()) throw Error("Validation Failed");
        let eventURL = await jventService.createEvent(newEventService.event);
        if(newEventService.event.backgroundImage && valid.backgroundImage()) {
            let backgroundImageURL = await publishImage(newEventService.event.backgroundImage);
            await jventService.setEventBackground({link: backgroundImageURL}, eventURL);
        }
        reset();
        return(eventURL);
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
        backgroundImage: function() {
            return validationService(event.backgroundImage).isOfObjectType("File");
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
    newMediaService.publish = async function() {
        if(!valid.all()) throw Error("Validation Failed");
        let mediaURL = await jventService.createMedia(newMediaService.media, contextEvent.event.url);
        reset();
        return(mediaURL);
    };
    var valid = {
        link: function() {
            return validationService(newMediaService.media.link).isLink();
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
    var publishPost = async function() {
        if(!valid.all()) throw new Error("Validation Failed");
        let response = await jventService.createPost(undefined, newPostService.post, contextEvent.event.url)
        reset();
        return(response);
    };
    var publishPostAndMedia = async function() {
        if(!valid.all()||!newMediaService.valid.all()) throw new Error("Validation Failed");
        let response = await jventService.createPost(newMediaService.media, newPostService.post, contextEvent.event.url);
        reset();
        return(response);
    };
    newPostService.publish = async function() {
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
app.controller('homeController', function($scope, $rootScope, eventMembershipService, postVoteService, userService, navService, $location) {
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
});

//Event
app.controller('eventListCtrl', function($scope, eventListService, navService, $q) {
    $scope.loadEventMedia = async function(event) {
        event.image = await event.backgroundImage.getAsBlob();
    }
    $scope.loadEvents = async function(eventList) {
        //  TODO: Super temporary. Get rid of this crap.
        $scope.eventArray = eventList;
        // let mediaPromises = [];
        //  TODO: Decide whether to load event background sequentially, or in parallel.
        for (let event of eventList) {
            if(!event.backgroundImage) continue;
            // mediaPromises.push($scope.loadEventMedia(event)); //This one loads in parallel
            await $scope.loadEventMedia(event); //This one loads sequentially
        }
        // return $q.all(mediaPromises);
    }
    $scope.initialize = async function() {
        $scope.loadEvents(await eventListService.getEventList());
        $scope.$applyAsync();
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

app.controller('newEventCtrl', function($scope, userService, newEventService, dialogService, navService) {
    if(!userService.authed) {
        navService.login();
    }
    $scope.newEvent = newEventService.event;
    $scope.valid = newEventService.valid;
    $scope.newEventEnabled = function() {
        return !$scope.pendingRequest && $scope.valid.all();
    };
    $scope.pendingRequest = false;
    $scope.createEvent = async function() {
        if($scope.pendingRequest) return;
        try {
            $scope.pendingRequest = true;
            let eventURL = await newEventService.publish();
            navService.event(eventURL);
        }
        catch (error) {
            dialogService.paramMsgArrayError(error);
        }
        finally {
            $scope.pendingRequest = false;
            $scope.$applyAsync();
        }
    };
    $scope.backgroundImageChange = function(e) {
        let imageFiles = e.target.files[0];
        $scope.newEvent.backgroundImage = imageFiles;
        $scope.backgroundImagePreviewURL = URL.createObjectURL(imageFiles);
        //move $scope.backgroundImagePreviewURL to $scope.newEvent?
        $scope.$digest();
    };
    $scope.initialize = function() {
        $("#eventBackgroundImageUpload")[0].addEventListener('change', $scope.backgroundImageChange);
    };
    $scope.initialize();
    //TODO: Migrate more functionality to eventCreate. Get rid of jventService from here
});

app.controller('eventCtrl', function($scope, $routeParams, contextEvent, markdownService, dialogService, navService) {
    $scope.loaded = false;
    $scope.loadEvent = function(event) {
        $scope.event = event;
        $scope.loaded = true;
        $scope.$digest();
    };
    $scope.refresh = async function() {
        try {
            $scope.loadEvent(await contextEvent.getEvent($routeParams.eventURL));
        }
        catch (error) {
            dialogService.networkError(error);
        }
    };
    $scope.refresh();
    $scope.descriptionAsHTML = markdownService.returnMarkdownAsTrustedHTML;

    $scope.joinPending = false;
    $scope.join = async function() {
        //Make sure request can be made
        $scope.joinPending = true;
        try {
            await contextEvent.event.join();
            //Redirect to content upon success
            console.log("Joined event");
        }
        catch (error) {
            console.log(error);
        }
        finally {
            $scope.joinPending = false;
            $scope.$digest();
        }
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
    $scope.refresh = async function() {
        await userMembershipService.initialize($routeParams.eventURL);
        $scope.roles = userMembershipService.roles;
    };
    $scope.refresh();
    $scope.getUserList = async function(role) {
        let userList = await userMembershipService.getUserList(role);
        $scope.selectedList = userList;
        console.log(userList);
    };
});

app.controller('debugCtrl', function($scope, $routeParams, contextEvent, jventService, dialogService, postVoteService, awsService) {
    $scope.loaded = false;
    $scope.loadEvent = async function(event) {
        $scope.event = event;
        console.log($scope.event)
        console.log(postVoteService)
        await postVoteService.fetchAllVotes();
        $scope.loaded = true;
    };
    $scope.refresh = async function() {
        try {
            $scope.loadEvent(await contextEvent.getEvent($routeParams.eventURL));
        }
        catch (error) {
            dialogService.networkError(error)
        }
    };
    $scope.refresh();
    $scope.setEventBackground = async function() {
        // var media = {
        //     link: $scope.backgroundLink
        // }
        let image = $("#filePicker")[0].files[0];
        let response = await jventService.getImageUploadToken(image.name, image.type);
        await awsService.uploadImageToS3(image, response.signedRequest)
        await jventService.setEventBackground({link: response.url}, $scope.event.url);
    };
});

//Post
app.controller('postListCtrl', function($scope, $routeParams, contextEvent, postListService, timeService, navService) {
    $scope.loaded = false;

    $scope.initialize = async function() {
        let event = await contextEvent.getEvent($routeParams.eventURL);
        $scope.event = event;
        $scope.loadPosts(await postListService.getPostList($routeParams.eventURL));
    };
    $scope.loadPosts = function(response) {
        $scope.postList = response.postList;
        $scope.loaded = true;
        $scope.$digest();
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

app.controller('newPostCtrl', function($scope, $routeParams, userService, newMediaService, newPostService, contextEvent, markdownService, dialogService, navService) {
    if(!userService.authed) {
        navService.login();
    }
    newPostService.reset();
    $scope.refresh = async function() {
        try {
            $scope.event = await contextEvent.getEvent($routeParams.eventURL);
        }
        catch (error) {
            dialogService.networkError(error);
        }
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
    $scope.createPost = async function() {
        if($scope.pendingRequest) return;
        try {
            $scope.pendingRequest = true;
            let response = await newPostService.publish();
            navService.post($scope.event.url, response.postURL);
        }
        catch (error) {
            dialogService.genericError(error);
        }
        finally {
            $scope.$applyAsync();
            $scope.pendingRequest = false;
        }
    };
});

app.controller('postCtrl', function($scope, $routeParams, contextPost, contextEvent, markdownService, timeService, navService, dialogService, $sce, $window) {
    $scope.loaded = false;
    $scope.descriptionAsHTML = markdownService.returnMarkdownAsTrustedHTML;

    $scope.initialize = async function() {
        try {
            $scope.event = await contextEvent.getEvent($routeParams.eventURL);
            $scope.loadPost(await contextPost.getPost($routeParams.postURL)); // Where is event resolved?
        }
        catch (error) {
            dialogService.networkError(error)
        }
        $scope.$applyAsync();
    };
    $scope.loadPost = async function(response) {
        let post = response.post;
        $scope.post = post;
        $scope.loaded = true;
        if(!response.mediaPromise) return;
        let mediaBlobURL = await response.mediaPromise;
        console.log(mediaBlobURL);
    };

    $scope.titleClick = function() {
        $window.open(contextPost.post.link, "_self");
    };

    $scope.getTimeString = function(timeType) {
        if(!$scope.loaded) return "Somewhere back in time... or not.";
        let time = $scope.post.time[timeType];
        return timeService.timeSinceString(time);
    };
    $scope.getTime = function(timeType) {
        if(!$scope.loaded) return "Somewhere back in time... or not.";
        let time = $scope.post.time[timeType];
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
    $scope.createAccount = async function() {
        if($scope.validPassword() && $scope.newUser.email && $scope.newUser.username) {
            let status = await userService.register($scope.newUser);
            if(status.success) {
                navService.login();
            }
        }
        $scope.$applyAsync();
    };
});

app.controller('loginCtrl', function($scope, userService, navService, dialogService) {
    $scope.email;
    $scope.password;
    $scope.remainSignedIn = false;
    $scope.signInPending = false;
    $scope.signIn = async function() {
        if(!$scope.email || !$scope.password) return;
        $scope.signInPending = true;
        let creds = {
            email: $scope.email,
            password: $scope.password
        };
        let options = {
            remainSignedIn: $scope.remainSignedIn
        }
        let loginSuccess = await userService.login(creds, options);
        if(loginSuccess) {
            navService.home();
        }
        else {
            $scope.password = "";
            dialogService.message("That failed. Check your creds.")
        }
        $scope.signInPending = false;
        $scope.$applyAsync();
    };
    $scope.signUp = function() {
        navService.signup();
    };
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
    $scope.getEventList = async function(role) {
        let eventList = await eventMembershipService.getEventList(role);
        $scope.selectedList = eventList;
        console.log(eventList);
    };
    $scope.navigateEvent = function(eventURL) {
        navService.event(eventURL);
    };
});

app.controller('changePasswordCtrl', function($scope, userService) {
    $scope.oldpassword;
    $scope.password;
    $scope.repassword;
    $scope.changePassword = async function() {
        if(!$scope.validPassword() || !$scope.oldpassword) return;
        let status = await userService.changePassword($scope.oldpassword, $scope.password);
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
