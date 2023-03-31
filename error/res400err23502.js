exports.res400err23502 = (res, err) => {
    if (err.code === "23502") {
      res.status(400).send({ msg: "No input found" });
  };
}

