const link = 'https://randomuser.me/api/?results=20&nat=us,ca';  
$(document).ready(function() {   
  "use strict";
  $.fn.retrieve = function() {
    fetch(link)
    .then((resp) => resp.json())
    .then(function(data) {      
      return data.results;
    })
    .catch(function(error) {
      console.log(JSON.stringify(error));
    });
  };

  jsGrid.Grid.prototype._sortData = function () {
    var self = this,
      sortFactor = this._sortFactor(),
      sortField = this._sortField;
  
    if (sortField) {
      this.data.sort(function (item1, item2) {
  
        var value1 = self._getItemFieldValue(item1, sortField);
        var value2 = self._getItemFieldValue(item2, sortField);
        return sortFactor * sortField.sortingFunc(value1, value2);
      });
    }
  };

  $.fn.display = function() {
    var db = { 
      loadData: function (filter) {
        console.log(filter);
        return $.ajax({
            type: "GET",
            url: link,
            data: filter,
            dataType: "json"
        }).then(function(result) {
            return result.results;
        });
      }
    }

    var DOB = function(config) {
      jsGrid.Field.call(this, config);
    };

    var Birthday = function(config) {
      jsGrid.Field.call(this, config);
    };

    DOB.prototype = new jsGrid.Field({
      sorter: function(date1, date2) {
          return new Date(date1) - new Date(date2);
      },

      itemTemplate: function(value) {
          return new Date(value).toDateString();
      }
    });

    Birthday.prototype = new jsGrid.Field({

      itemTemplate: function(value) {
        var cd = new Date();
        var cdm = cd.getMonth();
        var cdd = cd.getDate();
        var bd = new Date(value);
        var bdm = bd.getMonth();
        var bdd = bd.getDate();
        
        var expr = "has yet to occur";
        if ((bdm == cdm) && (bdd == cdd)) {
            expr = "is today(!)";
        } else if (cdm > bdm) {
            expr = "already happened";
        } else if(cdm == bdm) {
            if(cdd > bdd) {
              expr = "alredy happened";
            }
        } else {
          //has yet to occur 
        } 
        return expr;
      }
    });

    jsGrid.fields.DOB = DOB;
    jsGrid.fields.Birthday = Birthday;

    $("#jsGrid").jsGrid({
        width: "100%",
        height: "600px",  
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        pageSize: 20,  
        autoload: true,
        controller: db, 
        fields: [
          { title: "Last", name: "name.last", type: "text", width: 30 },
          { title: "First", name: "name.first", type: "text", width: 30  },
          { title: "Gender", name: "gender", type: "text", width: 15  },
          { title: "Country", name: "location.country", type: "text", width: 30  },
          { title: "DOB", name: "dob.date", type: "DOB", width: 30, align: "center" },
          { title: "Birthday", name: "dob.date", type: "Birthday", width: 30, align: "center", sorting: false }
          //{ type: "control", editButton: false, modeSwitchButton: false }
        ]
      });  
  };

  $.fn.display();
  $("#report").click(function() {
    $.fn.display();
  });
  $("#clear").click(function() {
    $(".raw").html('');
  });
  $("#raw").click(function() {
    $.ajax({
        url : link,
        dataType: "text",
        success : function (data) {
            $(".raw").html(data);
          }
      });
  });
});