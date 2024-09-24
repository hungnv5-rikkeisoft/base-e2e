export const LIST_FIELD_MERCHANT = [
  "B_to_C",
  "B_to_B",
  "industry",
  "serviceName",
  "webURL",
  "transactionPerMonth",
  "estimateAmountPerMonth",
  "usingApi",
  "notUsingApi",
  "ipAddress",
];

export const DATA_MERCHANT_FILL = {
  model: true,
  industry: "鉱業・採石業・砂利採取業",
  serviceName: "漢字",
  paymentService: 5,
  webURL: "vcxvcxvcx",
  transactionPerMonth: "1,000 - 10,000/回",
  estimateAmountPerMonth: "50,001 - 100,000 USD",
  usingApi: true,
  ipAddress: "192.168.1.1",
};

export const PAYMENT_SERVICE_TEXT = [
  {
    paymentService: 1,
    text: "クレジットカード決済",
  },
  {
    paymentService: 2,
    text: "コンビニ決済",
  },
  {
    paymentService: 3,
    text: "モバイル決済",
  },
  {
    paymentService: 4,
    text: "国内銀行口座決済",
  },
  {
    paymentService: 5,
    text: "振込代行",
  },
];
