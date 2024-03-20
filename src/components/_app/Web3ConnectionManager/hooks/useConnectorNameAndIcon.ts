import { useColorMode } from "@chakra-ui/react"
import { useIsConnected } from "@fuel-wallet/react"
import { useMemo } from "react"
import { Connector, useAccount } from "wagmi"

const useConnectorNameAndIcon = (connectorParam?: Connector) => {
  const { connector: evmConnectorFromHook } = useAccount()
  const { isConnected: isFuelConnected } = useIsConnected()

  const connector = connectorParam ?? evmConnectorFromHook

  const { colorMode } = useColorMode()

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _window = typeof window === "undefined" ? ({} as any) : window
  // wrapping with useMemo to make sure it updates on window.ethereum change
  const isBraveWallet = useMemo(
    () => _window.ethereum?.isBraveWallet,
    [_window.ethereum]
  )
  const isOKXWallet = useMemo(() => !!_window.okxwallet, [_window.okxwallet])

  const connectorIcon =
    connector?.id === "injected"
      ? isBraveWallet
        ? "brave.png"
        : isOKXWallet
        ? "okx.png"
        : "metamask.png"
      : connector?.id === "walletConnect"
      ? "walletconnect.svg"
      : connector?.id === "safe"
      ? colorMode === "dark"
        ? "gnosis-safe-white.svg"
        : "gnosis-safe-black.svg"
      : connector?.id === "coinbaseWallet"
      ? "coinbasewallet.png"
      : isFuelConnected
      ? "fuel.svg"
      : null

  return {
    connectorName:
      connector?.id === "injected"
        ? isBraveWallet
          ? "Brave"
          : isOKXWallet
          ? "OKX Wallet"
          : "MetaMask"
        : connector?.name ?? (isFuelConnected ? "Fuel" : ""),
    connectorIcon,
  }
}

declare global {
  interface Window {
    okxwallet: any
  }
}

export default useConnectorNameAndIcon
