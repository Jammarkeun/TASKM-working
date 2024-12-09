document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const userId = localStorage.getItem('userId');

    loadUserProfile();

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            user_id: userId,
            fullname: document.getElementById('usernameInput').value,
            email: document.getElementById('emailInput').value,
            theme: document.getElementById('themeSelect').value,
            timezone: document.getElementById('timezoneSelect').value,
            email_notifications: document.getElementById('emailNotifications').checked,
            web_notifications: document.getElementById('webNotifications').checked
        };

        try {
            const response = await fetch('/api/update_profile.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profile updated successfully!');
                loadUserProfile(); // Reload the profile data
            } else {
                alert(data.message || 'Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            alert('Failed to update profile. Please check your connection and try again.');
        }
    });

    async function loadUserProfile() {
        try {
            const response = await fetch(`/api/get_profile.php?user_id=${userId}`);
            const data = await response.json();

            if (response.ok) {
                document.getElementById('usernameInput').value = data.fullname;
                document.getElementById('emailInput').value = data.email;
                document.getElementById('themeSelect').value = data.theme || 'light';
                document.getElementById('timezoneSelect').value = data.timezone || 'UTC';
                document.getElementById('emailNotifications').checked = data.email_notifications;
                document.getElementById('webNotifications').checked = data.web_notifications;

                // Update profile image if available
                if (data.profile_image) {
                    document.getElementById('profileImage').src = data.profile_image;
                }

                // Update displayed username and email
                document.getElementById('username').textContent = data.fullname;
                document.getElementById('email').textContent = data.email;
            } else {
                alert('Failed to load profile data. Please try again.');
            }
        } catch (error) {
            console.error('Profile load error:', error);
            alert('Failed to load profile data. Please check your connection and try again.');
        }
    }

    // Handle profile image upload
    const imageUploadButton = document.querySelector('.upload-image');
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';

    imageUploadButton.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profile_image', file);
            formData.append('user_id', userId);

            try {
                const response = await fetch('/api/upload_profile_image.php', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    document.getElementById('profileImage').src = data.image_url;
                    alert('Profile image updated successfully!');
                } else {
                    alert(data.message || 'Failed to upload profile image. Please try again.');
                }
            } catch (error) {
                console.error('Profile image upload error:', error);
                alert('Failed to upload profile image. Please check your connection and try again.');
            }
        }
    });

    // Populate timezone options
    const timezoneSelect = document.getElementById('timezoneSelect');
    const timezones = moment.tz.names();
    timezones.forEach(timezone => {
        const option = document.createElement('option');
        option.value = timezone;
        option.textContent = timezone;
        timezoneSelect.appendChild(option);
    });
});