document.addEventListener('DOMContentLoaded', () => {
    // Select all checkboxes with the class 'myCheckbox'
    const checkboxes = document.querySelectorAll('.product-slider');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateValue(checkbox);
        });
    });

    function updateValue(checkbox) {
        // Update the 'value' attribute based on the checked state
        if (checkbox.checked) {
          
            checkbox.setAttribute('value', '1'); // Set value to '1' when checked
        } else {
            checkbox.setAttribute('value', '0'); // Set value to '0' when unchecked
        }
    }
});
