const web3 = new Web3(
  "https://ropsten.infura.io/v3/79c0ebed198c43d490418501462a900e"
);

const fileSelector = document.getElementById("keystore");
fileSelector.addEventListener("change", (event) => loadKeystore(event));

let decryptedAccount = {};
function loadKeystore(event) {
  const [file] = event.target.files;
  $("#fileName").text(file.name);
  readJSON(file, (json) => {
    try {
      decryptedAccount = web3.eth.accounts.decrypt(
        json,
        document.getElementById("password").value
      );
      fileSelector.value = null;
      resetErrorMsg();
      $("#address").html(
        `<strong>Dirección cargada:</strong> ${decryptedAccount.address}`
      );
    } catch (e) {
      fileSelector.value = null;
      handleError(e);
      $("#address").html(``);
    }
  });
}

function resetKeystore() {
  fileSelector.value = null;
  decryptedAccount = {};
  $("#address").html(``);
  resetErrorMsg();
}

function handleError(e) {
  $("#password").addClass("is-danger");
  $(`<p class='help is-danger'>${e.message}</p>`).insertAfter("#password");
}

function resetErrorMsg() {
  $("#password").removeClass("is-danger");
  $(".help").remove();
}

function loadDefault() {
  fileSelector.value = null;
  decryptedAccount = web3.eth.accounts.decrypt(
    {
      version: 3,
      id: "7b5e3d23-96a5-4c26-8187-d42dde5b6b57",
      address: "e07cbf2df31eb6f1af46df5ca0f703c1a689c576",
      crypto: {
        ciphertext:
          "41b23f37cbc3d102295443f7a554685d1fd1b997d4ed8e74d687491df97466d2",
        cipherparams: { iv: "9285f7cd9abb6918386b208e456e9744" },
        cipher: "aes-128-ctr",
        kdf: "scrypt",
        kdfparams: {
          dklen: 32,
          salt:
            "c9ea971a8e25ec0b1a69ad73267c931824f00ac3f5784ffc82c8bd2ebba61ae0",
          n: 8192,
          r: 8,
          p: 1,
        },
        mac: "6489a7dfb93fa50a0502116804bf1dd47972c6be61db74cc50ec4439f97aa76a",
      },
    },
    "Password"
  );
  $("#address").html(
    `<strong>Dirección cargada:</strong> ${decryptedAccount.address}`
  );
  resetErrorMsg();
}

function generateTransaction() {
  if (decryptedAccount.hasOwnProperty("signTransaction")) {
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
  } else {
  }
}

function readJSON(file, cb) {
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    try {
      cb(JSON.parse(event.target.result));
    } catch (e) {
      $("#address").html(
        `<strong style="color:red;">No es un archivo JSON</strong>`
      );
    }
  });
  reader.readAsText(file);
}

function ByteArrayToBitSequence(bytes) {
  const bits = [];
  bytes.map((byte) => {
    for (var i = 7; i >= 0; i--) {
      bits.push(byte & (1 << i) ? 1 : 0);
    }
  });
  return bits;
}
