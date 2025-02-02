import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { PlatformType } from "types"
import fetcher from "utils/fetcher"

const useDisconnect = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateUser, id: userId } = useUser()
  const toast = useToast()

  const submit = async (signedValidation: SignedValidation) => {
    const { platformName } = JSON.parse(signedValidation.signedPayload)

    return fetcher(
      `/v2/users/${userId}/platform-users/${PlatformType[platformName]}`,
      {
        method: "DELETE",
        ...signedValidation,
      }
    )
  }

  return useSubmitWithSign<{ platformId: number }>(submit, {
    onSuccess: ({ platformId }) => {
      mutateUser(
        (prev) => ({
          ...prev,
          platformUsers: (prev?.platformUsers ?? []).filter(
            (prevPlatformUser) => prevPlatformUser.platformId !== platformId
          ),
        }),
        { revalidate: false }
      )

      toast({
        title: `Account disconnected!`,
        status: "success",
      })

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

const useDisconnectAddress = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateUser, id: userId } = useUser()
  const toast = useToast()

  const submit = async (signedValidation: SignedValidation) => {
    const { address: addressFromValidation } = JSON.parse(
      signedValidation.signedPayload
    )
    return fetcher(`/v2/users/${userId}/addresses/${addressFromValidation}`, {
      method: "DELETE",
      ...signedValidation,
    }).then(() => addressFromValidation)
  }

  return useSubmitWithSign(submit, {
    onSuccess: (deletedAddress) => {
      mutateUser(
        (prev) => ({
          ...prev,
          addresses: (prev?.addresses ?? []).filter(
            ({ address: a }) => a !== deletedAddress
          ),
        }),
        { revalidate: false }
      )

      toast({
        title: `Account disconnected!`,
        status: "success",
      })

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

const useDisconnectEmail = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateUser, id: userId } = useUser()
  const toast = useToast()

  const submit = async (signedValidation: SignedValidation) => {
    const { emailAddress } = JSON.parse(signedValidation.signedPayload)

    return fetcher(`/v2/users/${userId}/emails/${emailAddress}`, {
      method: "DELETE",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<{
    platformId: number
    deletedEmailAddress?: string
  }>(submit, {
    onSuccess: () => {
      mutateUser(
        (prev) => ({
          ...prev,
          emails: undefined,
        }),
        { revalidate: false }
      )

      toast({
        title: `Email address disconnected!`,
        status: "success",
      })

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })

  return {
    ...submitWithSign,
    onSubmit: (emailAddress: string) => submitWithSign.onSubmit({ emailAddress }),
  }
}

export { useDisconnectAddress, useDisconnectEmail }
export default useDisconnect
