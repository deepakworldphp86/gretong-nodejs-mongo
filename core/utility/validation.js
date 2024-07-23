module.exports = {
  getValidate:  function (req, formArray) {
    for (const [key, value] of Object.entries(formArray)) {
      const exceptField = ["form", "submit"];

      if (value.required == true && !exceptField.includes(key)) {
        req.checkBody(key, "" + value.label + " is required").notEmpty();
      }
    }

    return req.validationErrors();
  },
};
