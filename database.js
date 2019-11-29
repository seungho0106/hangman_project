function initFirestore() {
    // Config
    var firebaseConfig = {
        apiKey: "AIzaSyCOl7zfOtE5H75WPViBv-jNxn9nZLhHNFo",
        authDomain: "fire1-2c085.firebaseapp.com",
        projectId: "fire1-2c085",
        storageBucket: "fire1-2c085.appspot.com",
        messagingSenderId: "228703666474",
        appId: "1:228703666474:web:3bacd2b08daf85a79cde53",
        measurementId: "G-8V89TB50QY"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // Initialize Firestore
    var db = firebase.firestore();
    return db
}

function fetchWords(db) {
    var results = [];
    return db.collection('hangman').where('id', '<=', Math.random()).limit(20)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                results.push(doc.data());
            })
            //return([null, results]);
        })
        .then(r =>{
            return( [null, results] );
        })
        .catch(err => {
            return( [err, null] );
        });
}

function fetchLeaderboard(db){
    var results = [];
    return db.collection('leaderboard').orderBy("score", "desc").limit(10)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                results.push(doc.data());
            })
        })
        .then(r => {return( [null, results] );
        })
        .catch(err => {return( [err, null] );
        });
}


function addToLeaderboard(db, name, score){
    var leaderRef = db.collection('leaderboard');
    return leaderRef.add({
        name: name,
        score: score,
    })
    .then(docRef => {return( [null, docRef.id] );
    })
    .catch(err => {return( [err, null] );
    });
}