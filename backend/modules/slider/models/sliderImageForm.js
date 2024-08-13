const sliderImageForm = (dataArray, numberOfOptions = 4) => {
  const options = dataArray.formData.options || [];
  const correctOptions = Array.isArray(dataArray.formData.correctOptions) ? dataArray.formData.correctOptions : [];
  // Helper function to generate option fields
  const generateOptionsFields = (prefix, count) => {
    const optionFields = {};
    for (let i = 0; i < count; i++) { // Start from 0 and end at count-1 (4 options)
      optionFields[`${prefix}${String.fromCharCode(65 + i)}`] = {
        required: true,
        value: (options[i] !== undefined) ? options[i] : '', // Get the option or empty string if undefined
        fieldType: "textarea", // Set fieldType to "textarea"
        label: `Option ${String.fromCharCode(65 + i)}`, // A, B, C, D
        id: `${prefix}${String.fromCharCode(65 + i)}`,
        rows: "4", // Set rows for the textarea
        cols: "50", // Set cols for the textarea
        class: "form-control",
        placeholder: `Option ${String.fromCharCode(65 + i)}`,
        name: `${prefix}${String.fromCharCode(65 + i)}`
      };
    }
    return optionFields;
  };

  // Helper function to generate correct option options
  const generateCorrectOptions = (count) => {
    const correctOptions = {};
    for (let i = 0; i < count; i++) {
      const key = `${i + 1}`; // e.g., 'option1', 'option2'
      correctOptions[key] = `Option ${i + 1}`;
    }
    return correctOptions;
  };

  const form = {
    form: {
      required: false,
      method: "post",
      action: (dataArray.action !== undefined) ? dataArray.action : '',
      autocomplete: "off",
      class: "form-horizontal",
      enctype: "application/x-www-form-urlencoded",
    },
    _id: {
      required: false,
      value: ('_id' in dataArray.formData) ? dataArray.formData._id : '',
      fieldType: "hidden",
      id: "hexadecimal_id",
      name: "_id"
    },
    sliderId: {
      required: false,
      value: ('sliderId' in dataArray.formData) ? dataArray.formData.sliderId : '',
      fieldType: "hidden",
      label: "Slider ID",
      id: "sliderId",
      class: "form-control1",
      placeholder: "",
      name: "sliderId"
    },
    id: {
      required: false,
      value: ('id' in dataArray.formData) ? dataArray.formData.id : '',
      fieldType: "hidden",
      label: "QNA ID",
      id: "id",
      class: "form-control1",
      placeholder: "",
      name: "id"
    },
    createdDate: {
      required: false,
      value: (dataArray.formData.createdDate !== undefined) ? dataArray.formData.createdDate : '',
      fieldType: "hidden",
      label: "Created Date",
      id: "createdDate",
      class: "form-control1",
      placeholder: "",
      name: "createdDate"
    },
    modifiedDate: {
      required: false,
      value: (dataArray.formData.modifiedDate !== undefined) ? dataArray.formData.modifiedDate : '',
      fieldType: "hidden",
      label: "Update Date",
      id: "modifiedDate",
      class: "form-control1",
      placeholder: "",
      name: "modifiedDate"
    },
    question: {
      required: true,
      value: (dataArray.formData.question !== undefined) ? dataArray.formData.question : '',
      fieldType: "textarea", // Set fieldType to "textarea"
      label: "Question",
      id: "question",
      rows: "4", // Set rows for the textarea
      cols: "50", // Set cols for the textarea
      class: "form-control",
      placeholder: "Question",
      name: "question"
    },
    ...generateOptionsFields('options', numberOfOptions), // Generate fields for Answer A, B, C, D
    correctOptions: {
      required: true,
      value: correctOptions, // Ensure value is an array of selected correct options
      fieldType: "multiselect", // Set fieldType to "multiselect"
      label: "Correct Options",
      id: "correctOptions",
      optionArray: generateCorrectOptions(numberOfOptions), // Generate options
      class: "form-control1",
      name: "correctOptions",
      placeholder: "", // No placeholder needed for multi-select
    },
    points: {
      required: true,
      value: (dataArray.formData.points !== undefined) ? dataArray.formData.points : '',
      fieldType: "text", // Set fieldType to "textarea"
      label: "Points",
      id: "points",
      class: "form-control",
      placeholder: "Points",
      name: "points"
    },
    status: {
      required: true,
      value: (dataArray.formData.status !== undefined) ? dataArray.formData.status : '',
      fieldType: "select",
      label: "Active",
      optionArray: {
        0: "---------Please Select ------------------",
        1: "Active",
        2: "Inactive",
      },
      id: "status",
      class: "form-control1",
      placeholder: "",
      name: "status"
    },
    storeId: {
      required: true,
      value: (dataArray.formData.storeId !== undefined) ? dataArray.formData.storeId : '',
      fieldType: "select",
      label: "Store",
      id: "storeId",
      optionArray: {
        0: "---------Please Select ------------------",
        1: "1",
        2: "2",
      },
      class: "form-control1",
      placeholder: "",
      name: "storeId"
    },
    updateRequired: {
      required: true,
      value: (dataArray.formData.updateRequired !== undefined) ? dataArray.formData.updateRequired : '',
      fieldType: "select",
      label: "Update Required",
      id: "updateRequired",
      optionArray: {
        0: "---------Please Select ------------------",
        1: "Yes",
        2: "No",
      },
      class: "form-control1",
      placeholder: "",
      name: "updateRequired"
    },
    submit: {
      required: false,
      value: "Submit", // Only one value key
      label: "Submit",
      fieldType: "submit",
      id: "submit",
      class: 'btn btn-default w3ls-button',
      placeholder: "",
    },
  };

  return form;
};

// Export the model
module.exports = {
  sliderImageForm: sliderImageForm,
};
