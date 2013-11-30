function addURLPrefix(url){
    if (url == '') {
        url += '?';
    } else {
        url += '&';
    }

    return url;
}

function findAll(placeToSearch, jQueryExpression){
    return $(placeToSearch).filter(jQueryExpression).add($(placeToSearch).find(jQueryExpression))
}

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.executeScript(
    {
        code: "document.getElementsByTagName('html')[0].innerHTML;"
    },
    function (ps1) {
        window.html = ps1[0];
        var inputs = findAll(window.html, 'input, select, textarea');
        var tables = findAll(window.html, 'table');
        var title = $(window.html).filter('title').text();
        var scripts = findAll(window.html, 'script');
        var styles = findAll(window.html, 'style');

        var inputsWithoutID = [];
        var inputsWithoutName = [];
        var inputsWithoutLabel = [];
        var radiosWithoutValidationLabel = [];
        var numInlineStyles = 0;
        var numHeadlessTables = 0;
        var numTables = tables.length;
        var numInputs = inputs.length;
        var url = '';
        var totalNumScripts = scripts.length;
        var totalNumInlineScripts = 0;
        var safeObject;
        var safeNameObject;
        var safeLabelObject;
        var safeRadioObject;

        $(inputs).each(function () {
            if (($(this).attr('type') !== 'submit') && ($(this).attr('type') !== 'button')) {
                if ($(this).attr('id') == undefined) {
                    inputsWithoutID.push($(this).attr('name') + ' - ' + $(this).get(0).tagName + ' - ' + $(this).attr('type'));
                }
                else {
                    if ($(this).attr('type') !== 'hidden') {

                        var jQueryExpression = 'label[for="' + $(this).attr('id') + '"]';
                        var label = findAll(window.html, jQueryExpression);
                        if (label.length == 0) {
                            var type = $(this).attr('type');
                            var inputString = $(this).attr('id') + ' - ' + $(this).get(0).tagName;
                            if(undefined !== type){
                                inputString = inputString + ' - ' + $(this).attr('type')
                            }
                            inputsWithoutLabel.push(inputString);
                        }
                    }
                }
                if ($(this).attr('name') == undefined) {
                    inputsWithoutName.push($(this).attr('id') + ' - ' + $(this).get(0).tagName + ' - ' + $(this).attr('type'));
                }

                if ($(this).attr('type') === 'radio') {
                    if ($(this).attr('data-validationLabel') == undefined) {
                        radiosWithoutValidationLabel.push($(this).attr('name'));
                    }
                }
            }
        });

        $(tables).each(function () {
            var firstCellIsHeader = $(this).find('tr').first().children().first().is("th");
            if (firstCellIsHeader !== true) {
                numHeadlessTables++;
            }
        });

        $(html).find('*').each(function () {
            if ($(this).attr('style') != undefined) {
                numInlineStyles++;
            }
        });

        scripts.each(function () {
            if ($(this).attr('src') == undefined) {
                totalNumInlineScripts++;
            }
        });

        safeObject = encodeURI(inputsWithoutID);
        safeNameObject = encodeURI(inputsWithoutName);
        safeLabelObject = encodeURI(inputsWithoutLabel);
        safeRadioObject = encodeURI(radiosWithoutValidationLabel);

        if (safeObject != '') {
            url = addURLPrefix(url);
            url += 'elementNames=' + safeObject;
        }

        if (safeNameObject.length != '') {
            url = addURLPrefix(url);
            url += 'elementIDs=' + safeNameObject;
        }

        if (safeLabelObject != '') {
            url = addURLPrefix(url);
            url += 'elementsWithoutLabel=' + safeLabelObject;
        }

        if (safeRadioObject != '') {
            url = addURLPrefix(url);
            url += 'radiosWithoutValidationLabel=' + safeRadioObject;
        }

        if (numInlineStyles > 0) {
            url = addURLPrefix(url);
            url += 'numInlineStyles=' + numInlineStyles;
        }

        if (numTables > 0) {
            url = addURLPrefix(url);
            url += 'numTables=' + numTables;
        }

        if (numInputs > 0) {
            url = addURLPrefix(url);
            url += 'numInputs=' + numInputs;
        }

        if (numHeadlessTables > 0) {
            url = addURLPrefix(url);
            url += 'numHeadlessTables=' + numHeadlessTables;
        }

        if (totalNumScripts > 0) {
            url = addURLPrefix(url);
            url += 'totalNumScripts=' + totalNumScripts;
        }

        if (totalNumInlineScripts > 0) {
            url = addURLPrefix(url);
            url += 'totalNumInlineScripts=' + totalNumInlineScripts;
        }

        if (title != '') {
            url = addURLPrefix(url);
            url += 'title=' + title;
        }

        chrome.tabs.create({ 'url': 'tab.html' + url }, function (tab) {
            // Tab opened.
        });

    }
  );
});


