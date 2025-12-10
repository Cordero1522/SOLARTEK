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
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6R4lUubRMBu96MmpHpluuRwy7dtkpXyTkn4FHUMAdGGv9ScygeE0Np6wRqYz0pcSxrA/exec';

// Manejo del formulario
document.getElementById('quoteForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Mostrar indicador de carga
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    try {
        // Recopilar datos del formulario
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            municipio: document.getElementById('municipio').value,
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString()
        };
        
        // Validación básica
        if (!formData.name || !formData.email || !formData.phone || !formData.municipio) {
            throw new Error('Por favor completa todos los campos requeridos');
        }
        
        // Enviar datos a Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors', // Cambiado a cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error del servidor: ${response.status} ${errorText}`);
        }
        
        const result = await response.json();
        
        if (result.result === "success") {
            // Mostrar mensaje de éxito
            showNotification('¡Gracias por tu solicitud! Te contactaremos en un plazo de 24-48 horas.', 'success');
            
            // Limpiar formulario
            document.getElementById('quoteForm').reset();
            
            // Scroll suave a la sección de inicio
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            throw new Error(result.message || 'Error al procesar la solicitud');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showNotification(error.message || 'Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.', 'error');
    } finally {
        // Restaurar botón
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});