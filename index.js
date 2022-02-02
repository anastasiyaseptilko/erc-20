require('dotenv').config();
const Web3 = require("web3");
const contractAbi = require("./contract-abi/abi.json")

async function main() {
    const provider = new Web3(new Web3.providers.HttpProvider(process.env.URL));

    const contract = new provider.eth.Contract(
        contractAbi.abi,
        process.env.CONTRACT_ADDRESS
    );

    const options = {
        fromBlock: process.env.INITIAL_BLOCK,
        toBlock: process.env.FINAL_BLOCK,
    };

    const events = await contract.getPastEvents('Transfer', options);

    const result = events.reduce((result, event) => {
        return {
            ...result,
            [event.returnValues.from]: (result[event.returnValues.from] || 0) - Number(event.returnValues.value),
            [event.returnValues.to]: (result[event.returnValues.to] || 0) + Number(event.returnValues.value)
          };
    }, {});

    return result;
}

main()
    .then((result) => {
        console.log(result);
        process.exit(0);
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
