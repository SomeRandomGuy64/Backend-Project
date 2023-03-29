exports.resStatus400 = (res, err) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  }
};
