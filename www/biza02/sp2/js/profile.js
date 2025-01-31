import { auth, db } from './firebase-init.js';
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import Auth from './auth.js';
import Notifications from './notifications.js';
import Utils from './utils.js';

const Profile = {
    elements: {
        profileForm: null,
        nameInput: null,
        phoneInput: null,
        languageSelect: null
    },

    async render() {
        if (!await Auth.checkLoginState()) {
            window.location.hash = 'login';
            return null;
        }

        const user = auth.currentUser;
        if (!user) return null;

        const container = document.createElement('div');
        container.className = 'container profile-container';

        const content = this.createProfileContent(user);
        container.appendChild(content);

        return container;
    },

    createProfileContent(user) {
        const content = document.createElement('div');
        content.className = 'profile-content';

        const card = document.createElement('div');
        card.className = 'profile-card';

        const header = document.createElement('div');
        header.className = 'profile-header';
        header.textContent = '👤 My Profile';

        const form = this.createProfileForm(user);

        card.appendChild(header);
        card.appendChild(form);
        content.appendChild(card);

        return content;
    },

    createProfileForm(user) {
        const form = document.createElement('form');
        form.id = 'profileForm';
        form.className = 'profile-form';

        const formFields = [
            {
                label: 'Name',
                type: 'text',
                id: 'profileName',
                name: 'name',
                value: user.displayName || '',
                required: true,
                placeholder: 'Enter your name'
            },
            {
                label: 'Email',
                type: 'email',
                value: user.email || '',
                disabled: true,
                note: 'Email cannot be changed'
            },
            {
                label: 'Phone Number',
                type: 'tel',
                id: 'profilePhone',
                name: 'phone',
                placeholder: 'Enter your phone number'
            }
        ];

        formFields.forEach(field => {
            const fieldGroup = this.createFormField(field);
            form.appendChild(fieldGroup);
        });

        // Language selector
        const languageGroup = this.createLanguageSelector();
        form.appendChild(languageGroup);

        // Submit button
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'form-submit';
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'profile-submit-btn';
        submitButton.textContent = '💾 Update Profile';

        buttonGroup.appendChild(submitButton);
        form.appendChild(buttonGroup);

        return form;
    },

    createFormField({ label, type, id, name, value, required, disabled, placeholder, note }) {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'form-field';

        const labelElement = document.createElement('label');
        labelElement.className = 'field-label';
        labelElement.textContent = label;

        const input = document.createElement('input');
        input.className = 'field-input';
        input.type = type;
        if (id) input.id = id;
        if (name) input.name = name;
        if (value) input.value = value;
        if (required) input.required = true;
        if (disabled) input.disabled = true;
        if (placeholder) input.placeholder = placeholder;

        fieldGroup.appendChild(labelElement);
        fieldGroup.appendChild(input);

        if (note) {
            const noteElement = document.createElement('small');
            noteElement.className = 'field-note';
            noteElement.textContent = note;
            fieldGroup.appendChild(noteElement);
        }

        return fieldGroup;
    },

    createLanguageSelector() {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'form-field';

        const label = document.createElement('label');
        label.className = 'field-label';
        label.textContent = 'Preferred Language';

        const select = document.createElement('select');
        select.className = 'field-select';
        select.id = 'profileLanguage';
        select.name = 'language';

        const languages = [
            { value: 'en', text: 'English' },
            { value: 'es', text: 'Spanish' },
            { value: 'fr', text: 'French' },
            { value: 'de', text: 'German' }
        ];

        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.value;
            option.textContent = lang.text;
            select.appendChild(option);
        });

        fieldGroup.appendChild(label);
        fieldGroup.appendChild(select);

        return fieldGroup;
    },

    async init() {
        this.cacheElements();
        this.bindEvents();
        await this.loadUserPreferences();
    },

    cacheElements() {
        this.elements = {
            profileForm: document.getElementById('profileForm'),
            nameInput: document.getElementById('profileName'),
            phoneInput: document.getElementById('profilePhone'),
            languageSelect: document.getElementById('profileLanguage')
        };
    },

    bindEvents() {
        this.elements.profileForm?.addEventListener("submit", async (e) => {
            e.preventDefault();
            await this.updateProfile();
        });
    },

    async updateProfile() {
        try {
            Utils.showLoading();
            const user = auth.currentUser;
            if (!user) throw new Error("User is not logged in.");

            const profileData = {
                displayName: this.elements.nameInput?.value,
                phoneNumber: this.elements.phoneInput?.value,
                preferences: {
                    language: this.elements.languageSelect?.value
                }
            };

            await updateProfile(user, {
                displayName: profileData.displayName
            });

            await setDoc(doc(db, "users", user.uid), {
                ...profileData,
                updatedAt: serverTimestamp()
            }, { merge: true });

            Notifications.showAlert("Profile updated successfully!", "success");
        } catch (error) {
            console.error("Error updating profile:", error);
            Notifications.showAlert("Failed to update profile. Please try again.", "error");
        } finally {
            Utils.hideLoading();
        }
    },

    async loadUserPreferences() {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User is not logged in.");

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                
                if (data.preferences?.language) {
                    this.elements.languageSelect.value = data.preferences.language;
                }
                if (data.phoneNumber) {
                    this.elements.phoneInput.value = data.phoneNumber;
                }
            }
        } catch (error) {
            console.error("Error loading user preferences:", error);
            Notifications.showAlert("Failed to load user profile.", "error");
        }
    }
};

export default Profile;