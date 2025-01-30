import API from './api.js';
import Notifications from './notifications.js';
import Utils from './utils.js';

const Sharing = {
    async shareTrip(tripId) {
        try {
            const trip = await API.getTrip(tripId);
            const shareData = {
                title: `Travel Itinerary: ${trip.name}`,
                text: `Check out my trip to ${trip.destination}!`,
                url: `${window.location.origin}/#trips/${tripId}`
            };

            if (navigator.share) {
                await navigator.share(shareData);
                Notifications.showAlert('Trip shared successfully!', 'success');
            } else {
                this.showShareDialog(shareData);
            }
        } catch (error) {
            console.error('Error sharing trip:', error);
            Notifications.showAlert('Failed to share trip', 'error');
        }
    },

    showShareDialog(shareData) {
        const dialog = document.createElement('div');
        dialog.className = 'share-dialog modal';
        dialog.innerHTML = `
            <div class="share-options">
                <div class="mb-3">
                    <label class="form-label">Share Link</label>
                    <div class="input-group">
                        <input type="text" id="shareUrl" value="${shareData.url}" 
                            class="form-control" readonly>
                        <button class="btn btn-primary" id="copyLinkBtn">
                            Copy Link
                        </button>
                    </div>
                </div>
                <div class="share-buttons mt-3">
                    <button class="btn btn-outline-primary me-2" id="shareEmailBtn">
                        📧 Email
                    </button>
                    <button class="btn btn-outline-primary me-2" id="shareWhatsAppBtn">
                        📱 WhatsApp
                    </button>
                    <button class="btn btn-outline-primary" id="shareTelegramBtn">
                        ✈️ Telegram
                    </button>
                </div>
            </div>
        `;

        // Add to document
        document.body.appendChild(dialog);

        // Bind events
        const copyBtn = document.getElementById('copyLinkBtn');
        const emailBtn = document.getElementById('shareEmailBtn');
        const whatsappBtn = document.getElementById('shareWhatsAppBtn');
        const telegramBtn = document.getElementById('shareTelegramBtn');

        copyBtn?.addEventListener('click', () => this.copyToClipboard(shareData.url));
        emailBtn?.addEventListener('click', () => this.shareViaEmail(shareData.url));
        whatsappBtn?.addEventListener('click', () => this.shareViaWhatsApp(shareData.url));
        telegramBtn?.addEventListener('click', () => this.shareViaTelegram(shareData.url));

        // Show dialog using SweetAlert2
        Swal.fire({
            title: 'Share Trip',
            html: dialog,
            showCancelButton: true,
            showConfirmButton: false
        }).finally(() => {
            dialog.remove();
        });
    },

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Notifications.showAlert('Link copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            Notifications.showAlert('Failed to copy link', 'error');
        }
    },

    shareViaEmail(url) {
        const subject = encodeURIComponent('Check out my travel itinerary!');
        const body = encodeURIComponent(`I wanted to share my travel itinerary with you: ${url}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    },

    shareViaWhatsApp(url) {
        const text = encodeURIComponent(`Check out my travel itinerary: ${url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    },

    shareViaTelegram(url) {
        const text = encodeURIComponent(`Check out my travel itinerary: ${url}`);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    },

    async exportToPDF(tripId) {
        try {
            Utils.showLoading();
            const trip = await API.getTrip(tripId);
            const content = document.createElement('div');
            content.innerHTML = `
                <div style="padding: 20px;">
                    <h1 style="color: #007bff;">${trip.name}</h1>
                    <div style="margin: 20px 0;">
                        <h3>Trip Details</h3>
                        <p><strong>Destination:</strong> ${trip.destination}</p>
                        <p><strong>Dates:</strong> ${Utils.formatDate(trip.startDate)} - ${Utils.formatDate(trip.endDate)}</p>
                        ${trip.notes ? `<p><strong>Notes:</strong> ${trip.notes}</p>` : ''}
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h3>Places to Visit</h3>
                        ${trip.places?.map(place => `
                            <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd;">
                                <h4>${place.name}</h4>
                                ${place.description ? `<p>${place.description}</p>` : ''}
                                <p><small>${place.kinds || ''}</small></p>
                            </div>
                        `).join('') || '<p>No places added yet</p>'}
                    </div>
                    
                    ${trip.schedule && trip.schedule.length > 0 ? `
                        <div style="margin: 20px 0;">
                            <h3>Schedule</h3>
                            ${trip.schedule.map(item => `
                                <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd;">
                                    <p><strong>${item.date} ${item.startTime} - ${item.endTime}</strong></p>
                                    <h4>${item.activity}</h4>
                                    ${item.notes ? `<p>${item.notes}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
            
            const opt = {
                margin: 1,
                filename: `${trip.name}_itinerary.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(content).save();
            Notifications.showAlert('PDF exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            Notifications.showAlert('Failed to export PDF', 'error');
        } finally {
            Utils.hideLoading();
        }
    }
};

export default Sharing;