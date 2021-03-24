var express = require('express');
var app = express();
//https
const https = require('https');
const fs = require('fs');

var port2 = 1750;
var dbresult = [];

//JSON Request
const request_url = require('request');
//MS-SQL 쓰는거
var sql = require('mssql');
var config = {
    user: 'ID',
    password: 'PASSWORD',
    server: 'HOST', // You can use 'localhost\\instance' to connect to named instance
    database: '데이터베이스이름',
    requestTimeout: 100000,   //요청시간이 길어지면 저 시간이되면 끊어짐 Defalut : 15000 현재는 100초임
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

//파일보내기
app.get('/',function(req,res){
  res.sendFile(__dirname + "/public/main.html");
});
//값을 받아서 url주소를 만들어서 데이터 베이스에 저장시킬꺼임 **많은값을 저장시키거나 변경하려고하면 하다가 중간에 멈춰버림 update는 2000개 insert는 5000개정도
app.get('/taewon=:id',function(req,res){
  var now = new Date();
  var nowTime = now.getFullYear() +"년"+ (now.getMonth()+1)+"월"+ now.getDate() +"일"+ now.getHours() +":" + now.getMinutes() +":"+ now.getSeconds()
  var urlpram = req.params.id;
              //여기부분이 도메인 입력하고          //값받아서 API접근후 데이터 베이스 저장
  var url = 'https://innovation.kfsco.com:1750/'+urlpram
  url = encodeURI(url);   //인코딩을 해줘야 한글값도 잘들어감
  //console.log(url);
  request_url(url,function(error,response,body){
    if(!error && response.statusCode == 200){
      obj = JSON.parse(body);
      if(obj[0].Seq==null&&obj[0].DlvDt==null){
        return res.json("저장실패");
      } 
      console.log(obj.length+"개//"+nowTime);//들어온 값의 개수
      for(var i=0;i<=obj.length-1;i++){
          taewon(obj[i].DlvDt,obj[i].Seq,obj[i].ConvTeamCd,obj[i].NatCarNo,obj[i].SendBkCd,obj[i].StTm,obj[i].RecvBkCd, obj[i].EdTm, obj[i].ConvTp, obj[i].ConvTpNm, obj[i].rk);
      }
      return res.json(obj.length+"개 저장완료");
    }else{
      console.log(error);
      return res.json("저장실패");
    }
  });
  //res.render("testPage.ejs",{})
});
//mssql 돌아가는거 함수로 빼놓기 난수+A만
function taewon(DlvDt,Seq,ConvTeamCd,NatCarNo,SendBkCd,StTm,RecvBkCd,EdTm,ConvTp,ConvTpNm,rk){
    //console.log(BkBrnCd+","+BrnNm+","+BkBrnNo+","+BankNm+","+BrnLocNm+","+Rk2+","+Longitude+","+Latitude);
    sql.connect(config, err => {
      // ... error checks
     if(err){
       console.log(err);
     }
       //일반쿼리 사용법
       new sql.Request()
       .input('DlvDt',sql.NVarChar,DlvDt)
       .input('Seq',sql.NVarChar,Seq)
       .input('ConvTeamCd',sql.NVarChar,ConvTeamCd)
       .input('NatCarNo',sql.NVarChar,NatCarNo)
       .input('SendBkCd',sql.NVarChar, SendBkCd)
       .input('StTm',sql.NVarChar, StTm)
       .input('RecvBkCd',sql.NVarChar,RecvBkCd)
       .input('EdTm',sql.NVarChar, EdTm)
       .input('ConvTp',sql.NVarChar, ConvTp)
       .input('ConvTpNm',sql.NVarChar, ConvTpNm)
       .input('rk',sql.NVarChar, rk)
       .execute('SP_Get_RESTA2', (err, result) => {
          /*if(err){
           console.log(err);
         }else{
            console.log(result.recordset);
         }*/
     })
  });
}
app.post('/taewon',function(req,res){
 console.log(req.body);
})
//URL로 JSON 값 가져오기 주석풀고 쓸것
  // let url = 'https://innovation.kfsco.com:1750/PRHwz6V8nHDCklqx2FTUqzOL4af0yBxA7Eu6bIHHgNvcNrOLLCw7WXZgTXo9IjSVxMyRvrMLT4saTsqGUrQmhZpo8Jj1CDu6yNfC=KFS';
  // request_url(url,function(error,response,body){
  //   if(!error && response.statusCode == 200){
  //     obj = JSON.parse(body);
  //     for(var i=0;i<=obj.length-1;i++){
  //       console.log(obj[i].BankNm+","+obj[i].BrnNm+","+obj[i].Rk2);
  //     }
  //   }else{
  //     console.log("여긴안됨");
  //   }
  // });


//경로 난수 마지막에 C      거래처 은행별 조회
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

//난수 마지막에 D     은행명 조회
app.get('/PRHwz6V8nHDCklqx2FTUqzOL4af0yBxA7Eu6bIHHgNvcNrOLLCw7WXZgTXo9IjSVxMyRvrMLT4saTsqGUrQmhZpo8Jj1CDu6yNfD' ,function(req,res){
  var result;
  var urlpram = req.params.id; //url의 :id를 가져온다
  sql.connect(config, err => {
      // ... error checks
     if(err){
       console.log(err);
     }
       //일반쿼리 사용법
       new sql.Request()
       .query("select BkNm from  KFS_ERP.kfs_data.dbo.CBankMR", (err, result) => {
         // ... error checks
         if(err){
           return res.json(err)
         }else{
          //데이터값 html로 옮기고 싶을때 ejs랑 이거 써서 옮길수있음
          //res.render('testPage.ejs',{'test' : result.recordset[0].BkNm,'test1' : result.recordset[0].BkCd})
          return res.json(result.recordset)
         }
     })
  });
})

//경로 난수 마지막에 F    담당자 조회
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

//난수 마지막에 G     차량의 하루 위도경도 조회
app.get('/PRHwz6V8nHDCklqx2FTUqzOL4af0yBxA7Eu6bIHHgNvcNrOLLCw7WXZgTXo9IjSVxMyRvrMLT4saTsqGUrQmhZpo8Jj1CDu6yNfG&DlvDt=:id&VEH_NAME=:id1' ,function(req,res){
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
       .input('DlvDt',sql.NVarChar, urlpram)
       .input('VEHNAME',sql.NVarChar, urlpram1)
       .query("select VEH_NAME, COORD_X, COORD_Y, TRACE_DATE, POSI_ADDR from VEH_TRACE where TRACE_DATE BETWEEN @DlvDt+' '+'00:00:00' and @DlvDt+' '+'23:59:59' and VEH_NAME = @VEHNAME", (err, result) => {
         // ... error checks
         if(err){
           return res.json(err)
         }else{
              return res.json(result.recordset);
         }
     })
  });
})

