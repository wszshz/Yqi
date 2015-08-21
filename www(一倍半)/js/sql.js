var getSQLiteClass = function(dbconn){
  var patterns = {
    user_token   : {'id':null,'id_ybb':0,'id_3rd':'','token':'','user_type':0,'create_time':null},
    user_profile : {'id_ybb':null,'gender':1,'work_year':3,'edu_level':4,'current_salary':0,'expected_salary':50,'step':0,'id_member':0,'first_name':'','company':'','current_position':'','school':'','avatar':'','fake_name':'','secret':'','city':'','job_requirement':'','industry_1':'','industry_2':'','device_type':'','device_code':''},
    user_privacy : {'shield_company':'','shield_profile':0,'shield_phone':0,'shield_qq':0,'shield_weixin':0,'shield_email':0,'call_freq':3},
    user_contact : {'contact_type':null,'contact':''},
    cache        : {'key':null,'val':null,'ttl':0},
    badge        : {'id':null,'badge_number':0}
  }

  return {
    createRow : function(table, record){
      record = record || {};
      var pattern = patterns[table];
      var row = {};
      for(key in pattern){row[key] = record[key] || pattern[key];}
      return row;
    },
    saveRecords : function(table, records, callback){
      if(!records||!records.length){return;}
      var pattern = patterns[table];
      var sql = "REPLACE INTO `#table#` (#cols#) VALUES #rows#;".replace('#table#', table);
      var cols = [], rows = [];
      for(key in pattern){cols.push('`'+key+'`');}
      for(i in records){
        var row = [];
        for(key in pattern){
          var val = (records[i][key] || pattern[key]);
          row.push(val===null ? "null" : "'"+val+"'");
        }
        rows.push("(#row#)".replace("#row#", row.join(',')));
      }
      sql = sql.replace('#cols#', cols.join(',')).replace('#rows#', rows.join(','));
      dbconn && dbconn.transaction(function(tx){tx.executeSql(sql, [], function(tx, res){callback && callback(res);}, function(e){console.log("ERROR: " + e.message);});});
      console.log(sql);
    },
    findRecords : function(table, where, callback){
      var sql = "SELECT * FROM `#table#` #where#;".replace('#table#', table).replace('#where#', where || '');
      dbconn && dbconn.transaction(function(tx){tx.executeSql(sql, [], function(tx, res){callback && callback(res);}, function(e){console.log("ERROR: " + e.message);});});
      console.log(sql);
    },
    dropRecords : function(table, where, callback){
      var sql = "DELETE   FROM `#table#` #where#;".replace('#table#', table).replace('#where#', where || '');
      dbconn && dbconn.transaction(function(tx){tx.executeSql(sql, [], function(tx, res){callback && callback(res);}, function(e){console.log("ERROR: " + e.message);});});
      console.log(sql);
    }
  };
};