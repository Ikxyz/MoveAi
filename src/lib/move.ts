import { getAptosWallets } from "@aptos-labs/wallet-standard";
import { AptosWallet, NetworkInfo, UserResponseStatus } from "@aptos-labs/wallet-standard";
import { Aptos, Network, AptosConfig, AccountAuthenticatorEd25519 } from "@aptos-labs/ts-sdk";
import { NightlyConnectAptosAdapter } from "@nightlylabs/wallet-selector-aptos";

let _adapter: any;

const networkInfo = {
	chainId: 27,
	name: Network.CUSTOM,
	fullnode: "https://aptos.testnet.bardock.movementlabs.xyz/v1",
	faucet: "https://aptos.testnet.bardock.movementlabs.xyz/",
	// url: "https://aptos.testnet.bardock.movementlabs.xyz/v1",
};

export const getAdapter = async (persisted = true) => {
	if (_adapter) return _adapter;
	_adapter = await NightlyConnectAptosAdapter.build({
		appMetadata: {
			name: "Moon",
			description: "Moon public sale",
			icon: "https://docs.nightly.app/img/logo.png",
		},
	});
	return _adapter;
};

let _provider: any;
export const getAptos = () => {
	if (_provider) return _provider;
	const aptosConfig = new AptosConfig(networkInfo as any);
	_provider = new Aptos(aptosConfig);
	return _provider;
};

let nightly;
if (typeof window !== "undefined") {
	nightly = (window as any).nightly;
}

export default class MoveWallet {
	static async connect() {
		const adapter = await getAdapter();
		const response = await adapter.connect();
		if (response.status === "Approved") {
			return response;
		}
	}

	static async disconnect() {
		const adapter = await getAdapter();
		await adapter.disconnect();
	}

	static async sendTransaction({ amount, from } = { amount: 0, from: "" }) {
		console.log({ from });
		const adapter = await getAdapter();
		const aptos = getAptos();

		console.log({ adapter, aptos });

		if (!aptos || !adapter) return;

		const transaction = await aptos.transaction.build.simple({
			sender: from,
			data: {
				function: "0x1::coin::transfer",
				typeArguments: ["0x1::aptos_coin::AptosCoin"],
				functionArguments: [
					"0xf731b5bcfa9f21d36c17dd9967f2bbe47e1fa8328f94219ef2500cc7a31366db",
					amount,
				],
			},
		});
		console.log({ transaction });
		const signedTx = await adapter.signAndSubmitTransaction({
			rawTransaction: transaction.rawTransaction,
		});
		await aptos.waitForTransaction({ transactionHash: signedTx.hash });
		console.log(`Committed transaction: ${signedTx.hash}`);
		if (signedTx.status !== UserResponseStatus.APPROVED) {
			throw new Error("Transaction rejected");
		}
	}
}
