const filterReqBody = (obj, ...args) => {
  let filteredObj = {};
  args.forEach((element) => {
    if (obj[element]) {
      filteredObj[element] = obj[element];
    }
  });

  return filteredObj;
};

module.exports = filterReqBody;
