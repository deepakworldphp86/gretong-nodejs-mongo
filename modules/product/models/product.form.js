const dynamicFormArray = (dataArray) => {

  form = {
    form: {
      required: false,
      method: "post",
      action: (dataArray.action !== undefined) ? dataArray.action : '',
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
      value: ('Id' in dataArray.formData) ? dataArray.formData.id : '',
      fieldType: "hidden",
      label: "Id",
      id: "prod_id",
      class: "form-control1",
      placeholder: "",
    },
    Sku: {
      required: true,
      value: ('Sku' in dataArray.formData) ? dataArray.formData.sku : '',
      fieldType: "hidden",
      label: "Product sku",
      id: "sku",
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
    Sku: {
      required: true,
      value: ('Sku' in dataArray.formData) ? dataArray.formData.sku : '',
      fieldType: "text",
      label: "Sku",
      id: "prod_code",
      class: "form-control1",
      placeholder: "Sku",
    },
    Name: {
      required: true,
      value: (dataArray.formData.Name !== undefined) ? dataArray.formData.name : '',
      fieldType: "text",
      label: "Name",
      id: "prod_name",
      class: "form-control1",
      placeholder: "Name",
    },
    Price: {
      required: true,
      value: ('Price' in dataArray.formData) ? dataArray.formData.price : '',
      fieldType: "text",
      label: "Price",
      id: "prod_price",
      class: "form-control1",
      placeholder: "1.00",
    },
    Categories: {
      required: true,
      value: (dataArray.formData.storeId !== undefined) ? dataArray.formData.storeId : '',
      label: "Product Categories",
      fieldType: "multiselect",
      id: "prod_categories",
      statusArray: dataArray.formData.Categories,
      class: "form-control1",
      placeholder: "",
    },
    Active: {
      required: true,
      value: (dataArray.formData.active !== undefined) ? dataArray.formData.active : '',
      fieldType: "select",
      label: "Active",
      optionArray: {
        0: "---------Please Select ------------------",
        1: "Active",
        2: "InActive",
      },
      id: "cat_active",
      class: "form-control1",
      placeholder: "",
    },
    StoreId: {
      required: true,
      value: (dataArray.formData.storeId !== undefined) ? dataArray.formData.storeId : '',
      label: "Store",
      fieldType: "select",
      id: "prod_store",
      optionArray: {
        0: "---------Please Select ------------------",
        1: "1",
        2: "2",
      },
      class: "form-control1",
      placeholder: "",
    },
    UpdateRequired: {
      required: true,
      value: (dataArray.formData.updateRequired !== undefined) ? dataArray.formData.updateRequired : '',
      label: "Update  Required",
      fieldType: "select",
      id: "prod_update_req",
      optionArray: {
        0: "---------Please Select ------------------",
        1: "Yes",
        2: "No",
      },
      class: "form-control1",
      placeholder: "",
    }, ProductImage: {
      required: false,
      value: (dataArray.formData.imageUrl !== undefined) ? dataArray.formData.imageUrl : '',
      label: "Product Image",
      id: "ProductImage",
      fieldType: "upload",
      class: "form-control1",
      upload_path: '/admin/uploads/product_images/',
      placeholder: "",
    },
    submit: {
      required: false,
      value: (dataArray.formData.submit !== undefined) ? dataArray.formData.submit : '',
      value: "Submit",
      label: "Submit",
      fieldType: "submit",
      id: "prod_submit",
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
