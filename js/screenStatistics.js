function getURLParameter(name) {
    return decodeURIComponent(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

var entityMap = {
    "&": "&",
    "<": "&lt;",
    ">": "&gt;",
    '"': '\"',
    "'": '\'',
    "/": '/'
  };

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

function buildDescriptionList(element){
    htmlMarkup = '<ul class="list-unstyled">';
    if(undefined != element.id){
        htmlMarkup += '<li>';
            htmlMarkup += '<span class="bold">ID :</span> '+ element.id; 
        htmlMarkup += '</li>';
    }
    if(undefined != element.name){
        htmlMarkup += '<li>';
            htmlMarkup += '<span class="bold">Name :</span> '+ element.name; 
        htmlMarkup += '</li>';
    }
    if(undefined != element.type){
        htmlMarkup += '<li>';
            htmlMarkup += '<span class="bold">Type :</span> '+ element.type; 
        htmlMarkup += '</li>';
    }
    if(undefined != element.tagName){
        htmlMarkup += '<li>';
            htmlMarkup += '<span class="bold">Tag Name :</span> '+ element.tagName; 
        htmlMarkup += '</li>';
    }
htmlMarkup += '</ul><hr /><div class="bold">Raw HTML :</div>';

return htmlMarkup;
}

function processInputsWithoutID(inputsArray){
    var htmlMarkup = '<table class="dataTable table table-striped"><thead><tr><th>HTML Elements</th></tr></thead>';
    $(inputsArray).each(function () {
        if (('hidden' != this.type)&&('HIDDEN' != this.type)) {
            htmlMarkup += '<tr><td>';
            htmlMarkup += buildDescriptionList(this);
            htmlMarkup += escapeHtml(this.originalHTML);
            htmlMarkup += '</td></tr>';
        }
    });
    htmlMarkup += '</table>';
    $('#missingIDContainer').html(htmlMarkup);
}

function processInputsWithoutName(inputsArray){
    var htmlMarkup = '<table class="dataTable table table-striped"><thead><tr><th>HTML Elements</th></tr></thead>';
    $(inputsArray).each(function () {
        if (this != '') {
            htmlMarkup += '<tr><td>';
            htmlMarkup += buildDescriptionList(this);
            htmlMarkup += escapeHtml(this.originalHTML);
            htmlMarkup += '</td></tr>';
        }
    });
    htmlMarkup += '</table>';
    $('#missingNameContainer').html(htmlMarkup);
}

function processInputsWithoutLabel(inputsArray){
    var htmlMarkup = '<table class="dataTable table table-striped"><thead><tr><th>HTML Elements</th></tr></thead>';
    $(inputsArray).each(function () {
        if ((undefined != this.name)&&(this.name.indexOf('ua_uw_') == -1)&&(this.name !== 'quick-jump')) {
            htmlMarkup += '<tr><td>';
            htmlMarkup += buildDescriptionList(this);
            htmlMarkup += escapeHtml(this.originalHTML);
            htmlMarkup += '</td></tr>';
        }
    });
    htmlMarkup += '</table>';
    $('#withIDMissingLabelContainer').html(htmlMarkup);
}

function processRadiosWithoutValidationLabel(inputsArray){
    var htmlMarkup = '<table class="dataTable table table-striped"><thead><tr><th>Name</th></tr></thead>';
    $(inputsArray).each(function () {
        if ((undefined != this.name)&&(this.name.indexOf('ua_uw_') == -1)) {
            htmlMarkup += '<tr><td>';
            htmlMarkup += buildDescriptionList(this);
            htmlMarkup += escapeHtml(this.originalHTML);
            htmlMarkup += '</td></tr>';
        }
    });
    htmlMarkup += '</table>';
    $('#radiosWithoutValidationLabelContainer').html(htmlMarkup);
}

function processETMData(ETMData){
    var htmlMarkup = '';

    //For every field
    for (var field in ETMData) {
      if (ETMData.hasOwnProperty(field)) {
        //for every edit type on that field
        for(var i = 0; i< ETMData[field].length; i++){
            htmlMarkup += '<tr><td>';
                htmlMarkup += ETMData[field][i].fieldName;
            htmlMarkup += '</td>';
            htmlMarkup += '<td>';
                htmlMarkup += ETMData[field][i].validationType;
            htmlMarkup += '</td>';
            htmlMarkup += '<td>';
                htmlMarkup += ETMData[field][i].val1;
            htmlMarkup += '</td>';
            htmlMarkup += '<td>';
                htmlMarkup += ETMData[field][i].val2;
            htmlMarkup += '</td>';
            htmlMarkup += '<td>';
                htmlMarkup += ETMData[field][i].val3;
            htmlMarkup += '</td>';
            htmlMarkup += '<td>';
                htmlMarkup += ETMData[field][i].displayName;
            htmlMarkup += '</td>';
            htmlMarkup += '<td>';
                htmlMarkup += ETMData[field][i].validationMessage;
            htmlMarkup += '</td>';
            htmlMarkup += '</tr>';
        }
      }
    }

    $('#ETMTableBody').html(htmlMarkup);
}

/*chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if((message.messageName)&&(message.messageName == 'processValues')){

        $('#propertyTableBody').append('<tr><td>Total Number of Scripts</td><td>' + message.processObject.totalNumScripts + '</td></tr>');
        
        processInputsWithoutID(message.processObject.inputsWithoutID);
        processInputsWithoutName(message.processObject.inputsWithoutName);
        processInputsWithoutLabel(message.processObject.inputsWithoutLabel);
        processRadiosWithoutValidationLabel(message.processObject.radiosWithoutValidationLabel);
        processETMData(message.processObject.ETMData);

        $('#propertyTableBody').append('<tr><td>Number of Inline Styles</td><td>' + message.processObject.numInlineStyles + '</td></tr>');
        $('#propertyTableBody').append('<tr><td>Number of Inputs (Input, Select, Textarea) on the page</td><td>' + message.processObject.numInputs + '</td></tr>');
        $('#propertyTableBody').append('<tr><td>Total Number of Tables on the page</td><td>' + message.processObject.numTables + '</td></tr>');
        $('#propertyTableBody').append('<tr><td>Number of Tables without TH tags. These are probably invalid or are used for layout</td><td>' + message.processObject.numHeadlessTables + '</td></tr>');
        $('#propertyTableBody').append('<tr><td>Number of Inline Scripts</td><td>' + message.processObject.totalNumInlineScripts + '</td></tr>');
        $('#pageTitle').append(message.processObject.title);

        $('.dataTable').dataTable({
            "aLengthMenu": [[5, 10, 15, 25, 50, 100, -1], [5, 10, 15, 25, 50, 100, "All"]],
            "iDisplayLength": 5
        });

        var oTable = $('#ETMTable').dataTable();
        var oSettings = oTable.fnSettings();
        oSettings._iDisplayLength = 25;
        oTable.fnDraw();
    }

});*/

$(document).ready(function(){
    $('.nav-tabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    })
});