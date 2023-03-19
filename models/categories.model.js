// load the things we need
var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// define the schema for our user model
// User Form

const dynamicFormArray = (dataArray) =>  {
  form = {
    form: {
      required: true,
      method: "post",
      action: dataArray.action,
      autocomplete: "off",
      novalidate: "novalidate",
      class: "form-horizontal",
      enctype: "multipart/form-data",
    },
    entity_id: {
      required: true,
      value: "value",
      fieldType: "hidden",
      label: "Entity Id",
      id: "cat_entity_id",
      class: "form-control1",
      placeholder: "",
    },
    Id: {
      required: true,
      value: "value",
      fieldType: "hidden",
      label: "Id",
      id: "cat_id",
      class: "form-control1",
      placeholder: "",
    },
    Code: {
      required: true,
      value: "value",
      fieldType: "text",
      label: "Code",
      id: "cat_code",
      class: "form-control1",
      placeholder: "Code",
    },
    Name: {
      required: true,
      value: "value",
      fieldType: "text",
      label: "Name",
      id: "cat_name",
      class: "form-control1",
      placeholder: "Name",
    },
    ParentId: {
      required: true,
      value: "value",
      fieldType: "hidden",
      label: "Parent Id",
      id: "cat_parent",
      class: "form-control1",
      placeholder: "",
    },
    Active: {
      required: true,
      value: "value",
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
      required: true,
      value: "value",
      label: "Created Date",
      fieldType: "date",
      id: "created_date",
      class: "form-control1",
      placeholder: "",
    },
    ModifiedDate: {
      required: true,
      value: "value",
      label: "Update Date",
      fieldType: "date",
      id: "cat_modification_date",
      class: "form-control1",
      placeholder: "",
    },
    ExternalId: {
      required: true,
      value: "value",
      label: "External  Id",
      fieldType: "text",
      id: "cat_external_id",
      class: "form-control1",
      placeholder: "",
    },
    ChannelId: {
      required: true,
      value: "value",
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
      value: "value",
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
    },
    sync_error: {
      required: false,
      value: "value",
      label: "Sync Error",
      id: "cat_sync_error",
      fieldType: "text",
      class: "form-control1",
      placeholder: "",
    },
    magento_sync_status: {
      required: false,
      value: "value",
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
      required: true,
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
    required: true,
  },
  ModifiedDate: {
    type: String,
    required: true,
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
