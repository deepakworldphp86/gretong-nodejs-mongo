module.exports = {
  getFrom: function (formArray) {
    var form = "";
    for (const [key, value] of Object.entries(formArray)) {

      if (key === "form") {
        form += `
          <form method="${value.method}" action="${value.action}" class="${value.class}" autocomplete="${value.autocomplete}" enctype="${value.enctype}" novalidate>`;
      }

      if (value.fieldType === "hidden") {
        form += `
          <input type="hidden" name="${key}" value="${value.value}" />`;
      }

      if (value.fieldType === "text") {
        form += `
          <div class="form-group">
            <label for="${value.id}" class="col-sm-2 control-label">${value.label}</label>
            <div class="col-sm-8">
              <input required="${value.required}" type="text" name="${key}" class="${value.class}" id="${value.id}" value="${value.value}" placeholder="${value.placeholder}">
            </div>
          </div>`;
      }

      if (value.fieldType === "select") {
        form += `
          <div class="form-group">
            <label for="${value.id}" class="col-sm-2 control-label">${value.label}</label>
            <div class="col-sm-8">
              <select name="${key}" id="${value.id}" class="form-control1">`;

        if (value.optionArray) {
          var arrVal = value.optionArray;
          for (const [key, value] of Object.entries(arrVal)) {
            form += `<option value="${key}">${value}</option>`;
          }
        }

        form += `
              </select>
            </div>
          </div>`;
      }

      if (value.fieldType === "multiselect") {
        form += `
          <div class="form-group">
            <label for="${value.id}" class="col-sm-2 control-label">${value.label}</label>
            <div class="col-sm-8">
              <select name="${key}" id="${value.id}" class="form-control1" multiple>`;

        if (value.optionArray) {
          for (let option of value.optionArray) {
            // Assuming option is an object with 'value' and 'label' properties
            form += `<option value="${option.value}">${option.label}</option>`;
          }
        }

        form += `
              </select>
            </div>
          </div>`;
      }



      if (value.fieldType === "upload") {
        form += `
        <div class="form-group">
          <label for="${value.id}" class="col-sm-2 control-label">${value.label}</label>
          <label for="exampleInputFile">File input</label>
          <input type="file" id="${value.id}" name="${key}">
          <p class="help-block">For ${value.label}</p>`;

        if (value.value) {
          form += `
          <input type="hidden" name="${key}" value="${value.value}" />
          <img id="${value.id}" src="${value.upload_path}${value.value}" width="107" height="98">`;
        }

        form += `
        </div>`;
      }



      if (value.fieldType === "submit" || value.fieldType === "button") {
        form += `
          <p>
            <button type="${value.fieldType}" name="${value.label}" value="${value.value}" class="${value.class}">
              ${value.label}
            </button>
          </p>`;
      }

    }

    return form;
  },
};
