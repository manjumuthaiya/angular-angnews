'use strict';
 
app.factory('User', function ($firebase, FIREBASE_URL, Auth, $rootScope) {
  var ref = new Firebase(FIREBASE_URL + 'users');
 
  var users = $firebase(ref);
 
  var User = {
    create: function (authUser, username) {
      users[username] = {
        md5_hash: authUser.md5_hash,
        username: username,
        $priority: authUser.uid
      };
 
      users.$save(username).then(function() {
        setCurrentUser(username);
      });
    },
    findByUsername: function (username) {
      if (username) {
        return users.$child(username);
      }
    },
    getCurrent: function () {
      return $rootScope.currentUser;
    },
    signedIn: function () {
      return Auth.signedIn();
    }

  };
  $rootScope.$on('$firebaseSimpleLogin:login', function (e, authUser) {
    var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));
   
    query.$on('loaded', function () {
      setCurrentUser(query.$getIndex()[0]);
    });
  });
  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    delete $rootScope.currentUser;
  });
  
  function setCurrentUser (username) {
      $rootScope.currentUser = User.findByUsername(username);
      console.log($rootScope.currentUser);
  }

  return User;
});
