const navCategoryLinks = document.querySelectorAll('#categoryNav a');
const listingsTitle = document.querySelector('.listings-header h3');
const jobCardsContainer = document.getElementById('jobCardsContainer');
const jobsCount = document.getElementById('jobsCount');
const filterDropdowns = document.querySelectorAll('.filter-dropdown');
const clearFiltersLink = document.getElementById('clearFilters');

let jobCards = [];
let selectedDept = 'all';

function buildJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.setAttribute('data-dept', job.department);
    card.setAttribute('data-experience', job.experience);
    card.setAttribute('data-job-type', job.jobType);
    card.setAttribute('data-modality', job.modality);
    card.setAttribute('data-job', job.slug);

    card.innerHTML =
        '<div class="job-info">' +
        '<h4>' + job.title + '</h4>' +
        '<p>' + job.company + ' &nbsp;\u00b7&nbsp; ' + job.location + ' &nbsp;\u00b7&nbsp; ' + job.jobType + '</p>' +
        '</div>' +
        '<div class="job-meta">' +
        '<div class="job-meta-top">' +
        '<span class="salary">LKR ' + Number(job.salaryMin).toLocaleString('en-US') + ' \u2013 ' + Number(job.salaryMax).toLocaleString('en-US') + '/month</span>' +
        '<button class="apply-job-btn">Apply</button>' +
        '</div>' +
        '<span class="posted-date">Posted ' + job.posted + '</span>' +
        '</div>';

    const applyButton = card.querySelector('.apply-job-btn');
    applyButton.addEventListener('click', function () {
        window.location.href = 'Job.html?job=' + encodeURIComponent(job.slug);
    });

    return card;
}

function parseJobsXml(xmlDoc) {
    const jobNodes = xmlDoc.querySelectorAll('job');
    const jobs = [];
    jobNodes.forEach(function (node) {
        jobs.push({
            slug: node.querySelector('slug').textContent,
            title: node.querySelector('title').textContent,
            company: node.querySelector('company').textContent,
            location: node.querySelector('location').textContent,
            department: node.querySelector('department').textContent,
            experience: node.querySelector('experience').textContent,
            jobType: node.querySelector('jobType').textContent,
            modality: node.querySelector('modality').textContent,
            salaryMin: node.querySelector('salaryMin').textContent,
            salaryMax: node.querySelector('salaryMax').textContent,
            posted: node.querySelector('posted').textContent
        });
    });
    return jobs;
}

function setActiveDept(dept) {
    selectedDept = dept;

    navCategoryLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('data-dept') === dept);
    });
}

function getSelectedValues(dropdown) {
    return Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked')).map(function (input) {
        return input.value;
    });
}

function applyFilters() {
    const jobTypeDropdown = document.querySelector('.filter-dropdown[data-filter-name="jobType"]');
    const modalityDropdown = document.querySelector('.filter-dropdown[data-filter-name="modality"]');
    const experienceDropdown = document.querySelector('.filter-dropdown[data-filter-name="experience"]');

    const selectedJobTypes = getSelectedValues(jobTypeDropdown);
    const selectedModalities = getSelectedValues(modalityDropdown);
    const selectedExperiences = getSelectedValues(experienceDropdown);

    filterDropdowns.forEach(function (dropdown) {
        const hasSelection = getSelectedValues(dropdown).length > 0;
        dropdown.classList.toggle('has-selection', hasSelection);
    });

    listingsTitle.textContent = selectedDept === 'all' ? 'All roles' : selectedDept;

    let visibleCount = 0;

    jobCards.forEach(function (card) {
        const deptMatches = selectedDept === 'all' || card.getAttribute('data-dept') === selectedDept;
        const jobTypeMatches = selectedJobTypes.length === 0 || selectedJobTypes.includes(card.getAttribute('data-job-type'));
        const modalityMatches = selectedModalities.length === 0 || selectedModalities.includes(card.getAttribute('data-modality'));
        const experienceMatches = selectedExperiences.length === 0 || selectedExperiences.includes(card.getAttribute('data-experience'));

        const isVisible = deptMatches && jobTypeMatches && modalityMatches && experienceMatches;
        card.style.display = isVisible ? 'flex' : 'none';
        if (isVisible) {
            visibleCount += 1;
        }
    });

    jobsCount.textContent = visibleCount + (visibleCount === 1 ? ' job' : ' jobs');
}

navCategoryLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        setActiveDept(link.getAttribute('data-dept'));
        applyFilters();
    });
});

filterDropdowns.forEach(function (dropdown) {
    const button = dropdown.querySelector('.filter-btn');

    button.addEventListener('click', function (event) {
        event.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        filterDropdowns.forEach(function (d) {
            d.classList.remove('open');
        });
        if (!isOpen) {
            dropdown.classList.add('open');
        }
    });

    dropdown.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', applyFilters);
    });
});

document.addEventListener('click', function () {
    filterDropdowns.forEach(function (dropdown) {
        dropdown.classList.remove('open');
    });
});

clearFiltersLink.addEventListener('click', function (event) {
    event.preventDefault();
    document.querySelectorAll('.filter-panel input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.checked = false;
    });
    setActiveDept('all');
    applyFilters();
});

fetch('jobs.xml')
    .then(function (response) {
        return response.text();
    })
    .then(function (xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        const jobs = parseJobsXml(xmlDoc);

        jobs.forEach(function (job) {
            const card = buildJobCard(job);
            jobCardsContainer.appendChild(card);
        });

        jobCards = document.querySelectorAll('.job-card');

        const params = new URLSearchParams(window.location.search);
        const deptFromUrl = params.get('dept');
        setActiveDept(deptFromUrl || 'all');
        applyFilters();
    })
    .catch(function (error) {
        jobCardsContainer.innerHTML = '<p>Could not load job listings.</p>';
        console.error('Failed to load jobs.xml:', error);
    });