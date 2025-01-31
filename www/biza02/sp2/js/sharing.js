import API from './api.js';
import Notifications from './notifications.js';
import Utils from './utils.js';

const Sharing = {
    elements: {
        shareDialog: null,
        shareUrl: null,
        shareButtons: null
    },

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

    createShareDialog(shareData) {
        const dialog = document.createElement('div');
        dialog.className = 'share-dialog';

        const content = document.createElement('div');
        content.className = 'share-content';

        // Share link section
        const linkSection = document.createElement('div');
        linkSection.className = 'share-link-section';

        const linkLabel = document.createElement('label');
        linkLabel.className = 'share-label';
        linkLabel.textContent = 'Share Link';

        const linkGroup = document.createElement('div');
        linkGroup.className = 'share-link-group';

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.id = 'shareUrl';
        urlInput.className = 'share-url-input';
        urlInput.value = shareData.url;
        urlInput.readOnly = true;

        const copyButton = document.createElement('button');
        copyButton.className = 'share-copy-btn';
        copyButton.textContent = 'Copy Link';
        copyButton.dataset.action = 'copy';

        linkGroup.appendChild(urlInput);
        linkGroup.appendChild(copyButton);
        linkSection.appendChild(linkLabel);
        linkSection.appendChild(linkGroup);

        // Share buttons section
        const buttonsSection = document.createElement('div');
        buttonsSection.className = 'share-buttons-section';

        const buttons = [
            { action: 'email', icon: '📧', text: 'Email' },
            { action: 'whatsapp', icon: '📱', text: 'WhatsApp' },
            { action: 'telegram', icon: '✈️', text: 'Telegram' }
        ];

        buttons.forEach(button => {
            const shareButton = document.createElement('button');
            shareButton.className = 'share-button';
            shareButton.dataset.action = button.action;
            shareButton.innerHTML = `${button.icon} ${button.text}`;
            buttonsSection.appendChild(shareButton);
        });

        content.appendChild(linkSection);
        content.appendChild(buttonsSection);
        dialog.appendChild(content);

        return dialog;
    },

    showShareDialog(shareData) {
        const dialog = this.createShareDialog(shareData);
        document.body.appendChild(dialog);

        this.elements = {
            shareDialog: dialog,
            shareUrl: dialog.querySelector('#shareUrl'),
            shareButtons: dialog.querySelectorAll('[data-action]')
        };

        this.bindShareEvents(shareData);

        Swal.fire({
            title: 'Share Trip',
            html: dialog,
            showCancelButton: true,
            showConfirmButton: false
        }).finally(() => {
            dialog.remove();
            this.elements = {
                shareDialog: null,
                shareUrl: null,
                shareButtons: null
            };
        });
    },

    bindShareEvents(shareData) {
        this.elements.shareButtons?.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                switch (action) {
                    case 'copy':
                        this.copyToClipboard(shareData.url);
                        break;
                    case 'email':
                        this.shareViaEmail(shareData);
                        break;
                    case 'whatsapp':
                        this.shareViaWhatsApp(shareData);
                        break;
                    case 'telegram':
                        this.shareViaTelegram(shareData);
                        break;
                }
            });
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

    shareViaEmail(shareData) {
        const subject = encodeURIComponent(shareData.title);
        const body = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    },

    shareViaWhatsApp(shareData) {
        const text = encodeURIComponent(`${shareData.text} ${shareData.url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    },

    shareViaTelegram(shareData) {
        const text = encodeURIComponent(`${shareData.text} ${shareData.url}`);
        window.open(`https://t.me/share/url?url=${shareData.url}&text=${text}`, '_blank');
    },

    async exportToPDF(tripId) {
        try {
            Utils.showLoading();
            const trip = await API.getTrip(tripId);
            
            const content = this.createPDFContent(trip);
            
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
    },

    createPDFContent(trip) {
        const container = document.createElement('div');
        container.className = 'pdf-container';

        const content = document.createElement('div');
        content.className = 'pdf-content';

        // Title section
        const title = document.createElement('h1');
        title.className = 'pdf-title';
        title.textContent = trip.name;

        // Details section
        const details = document.createElement('div');
        details.className = 'pdf-details';
        details.innerHTML = `
            <h3>Trip Details</h3>
            <p><strong>Destination:</strong> ${trip.destination}</p>
            <p><strong>Dates:</strong> ${Utils.formatDate(trip.startDate)} - ${Utils.formatDate(trip.endDate)}</p>
            ${trip.notes ? `<p><strong>Notes:</strong> ${trip.notes}</p>` : ''}
        `;

        // Places section
        const places = document.createElement('div');
        places.className = 'pdf-places';
        places.innerHTML = `
            <h3>Places to Visit</h3>
            ${trip.places?.length ? trip.places.map(place => `
                <div class="pdf-place-item">
                    <h4>${place.name}</h4>
                    ${place.description ? `<p>${place.description}</p>` : ''}
                    <p><small>${place.kinds || ''}</small></p>
                </div>
            `).join('') : '<p>No places added yet</p>'}
        `;

        // Schedule section
        if (trip.schedule?.length) {
            const schedule = document.createElement('div');
            schedule.className = 'pdf-schedule';
            schedule.innerHTML = `
                <h3>Schedule</h3>
                ${trip.schedule.map(item => `
                    <div class="pdf-schedule-item">
                        <p><strong>${item.date} ${item.startTime} - ${item.endTime}</strong></p>
                        <h4>${item.activity}</h4>
                        ${item.notes ? `<p>${item.notes}</p>` : ''}
                    </div>
                `).join('')}
            `;
            content.appendChild(schedule);
        }

        content.appendChild(title);
        content.appendChild(details);
        content.appendChild(places);
        container.appendChild(content);

        return container;
    }
};

export default Sharing;