exports.status = (req, render) => {
  render({text: "status ok"});
};

exports.paramSwitching = (req, render) => {
  render("rendered via param switching");
};

exports.json = (req, render) => {
  render({json: {this: 'renders', as: 'json'}});
};
