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
    Id: {
      required: true,
      value: ('Id' in dataArray.formData) ? dataArray.formData.Id : '',
      fieldType: "hidden",
      label: "Id",
      id: "cat_id",
      class: "form-control1",
      placeholder: "",
    },
    ParentId: {
      required: true,
      value: ('ParentId' in dataArray.formData) ? dataArray.formData.ParentId : '',
      fieldType: "hidden",
      label: "Parent Id",
      id: "cat_parent",
      class: "form-control1",
      placeholder: "",
    },
    CreatedDate: {
      required: false,
      value: (dataArray.formData.CreatedDate !== undefined) ? dataArray.formData.CreatedDate : '',
      label: "Created Date",
      fieldType: "hidden",
      id: "created_date",
      class: "form-control1",
      placeholder: "",
    },
    ModifiedDate: {
      required: false,
      value: (dataArray.formData.ModifiedDate !== undefined) ? dataArray.formData.ModifiedDate : '',     
      label: "Update Date",
      fieldType: "hidden",
      id: "cat_modification_date",
      class: "form-control1",
      placeholder: "",
    },
    Code: {
      required: true,
      value: ('Code' in dataArray.formData) ? dataArray.formData.Code : '',
      fieldType: "text",
      label: "Code",
      id: "cat_code",
      class: "form-control1",
      placeholder: "Code",
    },
    Name: {
      required: true,
      value: (dataArray.formData.Name !== undefined) ? dataArray.formData.Name : '',
      fieldType: "text",
      label: "Name",
      id: "cat_name",
      class: "form-control1",
      placeholder: "Name",
    },
    Active: {
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
    ExternalId: {
      required: true,
      value: (dataArray.formData.ExternalId !== undefined) ? dataArray.formData.ExternalId : '',      
      label: "Update Date",
      label: "External  Id",
      fieldType: "text",
      id: "cat_external_id",
      class: "form-control1",
      placeholder: "",
    },
    StoreId: {
      required: true,
      value: (dataArray.formData.StoreId !== undefined) ? dataArray.formData.StoreId : '',      
      label: "Store",
      fieldType: "select",
      id: "cat_store",
      statusArray: {
        0: "---------Please Select ------------------",
        1: "1",
        2: "2",
      },
      class: "form-control1",
      placeholder: "",
    },
    UpdateRequired: {
      required: true,
      value: (dataArray.formData.UpdateRequired !== undefined) ? dataArray.formData.UpdateRequired : '',      
      label: "Update  Required",
      fieldType: "select",
      id: "cat_update_req",
      statusArray: {
        0: "---------Please Select ------------------",
        1: "Yes",
        2: "No",
      },
      class: "form-control1",
      placeholder: "",
    },CategoryImage: {
      required: false,
      value: (dataArray.formData.CategoryImage !== undefined) ? dataArray.formData.CategoryImage : '',      
      label: "Category Image",
      id: "CategoryImage",
      fieldType: "upload",
      class: "form-control1",
      upload_path : '/admin/uploads/category_image/',
      placeholder: "",
    },
    submit: {
      required: false,
      value: (dataArray.formData.submit !== undefined) ? dataArray.formData.submit : '',      
      value: "Submit",
      label: "Submit",
      fieldType: "submit",
      id: "cat_submit",
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
