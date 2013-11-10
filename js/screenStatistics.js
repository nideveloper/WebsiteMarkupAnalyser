function getURLParameter(name) {
    return decodeURIComponent(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

jQuery(document).ready(function () {
    var elementNamesString = getURLParameter('elementNames');
    if ('null' != elementNamesString) {
        var elementNamesArray = elementNamesString.split(',');
        var convertedString = '<table class="dataTable table table-striped"><thead><tr><th>Name - Element - Type</th></tr></thead>';
        $(elementNamesArray).each(function () {
            if (this != '') {
                convertedString += '<tr><td>';
                convertedString += this;
                convertedString += '</td></tr>';
            }
        });
        convertedString += '</table>';
        $('#missingIDContainer').html(convertedString);
    }

    var elementIDsString = getURLParameter('elementIDs');
    if ('null' != elementIDsString) {
        var elementIDArray = elementIDsString.split(',');
        var convertedString2 = '<table class="dataTable table table-striped"><thead><tr><th>ID - Element - Type</th></tr></thead>';
        $(elementIDArray).each(function () {
            if (this != '') {
                convertedString2 += '<tr><td>';
                convertedString2 += this;
                convertedString2 += '</td></tr>';
            }
        });
        convertedString2 += '</table>';
        $('#missingNameContainer').html(convertedString2);
    }

    var elementWithoutLabelString = getURLParameter('elementsWithoutLabel');
    if ('null' != elementWithoutLabelString) {
        var elementsWithoutLabelArray = elementWithoutLabelString.split(',');
        var convertedString3 = '<table class="dataTable table table-striped"><thead><tr><th>ID - Element - Type</th></tr></thead>';
        $(elementsWithoutLabelArray).each(function () {
            if (this != '') {
                convertedString3 += '<tr><td>';
                convertedString3 += this;
                convertedString3 += '</td></tr>';
            }
        });
        convertedString3 += '</table>';
        $('#withIDMissingLabelContainer').html(convertedString3);
    }

    var radiosWithoutValidationLabelString = getURLParameter('radiosWithoutValidationLabel');
    if ('null' != radiosWithoutValidationLabelString) {
        var radiosWithoutValidationLabelArray = radiosWithoutValidationLabelString.split(',');
        var convertedString3 = '<table class="dataTable table table-striped"><thead><tr><th>Name</th></tr></thead>';
        $(radiosWithoutValidationLabelArray).each(function () {
            if (this != '') {
                convertedString3 += '<tr><td>';
                convertedString3 += this;
                convertedString3 += '</td></tr>';
            }
        });
        convertedString3 += '</table>';
        $('#radiosWithoutValidationLabelContainer').html(convertedString3);
    }

    var numInlineStyles = getURLParameter('numInlineStyles');
    if ('null' != numInlineStyles) {
        $('#propertyTableBody').append('<tr><td>Number of Inline Styles</td><td>' + numInlineStyles + '</td></tr>');
    }

    var numInputs = getURLParameter('numInputs');
    if ('null' != numInputs) {
        $('#propertyTableBody').append('<tr><td>Number of Inputs (Input, Select, Textarea) on the page</td><td>' + numInputs + '</td></tr>');
    }

    var numTables = getURLParameter('numTables');
    if ('null' != numTables) {
        $('#propertyTableBody').append('<tr><td>Total Number of Tables on the page</td><td>' + numTables + '</td></tr>');
    }

    var numHeadlessTables = getURLParameter('numHeadlessTables');
    if ('null' != numHeadlessTables) {
        $('#propertyTableBody').append('<tr><td>Number of Tables without TH tags. These are probably invalid or are used for layout</td><td>' + numHeadlessTables + '</td></tr>');
    }

    var totalNumScripts = getURLParameter('totalNumScripts');
    if ('null' != numInputs) {
        $('#propertyTableBody').append('<tr><td>Total Number of Scripts</td><td>' + totalNumScripts + '</td></tr>');
    }

    var totalNumInlineScripts = getURLParameter('totalNumInlineScripts');
    if ('null' != numInputs) {
        $('#propertyTableBody').append('<tr><td>Number of Inline Scripts</td><td>' + totalNumInlineScripts + '</td></tr>');
    }

    var pageTitle = getURLParameter('title');
    if ('null' != pageTitle) {
        $('#pageTitle').append(pageTitle);
    }

    $('.dataTable').dataTable({
        "aLengthMenu": [[5, 10, 15, 25, 50, 100, -1], [5, 10, 15, 25, 50, 100, "All"]],
        "iDisplayLength": 5
    });
});