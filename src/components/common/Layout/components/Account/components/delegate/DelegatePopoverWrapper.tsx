import {
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import useDelegateVaults from "components/common/Layout/components/Account/components/delegate/useDelegateVaults"
import Image from "next/image"
import { PropsWithChildren, useEffect, useState } from "react"
import useLinkVaults from "../AccountModal/hooks/useLinkVaults"

const DelegatePopoverWrapper = ({ children }: PropsWithChildren<unknown>) => {
  const { id } = useUser()
  const [isDismissed, setIsDismissed] = useState<boolean>(true)
  useEffect(() => {
    if (typeof id !== "number") {
      return
    }
    setIsDismissed(!!window.localStorage.getItem(`isDelegateDismissed_${id}`))
  }, [id])

  const vaults = useDelegateVaults()
  const linkVaults = useLinkVaults()

  return (
    <Popover isOpen={!isDismissed && vaults && vaults.length > 0}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>
          <HStack>
            <Image
              width={20}
              height={20}
              alt="Delegate.cash logo"
              src="/walletLogos/delegatecash.png"
            />
            <Text>Delegate.cash</Text>
          </HStack>
        </PopoverHeader>
        <PopoverBody>
          <VStack alignItems={"end"}>
            <Text>
              You have {vaults?.length === 1 ? "an" : vaults?.length} unlinked vault
              {vaults?.length === 1 ? "" : "s"}. Link{" "}
              {vaults?.length === 1 ? "it" : "them"} to gain accesses for vault
              assets!
            </Text>
            <HStack>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.localStorage.setItem(`isDelegateDismissed_${id}`, "true")
                  setIsDismissed(true)
                }}
              >
                Dismiss
              </Button>
              <Button
                isLoading={linkVaults.isLoading}
                loadingText={"Loading"}
                size="sm"
                onClick={() => {
                  linkVaults.onSubmit()
                }}
              >
                Link vault{vaults?.length === 1 ? "" : "s"}
              </Button>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default DelegatePopoverWrapper
