const web3 = new Web3(
  "https://ropsten.infura.io/v3/79c0ebed198c43d490418501462a900e"
);

const fileSelector = document.getElementById("keystore");
fileSelector.addEventListener("change", (event) => loadKeystore(event));

let decryptedAccount = {};
function loadKeystore(event) {
  const [file] = event.target.files;
  readJSON(file, (json) => {
    decryptedAccount = web3.eth.accounts.decrypt(json, "Password");
    $("#address").html(
      `<strong>Dirección cargada:</strong> ${decryptedAccount.address}`
    );
  });
}

function generateTransaction() {
  decryptedAccount
    .signTransaction({
      from: decryptedAccount.address,
      to: document.getElementById("toAddress").value,
      value: web3.utils.toHex(
        web3.utils.toWei(document.getElementById("amount").value, "ether")
      ),
      gas: 200000,
      chainId: 3,
    })
    .then((signedTx) => {
      const bytes = web3.utils.hexToBytes(signedTx.rawTransaction);
      $("#rawTx").html(`Transaction in HEX:\n${signedTx.rawTransaction}`);
      const bits = ByteArrayToBitSequence(bytes);
      $("#bits").text(
        `Transaction in Bits:\nCantidad de bits: ${bits.length}\n${bits.join(
          ""
        )}`
      );
    });
}

function readJSON(file, cb) {
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    cb(JSON.parse(event.target.result));
  });
  reader.readAsText(file);
}

function ByteArrayToBitSequence(bytes) {
  const bits = [];
  bytes.map((byte) => {
    for (var i = 7; i >= 0; i--) {
      bits.push(byte & (1 << i) ? 1 : 0);
      // do something with the bit (push to an array if you want a sequence)
    }
  });
  return bits;
}
