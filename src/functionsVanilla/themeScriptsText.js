export const themeScriptsText = `

// Function to apply the theme based on localStorage
        function applyTheme() {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
                document.body.classList.add('dark');
                document.body.classList.remove('light');
            } else {
                document.body.classList.remove('dark');
                document.body.classList.add('light');
            }
        }

        // Function to toggle the theme
        function toggleTheme() {
            if (document.body.classList.contains('dark')) {
                document.body.classList.remove('dark');
                document.body.classList.add('light');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light');
                document.body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        }

        // Initialize the theme on page load
        document.addEventListener('DOMContentLoaded', applyTheme);

        // Add event listener to the theme button
        document.getElementById('theme-button').addEventListener('click', toggleTheme);

// Function to apply the citation colors based on localStorage
        function applyColor() {
            const color = localStorage.getItem('color');
            if (color === 'true') {
                document.body.classList.add('colored-locators');
                
            } else {
                document.body.classList.remove('colored-locators');
               
            }
        }

        // Function to toggle the color
        function toggleColor() {
            if (document.body.classList.contains('colored-locators')) {
                document.body.classList.remove('colored-locators');
                localStorage.setItem('color', 'false');
            } else {

                document.body.classList.add('colored-locators');
                localStorage.setItem('color', 'true');
            }
        }

        // Initialize the color on page load
        document.addEventListener('DOMContentLoaded', applyColor);

        // Add event listener to the color button
        document.getElementById('color-button').addEventListener('click', toggleColor);

// Function to apply visible copy buttons based on localStorage
        function applyCopyButtonsVisibility() {
            const copyButtonsVisibility = localStorage.getItem('copyButtonsVisibility');
            if (copyButtonsVisibility === 'true') {
                document.body.classList.add('copy-buttons-visible');
                
            } else {
                document.body.classList.remove('copy-buttons-visible');
               
            }
        }

        // Function to toggle the copy button visibility
        function toggleCopyButtonsVisibility() {
            if (document.body.classList.contains('copy-buttons-visible')) {
                document.body.classList.remove('copy-buttons-visible');
                localStorage.setItem('copyButtonsVisibility', 'false');
            } else {

                document.body.classList.add('copy-buttons-visible');
                localStorage.setItem('copyButtonsVisibility', 'true');
            }
        }

        // Initialize the copy button visibility on page load
        document.addEventListener('DOMContentLoaded', applyCopyButtonsVisibility);

        // Add event listener to the copy visibility button
        document.getElementById('eye-button').addEventListener('click', toggleCopyButtonsVisibility);

`;
