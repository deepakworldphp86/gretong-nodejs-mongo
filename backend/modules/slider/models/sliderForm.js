const sliderForm = (dataArray) =>  {
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
    parentSliderId: {
      required: false,
      value: ('parentSliderId' in dataArray.formData) ? dataArray.formData.parentSliderId : '',
      fieldType: "hidden",
      label: "Parent Slider Id",
      id: "parentSliderId",
      class: "form-control1",
      placeholder: "",
      name: "parentSliderId"
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
      value: ('code' in dataArray.formData) ? dataArray.formData.code : '',
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
    sliderImage: {
      required: false,
      value: (dataArray.formData.sliderImage !== undefined) ? dataArray.formData.sliderImage : '',      
      label: "Slider Image",
      id: "image",
      fieldType: "upload",
      class: "form-control1",
      upload_path : '/admin/uploads/slider_image/',
      placeholder: "",
      name: "sliderImage"
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
  sliderForm: sliderForm,
};
