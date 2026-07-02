document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Booking Request:', data);
            
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Request Sent!';
            submitBtn.classList.remove('bg-secondary-500', 'hover:bg-secondary-600');
            submitBtn.classList.add('bg-primary-500', 'hover:bg-primary-600');
            
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.classList.remove('bg-primary-500', 'hover:bg-primary-600');
                submitBtn.classList.add('bg-secondary-500', 'hover:bg-secondary-600');
                bookingForm.reset();
            }, 3000);
            
            alert('Thank you for your interest! Your mock booking request has been submitted.');
        });
    }
});
