import * as https from "https";
import * as querystring from "querystring";
import md5 = require("md5");
import { appid, secrit } from "./private";

interface BaiduResult {
  error_code?: string;
  error_msg?: string;
  from: string;
  to: string;
  trans_result: {
    src: string;
    dst: string;
  }[];
}

interface ErrorMap {
  [key: string]: string;
}

const errorMap: ErrorMap = {
  52001: "请求超时",
  52002: "系统错误",
  52003: "未授权用户",
  54000: "必填参数为空",
  54001: "签名错误",
  54003: "访问频率受限",
  54004: "账户余额不足",
  54005: "长query请求频繁",
  58000: "客户端非法IP",
  58001: "译文语言方向不支持",
  58002: "服务当前关闭",
  90107: "认证未通过"
};

export const translate = (word: string) => {
  const salt = Math.random();
  const sign = md5(appid + word + salt + secrit);

  let from = "zh",
    to = "en";

  if (/[a-zA-Z]/.test(word[0])) {
    from = "en";
    to = "zh";
  }

  const query = querystring.stringify({
    q: word,
    from,
    to,
    appid,
    salt,
    sign
  });

  const options = {
    hostname: "api.fanyi.baidu.com",
    port: 443,
    path: "/api/trans/vip/translate?" + query,
    method: "GET"
  };
  const chunks: Buffer[] = [];

  const req = https.request(options, res => {
    res.on("data", chunk => {
      chunks.push(chunk);
    });

    res.on("end", () => {
      const string = Buffer.concat(chunks).toString();
      const baiduResult: BaiduResult = JSON.parse(string);
      if (baiduResult.error_code) {
        console.log(errorMap[baiduResult.error_code] || baiduResult.error_msg);
        process.exit(2);
      } else {
        console.log(baiduResult.trans_result[0].dst);
        process.exit(0);
      }
    });
  });

  req.on("error", e => {
    console.error(e);
  });
  req.end();
};