//경로 난수 마지막에 H    일일 업무계획조회
app.get('/PRHwz6V8nHDCklqx2FTUqzOL4af0yBxA7Eu6bIHHgNvcNrOLLCw7WXZgTXo9IjSVxMyRvrMLT4saTsqGUrQmhZpo8Jj1CDu6yNfH=:id',function(req,res){
  var result;
  var urlpram = req.params.id; //url의 :id를 가져온다
  sql.connect(config, err => {
      // ... error checks
     if(err){
       console.log(err);
     }
     // 저장프로시저 사용법
     new sql.Request()
       .input('DlvDt', sql.NVarChar(30), urlpram)
       .execute('SP_Get_WorkPlan', (err, result) => {
           // ... error checks
           if(err){
             return res.json(err);
           }else{
             return res.json(result.recordset)
           }
       })
  });
})

//난수 마지막에 I 현재시간 30분전 ~ 현재시간 차량 경로 조회
app.get('/PRHwz6V8nHDCklqx2FTUqzOL4af0yBxA7Eu6bIHHgNvcNrOLLCw7WXZgTXo9IjSVxMyRvrMLT4saTsqGUrQmhZpo8Jj1CDu6yNfI' ,function(req,res){
  var result;
 // var urlpram = req.params.id; //url의 :id를 가져온다
  sql.connect(config, err => {
      // ... error checks
     if(err){
       console.log(err);
     }
       //일반쿼리 사용법
       new sql.Request()
       //.input('bknm',sql.NVarChar, urlpram)
       .query("select VEH_NAME, TRACE_DATE, COORD_X, COORD_Y from VEH_TRACE where TRACE_DATE > DATEADD(MI,-30,GETDATE())", (err, result) => {
         // ... error checks
         if(err){
           return res.json(err)
         }else{
           var data = result.recordset.length;
           if(data != 0){
              return res.json(result.recordset)
            }
              return res.json(false)
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

