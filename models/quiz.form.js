const dynamicFormArray = (dataArray) =>  {
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
      id: "hexadecimal_id"
    },
    id: {
      required: false,
      value: ('id' in dataArray.formData) ? dataArray.formData.id : '',
      fieldType: "hidden",
      label: "id",
      id: "id",
      class: "form-control1",
      placeholder: "",
    },
    created_date: {
      required: false,
      value: (dataArray.formData.created_date !== undefined) ? dataArray.formData.created_date : '',
      label: "Created Date",
      fieldType: "hidden",
      id: "created_date",
      class: "form-control1",
      placeholder: "",
    },
    modified_date: {
      required: false,
      value: (dataArray.formData.modified_date !== undefined) ? dataArray.formData.modified_date : '',     
      label: "Update Date",
      fieldType: "hidden",
      id: "modified_date",
      class: "form-control1",
      placeholder: "",
    },
    code: {
      required: true,
      value: ('Code' in dataArray.formData) ? dataArray.formData.code : '',
      fieldType: "text",
      label: "Quiz Code",
      id: "code",
      class: "form-control1",
      placeholder: "Quiz Code",
    },
    name: {
      required: true,
      value: (dataArray.formData.name !== undefined) ? dataArray.formData.name : '',
      fieldType: "text",
      label: "Name",
      id: "name",
      class: "form-control1",
      placeholder: "Quiz Name",
    },
    active: {
      required: true,
      value: (dataArray.formData.active !== undefined) ? dataArray.formData.active : '',
      fieldType: "select",
      label: "Active",
      statusArray: {
        0: "---------Please Select ------------------",
        1: "Active",
        2: "InActive",
      },
      id: "active",
      class: "form-control1",
      placeholder: "",
    },
    store_id: {
      required: true,
      value: (dataArray.formData.store_id !== undefined) ? dataArray.formData.store_id : '',      
      label: "Store",
      fieldType: "select",
      id: "store_id",
      statusArray: {
        0: "---------Please Select ------------------",
        1: "1",
        2: "2",
      },
      class: "form-control1",
      placeholder: "",
    },
    update_required: {
      required: true,
      value: (dataArray.formData.update_required !== undefined) ? dataArray.formData.update_required : '',      
      label: "Update  Required",
      fieldType: "select",
      id: "update_required",
      statusArray: {
        0: "---------Please Select ------------------",
        1: "Yes",
        2: "No",
      },
      class: "form-control1",
      placeholder: "",
    },
    image: {
      required: false,
      value: (dataArray.formData.image !== undefined) ? dataArray.formData.image : '',      
      label: "Quiz Image",
      id: "image",
      fieldType: "upload",
      class: "form-control1",
      upload_path : '/admin/uploads/quiz_image/',
      placeholder: "",
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
  formArray: dynamicFormArray,
};
