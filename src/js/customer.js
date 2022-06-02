

function setStatus(message) {
    //var status = document.getElementById('status');
    //status.innerHTML = message;
    console.log(message);
};

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
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
        $.getJSON('js/AgroChain.json', function (data) {
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

    bindEvents: function () {
        $(document).on('click', '.btn-selector', App.changeTabByOnClick);
        $(document).on('click', '.btn-getproduce', App.handlegetProduce);
        $(document).on('click', '.btn-upload', App.handlegetProduceQR);
        $(document).on('click', '.btn-uploadQ', App.handlegetQualityQR);
        $(document).on('click', '.btn-customer', App.handlegetQuality);
        $(document).on('click', '.btn-fund', App.handleFund);


    },

    changeTabByOnClick: function (event) {
        console.log(this);

        $('#form-selector').siblings().hide();
        $(this).siblings().removeClass('active');


        var btn_to_form = event.target.id;
        console.log(btn_to_form);
        $('#'.concat(btn_to_form)).addClass("active");
        btn_to_form = btn_to_form.split("-");
        btn_to_form[btn_to_form.length - 1] = 'form';
        btn_to_form = btn_to_form.join('-');
        console.log(btn_to_form);
        $('#'.concat(btn_to_form)).show();
        $('#head').show();
        $('#foot').show();
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

            App.handlegetProduceByID(values.fid, "");
        };

        readQR('file', 'qrcode0', 'quality-test-table', maingetProduceQR);


    },
    handlegetQualityQR: function (event) {

        setStatus("Initiating transaction... (please wait)");

        const maingetQualityQR = (values) => {
            data = (JSON.parse(values));
            //App.handlegetProduceByID(data.fid, "c");
            //App.handlegetQualityById(data.lid);
            $("#getfid").val(data.fid);
            $("#lotnum").val(data.lid);
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
        $("#finance-form").hide();


        const metaweb3 = new Web3(App.web3Provider);
        const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        var accounts = web3.eth.accounts;
        console.log('executed');

        metaweb3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }


            account = accs[0];
            var from_address = document.getElementById('SenderBalance');
            from_address.innerHTML = web3.eth.accounts[0].valueOf();

        });
    });
});

