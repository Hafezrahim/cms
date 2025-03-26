document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const message = document.getElementById('message').value;
      
      // Format WhatsApp message
      const whatsappMessage = `New Contact Form Submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // Show success modal
      successModal.show();
      
      // Reset form
      contactForm.reset();
      
      // Redirect to WhatsApp after 3 seconds
      setTimeout(() => {
        window.open(`https://wa.me/201007419344?text=${encodedMessage}`, '_blank');
      }, 3000);
    });
  });