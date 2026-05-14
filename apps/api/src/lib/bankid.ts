import https from "https";
import fs from "fs";

const BASE_URL = "appapi2.test.bankid.com";

const agentOptions = {
  pfx: fs.readFileSync(process.env.BANKID_CERT_PATH!),
  passphrase: process.env.BANKID_CERT_PASSPHRASE ?? "",
  rejectUnauthorized: false,
};

function call(endpoint: string, body: object): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    console.log("BankID request:", endpoint, data);

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/rp/v6.0${endpoint}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
      ...agentOptions,
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode && res.statusCode >= 400) {
            reject(parsed);
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error("Failed to parse response"));
        }
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

export const bankid = {
  auth: (endUserIp: string) =>
    call("/auth", {
      endUserIp,
    }),

  collect: (orderRef: string) =>
    call("/collect", { orderRef }),

  cancel: (orderRef: string) =>
    call("/cancel", { orderRef }),
};