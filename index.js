let mapa;
const utld = { lat: 25.50, lng: -103.55 };
const utld1 = { lat: 25.5012087, lng: -103.5512128 }
let pos1 = {lat:null, lng:null, nombre:null, descripcion:null};

const firebaseConfig = {
    apiKey: "AIzaSyB2MSVBIOe6LHMUv3Z60BI-r7xDMy67U1Q",
    authDomain: "mapota-94a9e.firebaseapp.com",
    databaseURL: "https://mapota-94a9e-default-rtdb.firebaseio.com",
    projectId: "mapota-94a9e",
    storageBucket: "mapota-94a9e.appspot.com",
    messagingSenderId: "483399627152",
    appId: "1:483399627152:web:c372aa28b4e1e49dc5c315",
    measurementId: "G-HS5E4MQ17L"
};

document.getElementById('logIn').addEventListener('click', logInGoogle)
document.getElementById('logOut').addEventListener('click', logOutGoogle)
document.getElementById('logInFace').addEventListener('click', logInFacebook)
document.getElementById('logInTwitt').addEventListener('click', logInTwitter)

firebase.initializeApp(firebaseConfig);

revisa();

function revisa(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            var usuario = user;

            llenaDivs(usuario);
            blog = true;
        }
        else{
            document.getElementById('imagen').innerHTML = ""
            document.getElementById('nombre').innerHTML = "Para ver el mapa inicia sesión"
            blog = false;
        }
    })
}

function llenaDivs(x1){
    document.getElementById('imagen').innerHTML = "<img src = " + x1.photoURL + ">";
    document.getElementById('nombre').innerHTML = "<p> Bienvenido: " + x1.displayName + "</p>";
}


function logInTwitter() {
    console.log('El click funciona')
    var proveedor = new firebase.auth.TwitterAuthProvider();

    firebase.auth().signInWithPopup(proveedor)
        .then(function(result){
            // console.log(result);
            const usuario = result.user;
            const token = result.credential.accessToken;

            llenaDivs(usuario);

            console.log(usuario);
            console.log(token);
        })
        .catch(function (error){
            var errorCode = error.code;
            var errorMEssage = error.message;
            var email = error.email;
            var credential = error.credential;
        })
}

function logInFacebook() {
    console.log('El click funciona')
    var proveedor = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(proveedor)
        .then(function(result){
            // console.log(result);
            const usuario = result.user;
            const token = result.credential.accessToken;

            llenaDivs(usuario);

            console.log(usuario);
            console.log(token);
        })
        .catch(function (error){
            var errorCode = error.code;
            var errorMEssage = error.message;
            var email = error.email;
            var credential = error.credential;
        })
}



function logInGoogle() {
    console.log('El click funciona')
    var proveedor = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(proveedor)
        .then(function(result){
            // console.log(result);
            const usuario = result.user;
            const token = result.credential.accessToken;

            llenaDivs(usuario);

            console.log(usuario);
            console.log(token);
        })
        .catch(function (error){
            var errorCode = error.code;
            var errorMEssage = error.message;
            var email = error.email;
            var credential = error.credential;
        })
}




function logOutGoogle(){
    console.log('El click funciona');

    firebase.auth().signOut()
        .then(function(){

            //LOG-OUT EXITOSO
            console.log('Cerró sesión')
            /* if(() => {}){
                 location.reload();

             } */
            document.getElementById('imagen').innerHTML = ""
            document.getElementById('nombre').innerHTML = ""
        })
        .catch(function(error){
            //Ocurrió un error
            console.log('Ocurrió un error')
        })
}

function autentica(onAuthSuccess){
    firebase.auth().signInAnonymously().catch(function(error){
        console.log(error.code+","+error.message)

    },{remember: "sessionOnly"});
    onAuthSuccess();
}



function initMap(){
    var user;
    firebase.auth().onAuthStateChanged(function (user){
        if(user){
            document.getElementById("logOut").style.display = "block";
            document.getElementById("loginModal").style.display = "block";
            initMap2(user)

        }
        else{
            document.getElementById("loginModal").addEventListener('click', ShowModal)
            modal.style.display = "block";
            console.log("No se ha iniciado sesión")
        }
    })
}

function initMap2(user) {
    if(user){
        mapa = new google.maps.Map(document.getElementById("map"), {
            center: utld,
            zoom: 15,
            disableDoubleClickZoom: true,
        });
    }

    var rpdb = firebase.database().ref("clicks");

    rpdb.on('child_added',
        function(snapshot){
            var snapposiciones = snapshot.val();
            //  console.log(snapposiciones);
            var pos2 = new google.maps.LatLng(snapposiciones.lat, snapposiciones.lng);
            var nombre = snapposiciones.nombre;
            var descripcion = snapposiciones.descripcion;
            agregapin(pos2, nombre, descripcion);
        });

    mapa.addListener('click', function (e){
        console.log(e);
        pos1.lat = e.latLng.lat();
        pos1.lng = e.latLng.lng();
        agregapin(pos1);
        pos1.nombre = document.getElementById("name").value
        pos1.descripcion = document.getElementById("description").value
        agregarDB(pos1);
    })



    function agregarDB(datos){
        var fb1 = firebase.database().ref("clicks").push(datos, function (error){
            if(error){
                console.log(error)
            }
        })
    }

    function agregapin(posicion, nombre, descripcion) {
        const pin1 = new google.maps.Marker({
            position: posicion,
            map: mapa,
            title:('Este pin lo puso: ' + nombre)


        })
        const infowindow = new google.maps.InfoWindow({
            content:('Descripción: ') + descripcion,
        });

        pin1.addListener("click", () => {
            infowindow.open({
                anchor: pin1,
                map: mapa,
                shouldFocus: false,
            });
        });

    }

}
