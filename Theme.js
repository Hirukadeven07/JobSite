const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    themeToggle.checked = document.documentElement.classList.contains('dark');

    themeToggle.addEventListener('change', function () {
        if (themeToggle.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('techup-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('techup-theme', 'light');
        }
    });
}