/*estado global*/

let db = null;
let filterCat = 'all';

/*firebase inicializacion*/

function initFirebase(){
    try{
        initFirebase.initializeApp(firebaseConfig);
        db = firebase.database();

        db.ref('.info/connected').on('value', snap => {
            setDbStatus(snap.val()=== true ? 'connected' : 'disconnected');

        });
        startListening();
    
    } catch (e) {
        showToast('Error al conectar con Firebase: ' + e.message, 'error');
        setDbStatus('error');
    }
}