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
      required: true,
      value: ('Id' in dataArray.formData) ? dataArray.formData.Id : '',
      fieldType: "hidden",
      label: "Id",
      id: "id",
      class: "form-control1",
      placeholder: "",
    },
    created_date: {
      required: false,
      value: (dataArray.formData.CreatedDate !== undefined) ? dataArray.formData.CreatedDate : '',
      label: "Created Date",
      fieldType: "hidden",
      id: "created_date",
      class: "form-control1",
      placeholder: "",
    },
    modified_date: {
      required: false,
      value: (dataArray.formData.ModifiedDate !== undefined) ? dataArray.formData.ModifiedDate : '',     
      label: "Update Date",
      fieldType: "hidden",
      id: "modification_date",
      class: "form-control1",
      placeholder: "",
    },
    code: {
      required: true,
      value: ('Code' in dataArray.formData) ? dataArray.formData.Code : '',
      fieldType: "text",
      label: "Quiz Code",
      id: "code",
      class: "form-control1",
      placeholder: "Quiz Code",
    },
    name: {
      required: true,
      value: (dataArray.formData.Name !== undefined) ? dataArray.formData.Name : '',
      fieldType: "text",
      label: "name",
      id: "name",
      class: "form-control1",
      placeholder: "Quiz Name",
    },
    active: {
      required: true,
      value: (dataArray.formData.Active !== undefined) ? dataArray.formData.Active : '',
      fieldType: "select",
      label: "Active",
      statusArray: {
        0: "---------Please Select ------------------",
        1: "Active",
        2: "InActive",
      },
      id: "cat_active",
      class: "form-control1",
      placeholder: "",
    },
    store_id: {
      required: true,
      value: (dataArray.formData.StoreId !== undefined) ? dataArray.formData.StoreId : '',      
      label: "Store",
      fieldType: "select",
      id: "store",
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
      value: (dataArray.formData.UpdateRequired !== undefined) ? dataArray.formData.UpdateRequired : '',      
      label: "Update  Required",
      fieldType: "select",
      id: "update_req",
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
      value: (dataArray.formData.CategoryImage !== undefined) ? dataArray.formData.CategoryImage : '',      
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
      id: "quiz_submit",
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
