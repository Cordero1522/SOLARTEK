// Toggle del menú móvil
document.getElementById('mobileToggle').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// URL de tu Google Apps Script (REEMPLAZA ESTA URL CON LA TUYA)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRtKnwrmdNKqRgDqdzyggTTbf7Q96ldpXROYNc_v6MoweDeUtqbwm_M8rzJAViNG8B6g/exec';

// Manejo del formulario
document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Mostrar indicador de carga
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Recopilar datos del formulario
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        municipio: document.getElementById('municipio').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Enviar datos a Google Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Importante para evitar problemas CORS
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        // Como usamos 'no-cors', no podemos leer la respuesta
        // pero sabemos que la solicitud se envió
        
        // Mostrar mensaje de éxito
        showNotification('¡Gracias por tu solicitud! Te contactaremos en un plazo de 24-48 horas.', 'success');
        
        // Limpiar formulario
        document.getElementById('quoteForm').reset();
        
        // Scroll suave a la sección de inicio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.', 'error');
    })
    .finally(() => {
        // Restaurar botón
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
});

// Función para mostrar notificaciones
function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#F44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Estilos para el contenido
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        margin-right: 15px;
    `;
    
    // Estilos para el botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
    `;
    
    // Añadir animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Añadir al documento
    document.body.appendChild(notification);
    
    // Configurar cierre automático
    const autoClose = setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Configurar botón de cerrar manual
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoClose);
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Añadir clase de scroll al header para efectos de scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }
});