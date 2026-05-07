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

/*firebase - escuchar cambios en tiempo real*/


function startListening() {
if (!db) return;
const ref = db.ref('platillos');

ref.on('value', snap => {
    const data = snap.val() || {};
    const list = Object.entries(data).map(([id, val]) => ({id, ...val }));
    renderAll(list);
}, err => {
    showToast('Error al leer datos: ' + err.message, 'error');
});
}

