module.exports = {
  Login,
};

function Login(req, res) {
  return new Promise(async function (resolve, reject) {
    return resolve(
     "welcome to login"
    );
  });
}
