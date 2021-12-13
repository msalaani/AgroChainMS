

function setStatus(message) {
    //var status = document.getElementById('status');
    //status.innerHTML = message;
    console.log(message);
};

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function makeQR(values, idform, idelt, filename, download) {
    var Form = document.getElementById(idform);

    var your_data = JSON.stringify(values);

    let qrcodeContainer = document.createElement("canvas");
    qrcodeContainer.id = idelt

    Form.appendChild(qrcodeContainer);

    // generate qrcode
    qrcodeContainer = document.getElementById(idelt);
    //qrcodeContainer.innerHTML = "";
    new QRious({
        element: qrcodeContainer,
        value: your_data,
        size: 128,
    });

    // https://stackoverflow.com/questions/68077398/downloading-a-qrcode-js-generated-qr-code
    // put qrcode to canva
    var imgb64 = qrcodeContainer.toDataURL("image/png");
    console.log(imgb64);

    var context = qrcodeContainer.getContext("2d");

    var image = new Image();
    image.onload = function () {
        context.drawImage(image, 0, 0);
    };
    image.src = imgb64;

    // generate button
    var element = document.createElement("a");

    element.innerHTML = "Download"
    element.download = filename.concat(".png");
    element.href = imgb64;
    element.className = "button-download-qr";

    Form.appendChild(element);

    if (download) {
        element.click();
    }

    if (context) {

        const pixels = context.getImageData(0, 0, 128, 128);
        const imageData = pixels.data;
        const code = jsQR(imageData, 128, 128);

        if (code) {
            console.log("Found QR code", code.data);
        }

    }

}

function readQR(idfile, iddestcanvas, aftereltid, fct) {
    var fd = new FormData();
    var files = $('#'.concat(idfile))[0].files[0];
    console.log(files);
    fd.append(idfile, files);

    $('#'.concat(idfile)).val(null);
    //https://javascript.info/file
    // https://stackoverflow.com/questions/28658388/filereader-result-return-null
    let reader = new FileReader();
    reader.readAsDataURL(files);

    reader.onloadend = function (e) {
        var img64 = reader.result;

        // https://stackoverflow.com/questions/55373523/why-i-cannot-decode-qr-codes-in-javascript
        var img = new Image();
        img.src = img64;
        img.onload = function () {
            let destCanvas = document.createElement("canvas");
            destCanvas.id = iddestcanvas;

            var QualityTestTable = document.getElementById(aftereltid);
            //QualityTestTable.after(destCanvas);

            var destCanvasContext = destCanvas.getContext('2d');


            destCanvasContext.drawImage(img, 0, 0);
            const pixels = destCanvasContext.getImageData(0, 0, 128, 128);
            const imageData = pixels.data;

            console.log("QR Code image uploaded");
            const code = jsQR(imageData, 128, 128);
            if (code) {

                // put what code you want do
                console.log(code.data);
                var values = JSON.parse(code.data);
                console.log('wsolne');
                console.log(values);
                fct(values);
            }
        };
        img.src = img64;


    };
}


