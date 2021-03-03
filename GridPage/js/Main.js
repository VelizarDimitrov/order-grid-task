$(function (GridSystem) {
    GridSystem = GridSystem || {};
    GridSystem.getUrl = "https://jsonp.afeld.me/?callback=&url=https%3A%2F%2Fservices.odata.org%2FTripPinRESTierService%2F%28S%283jgtctz5a2wyzb0gi3pxikvb%29%29%2FPeople";
    GridSystem.sorttUrl = "https://jsonp.afeld.me/?callback=&url=https%3A%2F%2Fservices.odata.org%2FTripPinRESTierService%2F%28S%283jgtctz5a2wyzb0gi3pxikvb%29%29%2FPeople";
    GridSystem.loadedPeople = GridSystem.loadedPeople || {};
    GridSystem.sortBy = GridSystem.sortBy || "";
    GridSystem.GetData = function () {
        var headers = { 'Content-Type': 'application/json', Accept: 'application/json', 'Access-Control-Allow-Origin': '*' };
        $("#jqxLoader").jqxLoader({ width: 250, height: 150 });
        $('#jqxLoader').jqxLoader('open');
        $.ajax({
            url: GridSystem.sorttUrl,
            type: 'GET',
            crossDomain: true
        })
            .done(function (data) {
                GridSystem.loadedPeople = data.value;
                GridSystem.GenerateGrid();
            });
    };

    GridSystem.GenerateGrid = function () {
        let data = [];
        let currRowAddressInfo;
        let currRowHomeAddress;
        for (var i = 0; i < GridSystem.loadedPeople.length; i++) {
            var row = {};
            if (GridSystem.loadedPeople[i].AddressInfo.length) {
                currRowAddressInfo = GridSystem.loadedPeople[i].AddressInfo[0].Address + '\nCity:Name:' + GridSystem.loadedPeople[i].AddressInfo[0].City.Name + '\nCountryRegion:' + GridSystem.loadedPeople[i].AddressInfo[0].City.CountryRegion + '\nRegion' + GridSystem.loadedPeople[i].AddressInfo[0].City.Region;
            }
            if (GridSystem.loadedPeople[i].HomeAddress != null) {
                currRowHomeAddress = "Address:" + GridSystem.loadedPeople[i].HomeAddress.Address != null ? GridSystem.loadedPeople[i].HomeAddress.Address : "" + "\n" + "City:" + GridSystem.loadedPeople[i].HomeAddress.City != null ? GridSystem.loadedPeople[i].HomeAddress.City : "";
            }
            row["UserName"] = GridSystem.loadedPeople[i].UserName;
            row["FirstName"] = GridSystem.loadedPeople[i].FirstName;
            row["LastName"] = GridSystem.loadedPeople[i].LastName;
            row["MiddleName"] = GridSystem.loadedPeople[i].MiddleName;
            row["Gender"] = GridSystem.loadedPeople[i].Gender;
            row["Age"] = GridSystem.loadedPeople[i].Age;
            row["Emails"] = GridSystem.loadedPeople[i].Emails.join('\n');
            row["FavoriteFeature"] = GridSystem.loadedPeople[i].FavoriteFeature;
            row["Features"] = GridSystem.loadedPeople[i].Features;
            row["AddressInfo"] = currRowAddressInfo;
            row["HomeAddress"] = currRowHomeAddress;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) {

            },
            loadError: function (xhr, status, error) { }
        });

        $('#jqxLoader').jqxLoader('close');

        $("#jqxgrid").jqxGrid(
            {
                width: '100%',
                autoheight: true,
                source: dataAdapter,
                pageable: true,
                autorowheight: true,
                pagesize: 15,
                pagesizeoptions: ['10', '20', '30', '50'],
                theme: 'energyblue',
                altrows: true,
                selectionmode: 'multiplecellsextended',
                columns: [
                    { text: 'User Name', datafield: 'UserName', width: '10%' },
                    { text: 'First Name', datafield: 'FirstName', width: '10%' },
                    { text: 'Last Name', datafield: 'LastName', width: '10%' },
                    { text: 'Middle Name', datafield: 'MiddleName', width: '10%', cellsalign: 'right' },
                    { text: 'Gender', datafield: 'Gender', width: '5%', cellsalign: 'right', cellsformat: 'c2' },
                    { text: 'Age', datafield: 'Age', width: '5%', cellsalign: 'right', cellsformat: 'c2' },
                    { text: 'Emails', datafield: 'Emails', width: '10%' },
                    { text: 'Favorite Feature', datafield: 'FavoriteFeature', width: '10%' },
                    { text: 'Features', datafield: 'Features', width: '10%' },
                    { text: 'Address Info', datafield: 'AddressInfo', width: '10%' },
                    { text: 'Home Address', datafield: 'HomeAddress', width: '10%' }

                ]
            });
        $('#jqxgrid').on('columnclick', function (e) {
            GridSystem.SortData(e);
        });
    };

    GridSystem.SortData = function (e) {
        let filterSettings = GridSystem.GetFilterSettings(e);
        let finalFilterSettings = GridSystem.DetermineOrderingForFilterSettings(filterSettings);
        GridSystem.UpdateGridWithFilterSettings(finalFilterSettings);
    }

    GridSystem.GetFilterSettings = function (e) {
        let sort = e.args.column.datafield;
        let filterSettings = {
            columnName: sort,
            orderDirection: null
        };

        return filterSettings;
    }

    GridSystem.DetermineOrderingForFilterSettings = function (filterSettings) {
        if (GridSystem.sortBy == "") {
            GridSystem.sortBy = "asc";
            filterSettings.orderDirection = "asc";

        }
        else if (GridSystem.sortBy == "asc") {
            GridSystem.sortBy = "desc";
            filterSettings.orderDirection = "desc";

        }
        else {
            GridSystem.sortBy = "";
            filterSettings.columnName = null;
            filterSettings.orderDirection = null;
        }

        return filterSettings;
    }

    GridSystem.UpdateGridWithFilterSettings = function (filterSettings) {
        GridSystem.sorttUrl = filterSettings.orderDirection == null ? GridSystem.getUrl : GridSystem.getUrl + "?$orderby=" + filterSettings.columnName + "%20" + filterSettings.orderDirection;
        GridSystem.ClearJqxGridContainer();
        GridSystem.GetData();
    }

    GridSystem.ClearJqxGridContainer = function () {
        $('#jqxWidget').empty();
        $('#jqxWidget').append('<div id="jqxgrid"</div>');
    }

    GridSystem.GetData();
})