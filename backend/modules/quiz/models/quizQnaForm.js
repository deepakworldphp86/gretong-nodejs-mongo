const quizQnaForm = (dataArray, numberOfAnswers = 4) => {
  const answers = dataArray.formData.answers || [];
  const correctAnswers = Array.isArray(dataArray.formData.correctAnswer) ? dataArray.formData.correctAnswer : [];

  // Helper function to generate answer fields
  const generateAnswerFields = (prefix, count) => {
    const answerFields = {};
    for (let i = 0; i < count; i++) { // Start from 0 and end at count-1 (4 answers)
      answerFields[`${prefix}${String.fromCharCode(65 + i)}`] = {
        required: true,
        value: (answers[i] !== undefined) ? answers[i] : '', // Get the answer or empty string if undefined
        fieldType: "textarea", // Set fieldType to "textarea"
        label: `Answer ${String.fromCharCode(65 + i)}`, // A, B, C, D
        id: `${prefix}${String.fromCharCode(65 + i)}`,
        rows: "4", // Set rows for the textarea
        cols: "50", // Set cols for the textarea
        class: "form-control",
        placeholder: `Answer ${String.fromCharCode(65 + i)}`,
        name: `${prefix}${String.fromCharCode(65 + i)}`
      };
    }
    return answerFields;
  };

  // Helper function to generate correct answer options
  const generateCorrectAnswerOptions = (count) => {
    const correctAnswerOptions = {};
    for (let i = 0; i < count; i++) { // Start from 0 and end at count-1 (4 options)
      const key = `answer${String.fromCharCode(65 + i)}`; // e.g., 'answerA', 'answerB'
      correctAnswerOptions[key] = `Answer ${String.fromCharCode(65 + i)}`;
    }
    return correctAnswerOptions;
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
    quizId: {
      required: false,
      value: ('quizId' in dataArray.formData) ? dataArray.formData.quizId : '',
      fieldType: "hidden",
      label: "Quiz ID",
      id: "quizId",
      class: "form-control1",
      placeholder: "",
      name: "quizId"
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
    ...generateAnswerFields('answer', numberOfAnswers), // Generate fields for Answer A, B, C, D
    correctAnswer: {
      required: true,
      value: correctAnswers, // Ensure value is an array of selected correct answers
      fieldType: "multiselect", // Set fieldType to "multiselect"
      label: "Correct Answers",
      id: "correctAnswer",
      optionArray: generateCorrectAnswerOptions(numberOfAnswers), // Generate options
      class: "form-control1",
      name: "correctAnswer",
      placeholder: "", // No placeholder needed for multi-select
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
  quizQnaForm: quizQnaForm,
};
