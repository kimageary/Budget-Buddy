// Nav Bar Function
const navLinks = document.querySelector('.nav-links');
console.log(navLinks);
        function onToggleMenu(e) {
            const isMenuOpen = e.name === 'menu';
            e.name = isMenuOpen ? 'close' : 'menu';
            if (isMenuOpen) {
                navLinks.classList.remove('top-[-100%]');
                navLinks.classList.add('top-[9%]');
            } else {
                navLinks.classList.remove('top-[9%]');
                navLinks.classList.add('top-[-100%]');
            }
        }