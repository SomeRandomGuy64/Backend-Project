exports.customErr = (res, err) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
};
