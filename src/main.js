import { ethers } from "ethers";

const app = document.getElementById("app");

const button = document.createElement("button");
button.textContent = "💧 一键领取 0.5 ETH";
button.onclick = requestClaim;

const status = document.createElement("p");

app.appendChild(button);
app.appendChild(status);

async function requestClaim() {
  try {
    if (!window.ethereum) {
      return alert("请安装 MetaMask");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const message = "I want to claim test ETH";
    const signature = await signer.signMessage(message);

    status.textContent = "⏳ 请求发币中...";

    const response = await fetch(import.meta.env.VITE_API_URL + "/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, signature })
    });

    const text = await response.text();
    status.textContent = response.ok ? `✅ ${text}` : `❌ ${text}`;
  } catch (err) {
    console.error(err);
    status.textContent = "❌ 出错了：" + err.message;
  }
}
