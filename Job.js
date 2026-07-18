const params = new URLSearchParams(window.location.search);
const slug = params.get('job');
const jobContent = document.getElementById('jobContent');

function renderJob(job) {
    document.title = job.title + ' \u2013 TechUp.lk';

    function bulletList(items) {
        return '<ul class="bullet-list">' + items.map(function (item) {
            return '<li>' + item + '</li>';
        }).join('') + '</ul>';
    }

    jobContent.innerHTML =
        '<div class="job-header-row">' +
        '<div class="job-title-block">' +
        '<h1>' + job.title + '</h1>' +
        '<p class="company-name">' + job.company + '</p>' +
        '<div class="job-meta-row">' +
        '<span class="meta-item"><svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>' + job.jobType + '</span>' +
        '<span class="meta-item"><svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>' + job.location + '</span>' +
        '<span class="meta-item"><svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>LKR ' + Number(job.salaryMin).toLocaleString('en-US') + ' \u2013 ' + Number(job.salaryMax).toLocaleString('en-US') + '/month</span>' +
        '</div>' +
        '</div>' +
        '<button class="apply-job-top-btn">Apply for this job</button>' +
        '</div>' +

        '<p class="section-heading">About the role</p>' +
        '<p class="job-intro">' + job.aboutRole + '</p>' +

        '<p class="section-heading">Key responsibilities</p>' +
        bulletList(job.responsibilities) +

        '<p class="section-heading">What success looks like</p>' +
        bulletList(job.successLooksLike) +

        '<p class="section-heading">Required skills &amp; experience</p>' +
        bulletList(job.requiredSkills) +

        '<p class="section-heading">Desirable skills</p>' +
        bulletList(job.desirableSkills) +

        '<p class="section-heading">Why join us</p>' +
        bulletList(job.whyJoinUs) +

        '<p class="section-heading">Apply today</p>' +
        '<p class="job-intro">Don\'t meet every single requirement? If you\'re excited about this role but your past experience doesn\'t align perfectly with every qualification, we encourage you to apply anyway.</p>';

    const topApplyButton = jobContent.querySelector('.apply-job-top-btn');
    topApplyButton.addEventListener('click', function () {
        window.open('Apply.html?job=' + encodeURIComponent(slug), '_blank');
    });
}

function renderNotFound() {
    jobContent.innerHTML = '<p class="job-not-found">We couldn\'t find that role. <a href="HomePage.html">Go back to all vacancies</a>.</p>';
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
                    function listItems(selector) {
                        return Array.from(node.querySelectorAll(selector + ' item')).map(function (item) {
                            return item.textContent;
                        });
                    }

                    matchedJob = {
                        title: node.querySelector('title').textContent,
                        company: node.querySelector('company').textContent,
                        location: node.querySelector('location').textContent,
                        department: node.querySelector('department').textContent,
                        salaryMin: node.querySelector('salaryMin').textContent,
                        salaryMax: node.querySelector('salaryMax').textContent,
                        jobType: node.querySelector('jobType').textContent,
                        modality: node.querySelector('modality').textContent,
                        posted: node.querySelector('posted').textContent,
                        aboutRole: node.querySelector('aboutRole').textContent,
                        responsibilities: listItems('responsibilities'),
                        successLooksLike: listItems('successLooksLike'),
                        requiredSkills: listItems('requiredSkills'),
                        desirableSkills: listItems('desirableSkills'),
                        whyJoinUs: listItems('whyJoinUs')
                    };
                }
            });

            if (matchedJob) {
                renderJob(matchedJob);
            } else {
                renderNotFound();
            }
        })
        .catch(function (error) {
            renderNotFound();
            console.error('Failed to load jobs.xml:', error);
        });
}