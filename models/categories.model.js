// load the things we need
var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// define the schema for our user model
// User Form

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
    entity_id: {
      required: true,
      value: dataArray.formData.hasOwnProperty('entity_id') ? dataArray.formData.entity_id : '',
      fieldType: "hidden",
      label: "Entity Id",
      id: "cat_entity_id",
      class: "form-control1",
      placeholder: "",
    },
    Id: {
      required: true,
      value: dataArray.formData.hasOwnProperty('Id') ? dataArray.formData.Id : '',
      fieldType: "hidden",
      label: "Id",
      id: "cat_id",
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
    ParentId: {
      required: true,
      value: (dataArray.formData.ParentId !== undefined) ? dataArray.formData.ParentId : '',
      fieldType: "hidden",
      label: "Parent Id",
      id: "cat_parent",
      class: "form-control1",
      placeholder: "",
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
    CreatedDate: {
      required: false,
      value: (dataArray.formData.CreatedDate !== undefined) ? dataArray.formData.CreatedDate : '',
      label: "Created Date",
      fieldType: "date",
      id: "created_date",
      class: "form-control1",
      placeholder: "",
    },
    ModifiedDate: {
      required: false,
      value: (dataArray.formData.ModifiedDate !== undefined) ? dataArray.formData.ModifiedDate : '',     
      label: "Update Date",
      fieldType: "date",
      id: "cat_modification_date",
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
    ChannelId: {
      required: true,
      value: (dataArray.formData.ChannelId !== undefined) ? dataArray.formData.ChannelId : '',      
      label: "Channel",
      fieldType: "select",
      id: "cat_channel",
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
      id: "category_image",
      fieldType: "upload",
      class: "form-control1",
      upload_path : '/admin/uploads/',
      placeholder: "",
    },
    sync_error: {
      required: false,
      value: (dataArray.formData.sync_error !== undefined) ? dataArray.formData.sync_error : '',      
      label: "Sync Error",
      id: "cat_sync_error",
      fieldType: "text",
      class: "form-control1",
      placeholder: "",
    },
    magento_sync_status: {
      required: false,
      value: (dataArray.formData.magento_sync_status !== undefined) ? dataArray.formData.magento_sync_status : '',      
      label: "Magento Sync Status",
      fieldType: "select",
      id: "cat_mage_sync_status",
      statusArray: {
        0: "---------Please Select ------------------",
        1: "Yes",
        2: "No",
      },
      class: "form-control1",
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

catSchema = {
  entity_id: {
    type: String,
    required: true,
  },
  Id: {
    type: String,
    required: true,
  },
  Code: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  ParentId: {
    type: String,
    required: true,
  },
  Active: {
    type: String,
    required: true,
  },
  CreatedDate: {
    type: String,
    required: false,
  },
  ModifiedDate: {
    type: String,
    required: false,
  },
  ExternalId: {
    type: String,
    required: true,
  },
  ChannelId: {
    type: String,
    required: true,
  },
  UpdateRequired: {
    type: String,
    required: true,
  },
  CategoryImage: {
    type: String,
    required: false,
  },
  sync_error: {
    type: String,
    required: false,
  },
  magento_sync_status: {
    type: String,
    required: false,
  },
};

var categoriesSchema = mongoose.Schema(catSchema);

categoriesSchema.plugin(mongoosePaginate);

const Categories = mongoose.model("Categories", categoriesSchema);

Categories.paginate().then({}); // Usage

// create the model for users and expose it to our app
module.exports = {
  CategoriesModel: Categories,
  schema: catSchema,
  formArray: dynamicFormArray,
};
