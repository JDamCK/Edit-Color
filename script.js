// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const username = urlParams.get('username') || 'Usuario';
const avatar = urlParams.get('avatar') || 'https://cdn.discordapp.com/embed/avatars/0.png';

// Actualizar UI
document.getElementById('username').textContent = username;
document.getElementById('avatar').src = avatar;

const colorPicker = document.getElementById('colorPicker');
const hexInput = document.getElementById('hexInput');
const btnSave = document.getElementById('btnSave');
const btnRemove = document.getElementById('btnRemove');
const statusDiv = document.getElementById('status');

// Sincronizar inputs
colorPicker.addEventListener('input', (e) => {
    hexInput.value = e.target.value.toUpperCase();
});

hexInput.addEventListener('input', (e) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    e.target.value = val;

    // Validar HEX
    if(/^#[0-9A-F]{6}$/i.test(val)){
        colorPicker.value = val;
    }
});

function showStatus(msg, isError = false) {
    statusDiv.textContent = msg;
    statusDiv.className = isError ? 'error' : 'success';
    setTimeout(() => statusDiv.textContent = '', 3000);
}

function toggleLoading(isLoading) {
    if(isLoading) {
        btnSave.classList.add('loading');
        btnRemove.classList.add('loading');
        btnSave.textContent = 'Guardando...';
    } else {
        btnSave.classList.remove('loading');
        btnRemove.classList.remove('loading');
        btnSave.textContent = 'Guardar Color';
    }
}

btnSave.addEventListener('click', async () => {
    if(!token) return showStatus('Error: Faltan credenciales de seguridad.', true);

    const color = hexInput.value;
    if(!/^#[0-9A-F]{6}$/i.test(color)) return showStatus('Error: Código HEX inválido.', true);

    toggleLoading(true);
    try {
        const res = await fetch('https://remir.onrender.com/api/set-color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, color })
        });
        const data = await res.json();

        if(res.ok) {
            showStatus('¡Color actualizado con éxito! Puedes cerrar esta ventana.');
        } else {
            showStatus(data.error || 'Error al guardar el color.', true);
        }
    } catch (err) {
        showStatus('Error de conexión con el servidor.', true);
    }
    toggleLoading(false);
});

btnRemove.addEventListener('click', async () => {
    if(!token) return showStatus('Error: Faltan credenciales de seguridad.', true);

    toggleLoading(true);
    try {
        const res = await fetch('https://remir.onrender.com/api/remove-color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        const data = await res.json();

        if(res.ok) {
            showStatus('Color eliminado. Volviste a la normalidad.');
        } else {
            showStatus(data.error || 'Error al eliminar el color.', true);
        }
    } catch (err) {
        showStatus('Error de conexión con el servidor.', true);
    }
    toggleLoading(false);
});
