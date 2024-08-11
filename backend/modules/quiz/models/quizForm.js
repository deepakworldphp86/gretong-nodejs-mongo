const quizForm = (dataArray) =>  {
  form = {
    form: {
      required: false,
      method: "post",
      action:(dataArray.action !== undefined) ? dataArray.action : '',
      autocomplete: "off",
      //novalidate: "novalidate",
      class: "form-horizontal",
      enctype: "multipart/form-data",
    },
    _id: {
      required: false,
      value: ('_id' in dataArray.formData) ? dataArray.formData._id : '',
      fieldType: "hidden",
      id: "hexadecimal_id",
      name: "_id"
    },
    id: {
      required: false,
      value: ('id' in dataArray.formData) ? dataArray.formData.id : '',
      fieldType: "hidden",
      label: "id",
      id: "id",
      class: "form-control1",
      placeholder: "",
      name: "id"
    },
    createdDate: {
      required: false,
      value: (dataArray.formData.createdDate !== undefined) ? dataArray.formData.createdDate : '',
      label: "Created Date",
      fieldType: "hidden",
      id: "createdDate",
      class: "form-control1",
      placeholder: "",
      name: "createdDate"
    },
    modifiedDate: {
      required: false,
      value: (dataArray.formData.modifiedDate !== undefined) ? dataArray.formData.modifiedDate : '',     
      label: "Update Date",
      fieldType: "hidden",
      id: "modifiedDate",
      class: "form-control1",
      placeholder: "",
      name: "modifiedDate"
    },
    name: {
      required: true,
      value: (dataArray.formData.name !== undefined) ? dataArray.formData.name : '',
      fieldType: "text",
      label: "Name",
      id: "name",
      class: "form-control1",
      placeholder: "Name",
      name: "name"
    },
    code: {
      required: true,
      value: ('Code' in dataArray.formData) ? dataArray.formData.code : '',
      fieldType: "text",
      label: "Code",
      id: "code",
      class: "form-control1",
      placeholder: "Code",
      name: "code"
    },
    description: {
      required: true,
      value: (dataArray.formData.description !== undefined) ? dataArray.formData.description : '',
      fieldType: "text",
      label: "Description",
      id: "description",
      class: "form-control1",
      placeholder: "Description",
      name: "description"
    },
    totalQuestion: {
      required: true,
      value: (dataArray.formData.totalQuestion !== undefined) ? dataArray.formData.totalQuestion : '',
      fieldType: "text",
      label: "Total Question",
      id: "totalQuestion",
      class: "form-control1",
      placeholder: "Total Question",
      name: "totalQuestion"
    },
    difficulty: {
      required: true,
      value: (dataArray.formData.difficulty !== undefined) ? dataArray.formData.difficulty : '',
      fieldType: "select",
      label: "Difficulty",
      optionArray: {
        0: "---------Please Select ------------------",
        1: "Medium",
        2: "High",
      },
      id: "difficulty",
      class: "form-control1",
      placeholder: "",
      name: "difficulty"
    },
    status: {
      required: true,
      value: (dataArray.formData.status !== undefined) ? dataArray.formData.status : '',
      fieldType: "select",
      label: "Active",
      optionArray: {
        0: "---------Please Select ------------------",
        1: "Active",
        2: "InActive",
      },
      id: "active",
      class: "form-control1",
      placeholder: "",
      name: "status"
    },
    storeId: {
      required: true,
      value: (dataArray.formData.storeId !== undefined) ? dataArray.formData.storeId : '',      
      label: "Store",
      fieldType: "select",
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
      label: "Update  Required",
      fieldType: "select",
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
    quizImage: {
      required: false,
      value: (dataArray.formData.quizImage !== undefined) ? dataArray.formData.quizImage : '',      
      label: "Quiz Image",
      id: "image",
      fieldType: "upload",
      class: "form-control1",
      upload_path : '/admin/uploads/quiz_image/',
      placeholder: "",
      name: "quizImage"
    },
    submit: {
      required: false,
      value: (dataArray.formData.submit !== undefined) ? dataArray.formData.submit : '',      
      value: "Submit",
      label: "Submit",
      fieldType: "submit",
      id: "submit",
      class: 'btn btn-default w3ls-button',
      placeholder: "",
    },
  };

  return form;
};



// create the model for users and expose it to our app
module.exports = {
  quizForm: quizForm,
};