App = {
    web3Provider: null,
    contracts: {},
    idFarmer: '0',
    lastTX: '0',

    init: async function (perm) {

        if (perm == 0) {
            $('#form-selector').remove();
        }
        else {
            console.log("hello");
        }

        return await App.initWeb3();
    },

    initWeb3: async function () {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            }
            catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;

        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');

        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('js/Agrochain.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var AgroChainArtifact = data;
            App.contracts.AgroChain = TruffleContract(AgroChainArtifact);

            // Set the provider for our contract
            App.contracts.AgroChain.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            // return App.markAdopted();
        });


        return App.bindEvents();
    },

    setProduce: function () {
        var produceForm = $('#produce-form');
        var Fid = produceForm.find('#fid').val();

        return App.setProduceEvent();
    },


    bindEvents: function () {
        $(document).on('click', '.btn-selector', App.changeTabByOnClick);
        $(document).on('click', '.btn-getproduce', App.handlegetProduce);
        $(document).on('click', '.btn-produce', App.handlesetProduce);
        $(document).on('click', '.btn-upload', App.handlegetProduceQR);
        $(document).on('click', '.btn-uploadQ', App.handlegetQualityQR);
        $(document).on('click', '.btn-approve', App.handleApproveRedirect);
        $(document).on('click', '.btn-setQuality', App.handleApprove);
        $(document).on('click', '.btn-customer', App.handlegetQuality);
        $(document).on('click', '.btn-fund', App.handleFund);
        $(document).on('click', '#printBlock', App.printBlock);
        $(document).on('click', '#printTransaction', App.printLastTransaction);

    },


    changeTabByOnClick: function (event) {
        console.log(this);

        $('#form-selector').siblings().hide();
        $(this).siblings().removeClass('active');


        var btn_to_form = event.target.id;
        console.log(btn_to_form);
        //$('#'.concat(btn_to_form)).siblings().hide();
        $('#'.concat(btn_to_form)).addClass("active");
        btn_to_form = btn_to_form.split("-");
        btn_to_form[btn_to_form.length - 1] = 'form';
        btn_to_form = btn_to_form.join('-');
        console.log(btn_to_form);
        $('#'.concat(btn_to_form)).show();
        $('#head').show();
        $('#foot').show();
    },


    markAdopted: function (adopters, account) {
        var adoptionInstance;

        console.log('adopted');
    },

    handleApproveRedirect: function (event) {
        $("#produce-form").hide();
        $("#quality-test-form").hide();
        $("#customer-form").hide();
        $("#approve-form").show();
        $("#finance-form").hide();

        $("#produce-btn").removeClass("active");
        $("#quality-test-btn").removeClass("active");
        $("#customer-btn").removeClass("active");
        $("#approve-btn").addClass("active");
        $("#finance-btn").removeClass("active");
    },
    handleApprove: function () {

        var lotno = document.getElementById("lotno").value;
        var grade = document.getElementById("grade").value;
        var mrp = parseInt(document.getElementById("mrp").value);

        var testDate = new Date($('#testdate').val());
        var expDate = new Date($('#expdate').val());

        if (App.idFarmer == '0') {
            alert('Must Get Quality Before');
            $("#produce-form").hide();
            $("#quality-test-form").show();
            $("#customer-form").hide();
            $("#approve-form").hide();
            $("#finance-form").hide();

            $("#produce-btn").removeClass("active");
            $("#quality-test-btn").addClass("active");
            $("#customer-btn").removeClass("active");
            $("#approve-btn").removeClass("active");
            $("#finance-btn").removeClass("active");
            return;
        }

        if (testDate > expDate) {
            alert('Dates are not valid');

            return;
        }

        testDate = testDate.toDateString();
        expDate = expDate.toDateString();
        console.log(expDate);

        setStatus("Initiating transaction... (please wait)");

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.AgroChain.deployed().then(function (instance) {
                agroInstance = instance;

                // Execute adopt as a transaction by sending account
                agroInstance.Quality(lotno, grade, mrp, testDate, expDate, {
                    from: account,
                    gas: 400000
                }).then(value => {
                    console.log(value);


                    values = JSON.stringify({
                        'fid': App.idFarmer,
                        'lid': lotno
                    });
                    var filename = "ProductDetailsQR_" + App.idFarmer + "_" + lotno;

                    makeQR(values, 'approve-form', 'qrcode1', filename, true);
                    setStatus("Transaction complete!");
                });

            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    handlesetProduce: function (event) {
        event.preventDefault();
        var produceForm = $('#produce-form');
        var fid = produceForm.find('#fid').val();
        var fname = produceForm.find('#fname').val();
        var loc = produceForm.find('#loc').val();
        var crop = produceForm.find('#crop').val();
        var contact = parseInt(produceForm.find('#contact').val());
        var quantity = parseInt(produceForm.find('#quantity').val());
        var exprice = parseInt(produceForm.find('#exprice').val());

        setStatus("Initiating transaction... (please wait)");

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.AgroChain.deployed().then(function (instance) {
                agroInstance = instance;

                // Execute adopt as a transaction by sending account
                agroInstance.Produce(fid, fname, loc, crop, contact, quantity, exprice, {
                        from: account,
                        gas: 400000
                    })
                    .then(function () {
                        setStatus("Transaction complete!");
                        $('#qrcode').empty();

                        /*
                        var values = {
                            'fid': fid,
                            'fname': fname,
                            'loc': loc,
                            'crop': crop,
                            'contact': contact,
                            'quantity': quantity,
                            'exprice': exprice
                        };
						*/

                        var values = {
                            'fid': fid
                        };

                        App.idFarmer = fid;
                        var filename = "QualityQR_" + fid;

                        makeQR(values, 'produce-form', 'qrcode', filename, false);

                    }).catch(function (e) {
                        console.log(e);
                        setStatus("Error setting value; see log.");
                    });

                agroInstance.fundaddr(parseInt(account), {
                    from: account,
                    gas: 1000000
                }).then(function () {

                    console.log("Account Funded!");


                }).catch(function (e) {
                    console.log(e);
                    setStatus("Error setting value; see log.");
                });


            }).catch(function (err) {
                console.log(err.message);
            });
        });

        console.log(fid);

    },


    handlegetProduceByID: function (id, prefix) {

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.AgroChain.deployed().then(function (instance) {
                agroInstance = instance;

                // Execute adopt as a transaction by sending account
                agroInstance.getProduceById.call(id, {
                    from: account
                }).then(value => {
                    console.log(value);

                    var span_element2 = document.getElementById(prefix.concat("getval1"));
                    var str = web3.toAscii(value[0]);
                    span_element2.innerHTML = str;

                    App.idFarmer = str;

                    var span_element2 = document.getElementById(prefix.concat("getval2"));
                    var str = web3.toAscii(value[1]);
                    span_element2.innerHTML = str;

                    var span_element3 = document.getElementById(prefix.concat("getval3"));
                    var str = web3.toAscii(value[2]);
                    span_element3.innerHTML = str;

                    var str = web3.toAscii(value[3]);
                    var span_element4 = document.getElementById(prefix.concat("getval4"));
                    span_element4.innerHTML = str;

                    var span_element5 = document.getElementById(prefix.concat("getval5"));
                    span_element5.innerHTML = value[4].valueOf();

                    var span_element6 = document.getElementById(prefix.concat("getval6"));
                    span_element6.innerHTML = value[5].valueOf();

                    var span_element7 = document.getElementById(prefix.concat("getval7"));
                    span_element7.innerHTML = value[6].valueOf();

                    setStatus("Transaction complete!");
                });

            }).catch(function (err) {
                console.log(err.message);
            });
        });

    },

    handlegetProduce: function () {

        var produceForm = $('#quality-test-form');
        var fid0 = produceForm.find('#fid1').val();

        App.handlegetProduceByID(fid0, "");
    },

    handlegetProduceQR: function (event) {

        setStatus("Initiating transaction... (please wait)");

        const maingetProduceQR = (values) => {

            //App.handlegetProduceByID(values.fid, "");
            $("#fid1").val(values.fid);
        };

        readQR('file', 'qrcode0', 'quality-test-table', maingetProduceQR);


    },
    handlegetQualityQR: function (event) {

        setStatus("Initiating transaction... (please wait)");

        const maingetQualityQR = (values) => {
            data = (JSON.parse(values));
            App.handlegetProduceByID(data.fid, "c");
            App.handlegetQualityById(data.lid);
        };

        readQR('fileQ', 'qrcode1', 'customer-table', maingetQualityQR);


    },

    handlegetQuality: function (event) {
        var fid = document.getElementById("getfid").value;
        var lid = document.getElementById("lotnum").value;


        setStatus("Initiating transaction... (please wait)");

        App.handlegetProduceByID(fid, "c");
        App.handlegetQualityById(lid);


    },

    handlegetQualityById: function (lid) {
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];
            App.contracts.AgroChain.deployed().then(instance => {
                var agroInstance = instance;
                agroInstance.getQualityById.call(lid, {
                    from: account
                }).then(value => {
                    console.log(value);

                    var str = web3.toAscii(value[0]);
                    var cspan_element1 = document.getElementById("cgetval8");
                    cspan_element1.innerHTML = str;

                    var str = web3.toAscii(value[1]);
                    var cspan_element1 = document.getElementById("cgetval9");
                    cspan_element1.innerHTML = str;

                    //var str = web3.toAscii(value[2]);
                    var cspan_element1 = document.getElementById("cgetval10");
                    cspan_element1.innerHTML = value[2];

                    var str = web3.toAscii(value[3]);
                    var cspan_element1 = document.getElementById("cgetval11");
                    cspan_element1.innerHTML = str;

                    var str = web3.toAscii(value[4]);
                    var cspan_element1 = document.getElementById("cgetval12");
                    cspan_element1.innerHTML = str;

                    setStatus("Transaction complete!");
                });
            });


        });
    },
    handleAdopt: function (event) {
        event.preventDefault();

        var petId = parseInt($(event.target).data('id'));

        var adoptionInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.AgroChain.deployed().then(function (instance) {
                adoptionInstance = instance;

                // Execute adopt as a transaction by sending account
                return adoptionInstance.adopt(petId, {
                    from: account
                });
            }).then(function (result) {
                return App.markAdopted();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    printBlock: function (event) {
        event.preventDefault();

        web3.eth.getBlock('latest', function (err, block) {
            App.lastTX = block.hash;
            console.log("Block number     : " + block.number + "\n" +
                "\thash            : " + block.hash + "\n" +
                "\tparentHash      : " + block.parentHash + "\n" +
                "\tnonce           : " + block.nonce + "\n" +
                "\tsha3Uncles      : " + block.sha3Uncles + "\n" +
                "\tlogsBloom       : " + block.logsBloom + "\n" +
                "\ttransactionsRoot: " + block.transactionsRoot + "\n" +
                "\tstateRoot       : " + block.stateRoot + "\n" +
                "\tminer           : " + block.miner + "\n" +
                "\tdifficulty      : " + block.difficulty + "\n" +
                "\ttotalDifficulty : " + block.totalDifficulty + "\n" +
                "\textraData       : " + block.extraData + "\n" +
                "\tsize            : " + block.size + "\n" +
                "\tgasLimit        : " + block.gasLimit + "\n" +
                "\tgasUsed         : " + block.gasUsed + "\n" +
                "\ttimestamp       : " + block.timestamp + "\n" +
                "\ttransactions    : " + block.transactions + "\n" +
                "\tuncles          : " + block.uncles);

            if (block.transactions != null) {
                console.log("--- transactions ---");
                block.transactions.forEach(function (e) {
                    App.printTransaction(e);
                })
            }

            var blocknum = document.getElementById("blocknum");
            blocknum.innerHTML = block.number.valueOf();

        });


    },
    printTransaction: function (txHash) {

        console.log(txHash);
        web3.eth.getTransaction(txHash, (callback, TX) => {
            if (TX != null) {
                console.log("  TX hash          : " + TX.hash + "\n" +
                    "   nonce           : " + TX.nonce + "\n" +
                    "   blockHash       : " + TX.blockHash + "\n" +
                    "   blockNumber     : " + TX.blockNumber + "\n" +
                    "   transactionIndex: " + TX.transactionIndex + "\n" +
                    "   from            : " + TX.from + "\n" +
                    "   to              : " + TX.to + "\n" +
                    "   value           : " + TX.value + "\n" +
                    "   gasPrice        : " + TX.gasPrice + "\n" +
                    "   gas             : " + TX.gas + "\n" +
                    "   input           : " + TX.input);

            }
        });

    },


    printLastTransaction: function () {

        web3.eth.getBlock('latest', function (err, block) {

            if (block.transactions != null) {
                console.log("--- Latest Transaction ---");

                App.printTransaction(block.transactions[0]);
            }

            var blocknum = document.getElementById("blocknum");
            blocknum.innerHTML = block.number.valueOf();

        });

    },

    handleFund: function (event) {
        event.preventDefault();
        var amount = parseInt(document.getElementById("amount").value);
        var receiver = parseInt(document.getElementById("pfid").value);

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];
            App.contracts.AgroChain.deployed().then(instance => {
                var agroInstance = instance;
                agroInstance.sendCoin(receiver, amount, parseInt(account), {
                        from: account,
                        gas: 700000
                    })
                    .then((values) => {
                        console.log("Transaction complete!");
                        console.log(values);
                    })
                    .catch(function (e) {
                        console.log(e);

                    });
            })
        });
    }
};


$(function () {
    $(window).load(function () {
        App.init();
        $("#approve-form").hide();
        $("#quality-test-form").hide();

        const metaweb3 = new Web3(App.web3Provider);
        const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        console.log('executed');

        $("#log-in-form").show();
        metaweb3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            console.log(accs);
            account = accs[0];
            var from_address = document.getElementById('SenderBalance');
            from_address.innerHTML = metaweb3.eth.accounts[0].valueOf();

        });
    });
});

