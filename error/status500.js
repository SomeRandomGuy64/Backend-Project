exports.resStatus500 = (res) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
