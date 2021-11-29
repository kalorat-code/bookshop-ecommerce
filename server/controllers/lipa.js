const axios = require("axios");

this.expires_at = Math.round(new Date().getTime() / 1000) - 5;
this.access_token = "";

exports.get_access_token = async (client_credentials, url) => {
  if (!client_credentials.consumer_secret || !client_credentials.consumer_key) {
    throw "please provide consumer_key and consumer_secret";
  }

  let current_time = Math.round(new Date().getTime() / 1000);
  console.log(current_time, "<", this.expires_at);
  if (current_time < this.expires_at) {
    return await {
      access_token: this.access_token,
      expires_in: this.expires_at - current_time,
    };
  }

  const server_url = url
    ? url
    : `https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`;

  let auth =
    "Basic " +
    Buffer.from(
      client_credentials.consumer_key + ":" + client_credentials.consumer_secret
    ).toString("base64");
  let resp;
  let options = {
    headers: {
      Authorization: auth,
    },
  };

  try {
    resp = await axios.get(server_url, options);
  } catch (error) {
    throw "wrong credentials";
  }
  this.access_token = resp.data.access_token;
  this.expires_at =
    Math.round(new Date().getTime() / 1000) + resp.data.expires_in - 2;
  return resp.data;
};

exports.lipa_na_mpesa = async (options) => {
  if (
    !options.consumer_key ||
    !options.consumer_secret ||
    !options.short_code ||
    !options.callback_url ||
    !options.phone ||
    !options.passkey ||
    !options.amount
  ) {
    throw "missing values in options";
  }
  let now = new Date();
  let tm = [
    now.getMonth() + 1,
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  ];

  let timestamp = now.getFullYear() + "";
  for (let i = 0; i < tm.length; i++) {
    let val = tm[i] + "";
    if (val.length == 1) {
      val = "0" + val;
    }
    timestamp += val;
  }

  console.log(options.short_code + options.passkey + timestamp);
  let password = Buffer.from(
    options.short_code + options.passkey + timestamp
  ).toString("base64");
  let token = await this.get_access_token(options);
  token = token.access_token;
  console.log(token);
  let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  let auth = "Bearer " + token;
  let data = {
    headers: {
      Authorization: auth,
    },
  };
  let body = {
    BusinessShortCode: options.short_code,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: options.amount,
    PartyA: options.phone,
    PartyB: options.short_code,
    PhoneNumber: options.phone,
    CallBackURL: options.callback_url,
    AccountReference: options.reference ? options.reference : "online pay",
    TransactionDesc: options.description ? options.description : "no desc",
  };
  let resp = {};
  console.log(body);
  resp = await axios.post(url, body, data);

  return resp.data;
};
