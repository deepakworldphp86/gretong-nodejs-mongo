module.exports = {
  getFrom: function (formArray) {
    var form = "";
    for (const [key, value] of Object.entries(formArray)) {
   
      if (key == "form") {
        console.log(key);
        form =
          form +
          "<form method=" +
          value.method +
          " action=" +
          value.action +
          " class=" +
          value.class +
          " autocomplete=" +
          value.autocomplete +
          " novalidate=" +
          value.novalidate +
          " enctype=" +
          value.enctype +
          ">";
      }
      if (value.fieldType === "hidden") {
        form =
          form +
          '<input type="hidden" name="' +
          value.id +
          '" value="' +
          value.value +
          '" />';
      }
      if (value.fieldType === "text") {
        form = form + '<div class="form-group">';
        form =
          form +
          '<label for="' +
          value.id +
          '" class="col-sm-2 control-label">' +
          value.label +
          "</label>";
        form = form + '<div class="col-sm-8">';
        form =
          form +
          "<input  required=" +
          value.required +
          ' type="text" name="' +
          value.label +
          '" class="' +
          value.class +
          '" id="' +
          value.id +
          '" placeholder="' +
          value.placeholder +
          '">';
        form = form + "</div>";
        form = form + "</div>";
      }
      if (value.fieldType === "select") {
        form = form + '<div class="form-group">';
        form =
          form +
          '<label for="selector1" class="col-sm-2 control-label">' +
          value.label +
          "</label>";
        form =
          form +
          '<div class="col-sm-8"><select name="' +
          value.label +
          '" id="' +
          value.id +
          '" class="form-control1">';
        if (value.statusArray) {
          var arrVal = value.statusArray;
          for (const [key, value] of Object.entries(arrVal)) {
            var val = "";
            var val = key == 0 ? " " : key;
            form = form + "<option id=" + val + ">" + value + "</option>";
          }
        }

        form = form + "</select></div>";
        form = form + "</div>";
      }

      if (value.fieldType === "submit" || value.fieldType === "button") {
        form = form + " <p>";
        form = form + "<button  type=" + value.fieldType + " name=" + value.label + " value=" + value.value + " class='" + value.class +"' />" + value.label + "</button>";
        form = form + "</p>";
      }

    }

    return form;
  },
};
