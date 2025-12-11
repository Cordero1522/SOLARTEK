// -------------------------
// Toggle del menú móvil
// -------------------------
document.getElementById('mobileToggle').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// -------------------------
// Notificaciones flotantes
// -------------------------
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

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

    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        margin-right: 15px;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
    `;

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

    document.body.appendChild(notification);

    const autoClose = setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    closeBtn.addEventListener('click', () => {
        clearTimeout(autoClose);
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// -------------------------
// Manejo del formulario
// -------------------------
const form = document.getElementById("quoteForm");
const button = document.getElementById("submit-button");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Spinner de carga
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;

    try {
        const formData = new FormData(this);
        const formDataObj = {};

        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }

        const scriptURL = "https://script.google.com/macros/s/AKfycbwmnE8bHncypwSxj664qX_C7twiF5GOTNBfBsyTRzoHfftHQl1KPCKT9gOb_ta_5wb_ew/exec";

        const response = await fetch(scriptURL, {
            method: "POST",
            redirect: "follow",
            body: JSON.stringify(formDataObj),
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        });

        const data = await response.json();

        if (data.status === "success") {
            showNotification('Thank you for contacting us, we will get in touch with you soon!', 'success');
            form.reset();

            // Scroll suave al inicio
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        } else {
            throw new Error(data.message || "Oh no, it looks like something went wrong. Please try again later!");
        }

    } catch (error) {
        showNotification("Error: " + error.message, "error");
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
});

// -------------------------
// Scroll suave para enlaces internos
// -------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// -------------------------
// Sombra del header al hacer scroll
// -------------------------
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }
});