const params = new URLSearchParams(window.location.search);
const slug = params.get('job');
const applyContent = document.getElementById('applyContent');

function renderForm(job) {
    document.title = 'Apply \u2013 ' + job.title + ' \u2013 TechUp.lk';

    // NOTE: novalidate on the form, and no "required"/type="email"/type="tel"
    // attributes on the inputs below. All validation is handled manually in
    // JavaScript further down, not through HTML5 constraint validation.
    applyContent.innerHTML =
        '<h1 class="apply-title">Apply for this job</h1>' +
        '<p class="apply-subtitle">' + job.title + ' at ' + job.company + '</p>' +

        '<form id="applyForm" novalidate>' +
        '<label class="apply-label" for="resumeInput">Resume/CV <span class="required">*</span></label>' +
        '<div class="upload-zone" id="uploadZone">' +
        '<div class="upload-icon">\u2191</div>' +
        '<p class="upload-text">Click or drag file to this area to upload your Resume</p>' +
        '<p class="upload-hint" id="uploadHint">Please make sure to upload a PDF</p>' +
        '<input type="file" id="resumeInput" accept="application/pdf" hidden>' +
        '</div>' +
        '<p class="field-error" id="resumeError"></p>' +

        '<label class="apply-label" for="firstName">First Name <span class="required">*</span></label>' +
        '<input type="text" class="apply-input" id="firstName">' +
        '<p class="field-error" id="firstNameError"></p>' +

        '<label class="apply-label" for="lastName">Last Name <span class="required">*</span></label>' +
        '<input type="text" class="apply-input" id="lastName">' +
        '<p class="field-error" id="lastNameError"></p>' +

        '<label class="apply-label" for="email">Email <span class="required">*</span></label>' +
        '<input type="text" class="apply-input" id="email">' +
        '<p class="field-error" id="emailError"></p>' +

        '<label class="apply-label" for="phone">Phone Number <span class="required">*</span></label>' +
        '<div class="phone-row">' +
        '<span class="phone-prefix">\u{1F1F1}\u{1F1F0} +94</span>' +
        '<input type="text" class="apply-input" id="phone">' +
        '</div>' +
        '<p class="field-error" id="phoneError"></p>' +
        '<p class="phone-hint">The hiring team may use this number to contact you about this job.</p>' +

        '<label class="apply-label">Gender</label>' +
        '<div class="radio-group">' +
        '<label class="radio-option"><input type="radio" name="gender" value="Male"> Male</label>' +
        '<label class="radio-option"><input type="radio" name="gender" value="Female"> Female</label>' +
        '</div>' +

        '<div class="checkbox-row">' +
        '<label class="checkbox-option">' +
        '<input type="checkbox" id="emailOptIn">' +
        '<span>I would like to receive emails about new job opportunities</span>' +
        '</label>' +
        '</div>' +

        '<button type="submit" class="submit-application-btn">Submit Application</button>' +

        '<p class="consent-text">By clicking \'Submit Application\', you agree to receive job application updates from ' + job.company + ' via text and/or WhatsApp. Message frequency may vary. Reply STOP to unsubscribe at any time. Message &amp; data rates may apply.</p>' +
        '</form>';

    const uploadZone = document.getElementById('uploadZone');
    const resumeInput = document.getElementById('resumeInput');
    const uploadHint = document.getElementById('uploadHint');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const applyForm = document.getElementById('applyForm');

    uploadZone.addEventListener('click', function () {
        resumeInput.click();
    });

    uploadZone.addEventListener('dragover', function (event) {
        event.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', function () {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', function (event) {
        event.preventDefault();
        uploadZone.classList.remove('drag-over');
        if (event.dataTransfer.files.length > 0) {
            resumeInput.files = event.dataTransfer.files;
            updateUploadHint();
        }
    });

    resumeInput.addEventListener('change', updateUploadHint);

    function updateUploadHint() {
        if (resumeInput.files.length > 0) {
            uploadHint.textContent = resumeInput.files[0].name;
            uploadZone.classList.add('has-file');
        } else {
            uploadHint.textContent = 'Please make sure to upload a PDF';
            uploadZone.classList.remove('has-file');
        }
    }

    // ---- Manual JavaScript validation (no HTML5 constraint validation used) ----

    function showFieldError(errorId, message) {
        const errorEl = document.getElementById(errorId);
        errorEl.textContent = message;
    }

    function clearFieldError(errorId) {
        const errorEl = document.getElementById(errorId);
        errorEl.textContent = '';
    }

    function validateResume() {
        if (resumeInput.files.length === 0) {
            showFieldError('resumeError', 'Please upload your resume as a PDF.');
            uploadZone.classList.add('input-error');
            return false;
        }
        clearFieldError('resumeError');
        uploadZone.classList.remove('input-error');
        return true;
    }

    function validateFirstName() {
        const value = firstNameInput.value.trim();
        if (value === '') {
            showFieldError('firstNameError', 'First name is required.');
            firstNameInput.classList.add('input-error');
            return false;
        }
        clearFieldError('firstNameError');
        firstNameInput.classList.remove('input-error');
        return true;
    }

    function validateLastName() {
        const value = lastNameInput.value.trim();
        if (value === '') {
            showFieldError('lastNameError', 'Last name is required.');
            lastNameInput.classList.add('input-error');
            return false;
        }
        clearFieldError('lastNameError');
        lastNameInput.classList.remove('input-error');
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (value === '') {
            showFieldError('emailError', 'Email is required.');
            emailInput.classList.add('input-error');
            return false;
        }
        if (!emailPattern.test(value)) {
            showFieldError('emailError', 'Please enter a valid email address.');
            emailInput.classList.add('input-error');
            return false;
        }
        clearFieldError('emailError');
        emailInput.classList.remove('input-error');
        return true;
    }

    function validatePhone() {
        const value = phoneInput.value.trim();
        const digitsOnly = value.replace(/[^0-9]/g, '');

        if (value === '') {
            showFieldError('phoneError', 'Phone number is required.');
            phoneInput.classList.add('input-error');
            return false;
        }
        if (digitsOnly.length < 7) {
            showFieldError('phoneError', 'Please enter a valid phone number.');
            phoneInput.classList.add('input-error');
            return false;
        }
        clearFieldError('phoneError');
        phoneInput.classList.remove('input-error');
        return true;
    }

    applyForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const isResumeValid = validateResume();
        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();

        const isFormValid = isResumeValid && isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid;

        if (!isFormValid) {
            return;
        }

        applyContent.innerHTML =
            '<div class="apply-success">' +
            '<h1 class="apply-title">Application submitted</h1>' +
            '<p class="apply-subtitle">Thanks for applying to ' + job.title + ' at ' + job.company + '. The hiring team will be in touch if there\'s a match.</p>' +
            '</div>';
    });
}

function renderNotFound() {
    applyContent.innerHTML = '<p class="job-not-found">We couldn\'t find that role. <a href="HomePage.html">Go back to all vacancies</a>.</p>';
}

if (!slug) {
    renderNotFound();
} else {
    fetch('jobs.xml')
        .then(function (response) {
            return response.text();
        })
        .then(function (xmlText) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
            const jobNodes = xmlDoc.querySelectorAll('job');

            let matchedJob = null;
            jobNodes.forEach(function (node) {
                if (node.querySelector('slug').textContent === slug) {
                    matchedJob = {
                        title: node.querySelector('title').textContent,
                        company: node.querySelector('company').textContent
                    };
                }
            });

            if (matchedJob) {
                renderForm(matchedJob);
            } else {
                renderNotFound();
            }
        })
        .catch(function (error) {
            renderNotFound();
            console.error('Failed to load jobs.xml:', error);
        });
}