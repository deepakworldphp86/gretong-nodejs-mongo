const sliderImageForm = (dataArray) =>  {
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
    sliderId: {
      required: false,
      value: ('sliderId' in dataArray.formData) ? dataArray.formData.sliderId : '',
      fieldType: "hidden",
      label: "Slider Id",
      id: "sliderId",
      class: "form-control1",
      placeholder: "",
      name: "sliderId"
    },
    sliderImageId: {
      required: false,
      value: ('sliderImageId' in dataArray.formData) ? dataArray.formData.sliderImageId : '',
      fieldType: "hidden",
      label: "Slider Images id",
      id: "sliderImageId",
      class: "form-control1",
      placeholder: "",
      name: "sliderImageId"
    },
    sliderTitle: {
      required: true,
      value: (dataArray.formData.sliderTitle !== undefined) ? dataArray.formData.sliderTitle : '',
      fieldType: "text",
      label: "Slider Title",
      id: "sliderTitle",
      class: "form-control1",
      placeholder: "Slider Title",
      name: "sliderTitle"
    },
    sliderText: {
      required: true,
      value: ('sliderText' in dataArray.formData) ? dataArray.formData.sliderText : '',
      fieldType: "text",
      label: "Slider Text",
      id: "sliderText",
      class: "form-control1",
      placeholder: "Slider Text",
      name: "sliderText"
    },
    url: {
      required: true,
      value: (dataArray.formData.url !== undefined) ? dataArray.formData.url : '',
      fieldType: "text",
      label: "Url",
      id: "url",
      class: "form-control1",
      placeholder: "Url",
      name: "url"
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
    childSliderImage: {
      required: false,
      value: (dataArray.formData.childSliderImage !== undefined) ? dataArray.formData.childSliderImage : '',      
      label: "Slider Image",
      id: "childSliderImage",
      fieldType: "upload",
      class: "form-control1",
      upload_path : '/admin/uploads/slider_image/',
      placeholder: "",
      name: "childSliderImage"
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
  sliderImageForm: sliderImageForm,
};
