var express = require('express');
var app = express();
//https
const https = require('https');
const fs = require('fs');

var port2 = 1750;
var dbresult = [];

//MS-SQL 쓰는거
var sql = require('mssql');
var config = {
    user: 'sa',
    password: 'renew@dbo@1249',
    server: '218.146.65.32', // You can use 'localhost\\instance' to connect to named instance
    database: 'KFSTMS',
    options:{
      encrypt:false,
      enableArithAbort:true,
    },
}

/*const options = {
  key: fs.readFileSync('./keys/innovation.kfsco.com_key.pem','utf8'),
  cert: fs.readFileSync('./keys/innovation.kfsco.com_cert.pem','utf8')
};*/
/*const options ={
  pfx: fs.readFileSync('./keys/innovation.kfsco.com.pfx'),
  passphrase: 'kfscocom' //비밀번호
};*/


/*https.createServer(options, app).listen(port2, function(){
  console.log("start! REST API HTTPS server on port " + port2);
});*/
 app.listen(port2,function(){
   console.log("start! REST API HTTP server on port "+port2);
 });
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

app.get('/',function(req,res){
  res.sendFile(__dirname + "/public/main.html");
});

//경로 난수 마지막에 C
app.get('/PRHwz6V8nHDCklqx2FTUqzOL4af0yBxA7Eu6bIHHgNvcNrOLLCw7WXZgTXo9IjSVxMyRvrMLT4saTsqGUrQmhZpo8Jj1CDu6yNfC=:id',function(req,res){
  var result;
  var urlpram = req.params.id; //url의 :id를 가져온다
  sql.connect(config, err => {
      // ... error checks
     if(err){
       console.log(err);
     }
     // 저장프로시저 사용법
     new sql.Request()
       .input('BakNm', sql.NVarChar(30), urlpram)
       .execute('SP_Get_RESTA', (err, result) => {
           // ... error checks
           if(err){
             return res.json(err);
           }else{
             return res.json(result.recordset)
           }
       })
  });
})

//난수 마지막에 D
app.get('/PRHwz6V8nHDCklqx2FTUqzOL4af0yBxA7Eu6bIHHgNvcNrOLLCw7WXZgTXo9IjSVxMyRvrMLT4saTsqGUrQmhZpo8Jj1CDu6yNfD=:id' ,function(req,res){
  var result;
  var urlpram = req.params.id; //url의 :id를 가져온다
  sql.connect(config, err => {
      // ... error checks
     if(err){
       console.log(err);
     }
       //일반쿼리 사용법
       new sql.Request()
       .input('bknm',sql.NVarChar, urlpram)
       .query("select * from  KFS_ERP.kfs_data.dbo.CBankMR where BkNm = @bknm", (err, result) => {
         // ... error checks
         if(err){
           return res.json(err)
         }else{
           var data = result.recordset.length;
           if(data != 0){
              //데이터값 html로 옮기고 싶을때 ejs랑 이거 써서 옮길수있음
              //res.render('testPage.ejs',{'test' : result.recordset[0].BkNm,'test1' : result.recordset[0].BkCd})
              return res.json(true)
            }
              return res.json(false)
         }
     })
  });
})

//경로 난수 마지막에 F
app.get('/PRHwz6V8nHDCklqx2FTUqzOL4af0yBxA7Eu6bIHHgNvcNrOLLCw7WXZgTXo9IjSVxMyRvrMLT4saTsqGUrQmhZpo8Jj1CDu6yNfF',function(req,res){
  var result;
  var urlpram = req.params.id; //url의 :id를 가져온다
  sql.connect(config, err => {
      // ... error checks
     if(err){
       console.log(err);
     }
     // 저장프로시저 사용법
     new sql.Request()
       //.input('BakNm', sql.NVarChar(30), urlpram)
       .execute('SP_Get_RESTA1', (err, result) => {
           // ... error checks
           if(err){
             return res.json(err);
           }else{
             return res.json(result.recordset)
           }
       })
  });
})

//난수 마지막에 G
app.get('/PRHwz6V8nHDCklqx2FTUqzOL4af0yBxA7Eu6bIHHgNvcNrOLLCw7WXZgTXo9IjSVxMyRvrMLT4saTsqGUrQmhZpo8Jj1CDu6yNfG=:id&VEH_NAME=:id1' ,function(req,res){
  var result;
  var urlpram = req.params.id; //url의 :id를 가져온다
  var urlpram1 = req.params.id1; //url의 :id를 가져온다
  sql.connect(config, err => {
      // ... error checks
     if(err){
       console.log(err);
     }
       //일반쿼리 사용법
       new sql.Request()
       .input('bknm',sql.NVarChar, urlpram)
       .input('bknm1',sql.NVarChar, urlpram1)
       .query("select VEH_NAME, COORD_X, COORD_Y, TRACE_DATE, POSI_ADDR from VEH_TRACE where TRACE_DATE BETWEEN @bknm+' '+'00:00:00' and @bknm+' '+'23:59:59' and VEH_NAME = @bknm1", (err, result) => {
         // ... error checks
         if(err){
           return res.json(err)
         }else{
              return res.json(result.recordset);
         }
     })
  });
})



app.post('/api/test',function(req, res){
  res.send('성공');
})
app.post('/api/post/test',function(req, res){
  res.json('해치웠나?');
})

//에러페이지
app.use(function(req, res, next){
  res.sendFile(__dirname+"/public/errorPage.html");
});