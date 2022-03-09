const express = require("express");
const app = express();
const port = 404;
const bodyParser = require("body-parser");
const fs = require("fs");
const e = require("express");
const cors = require("cors");

//저장 경로 및 이름 설정
const filePath = __dirname + "/../../out/issue.json";

console.log(filePath);

function getIssueAPItoJsonFile(ApiDataMessage) {
  fs.readFile(filePath, "utf-8", (err, data) => {
    let [title, message] = ApiDataMessage.split("||").map((value) =>
      value.trim()
    );
    if (err) {
      console.log("알수 없는 오류가 발생했습니다.", err);
    } else if (!data) {
      fs.writeFileSync(
        filePath,
        JSON.stringify([{ title: title, message: message }])
      );

      console.log("json 파일이 없습니다... 파일을 생성합니다.");
    } else {
      const testData = JSON.parse(data);
      testData.push({
        title: title,
        message: message,
      });

      fs.writeFileSync(filePath, JSON.stringify(testData));
      console.log("정상적으로 처리되었습니다.");
    }
  });
}

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());

app.post("/api", (res, req) => {
  if (
    !res.body.message ||
    res.body.isFilter !== "404" ||
    !res.body.message.includes("||")
  ) {
    console.log(`전달받은 파라미터오류`);
    console.log(
      `isFilter : ${res.body.isFilter}, message : ${res.body.message}`
    );
    return req.status(500).send("bad-request");
  } else {
    try {
      getIssueAPItoJsonFile(res.body.message);
    } catch (e) {
      console.log(e);
      return req.status(500).send("bad-request");
    }
    return req.status(200).json({ answer: "isOK" });
  }
});

app.listen(port, () => console.log(`express app listening on port${port}`));
