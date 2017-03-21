exports.index = (req, res) => {
  res.write("hi");
  res.setHeader("content-type", "text/plain");
  res.end();
};
