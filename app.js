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


/*Cargar datos de ejemplo*/

function cargarEjemplos() {
    if (!db) return;
    db.ref('platillos').once('value').then(snap => {
        if (snap.exist()) {
            showToast('La base de datos ya tiene platillos registrados.', 'info');
            return;
        }
        const batch = {};
        PLATILLOS_EJEMPLO.forEach(p => {
            const key = db.ref('platillos').push().key;
            batch['platillos/' + key] = p;
        });
        db.ref().update(batch)
        .then(() => showToast('i' + PLATILLOS_EJEMPLO.length + 'platillos de ejemplo cargados!', 'success'))
        .catch(e => showToast('Error al cargar ejemplos: ' + e.message, 'error'));
    });
}

