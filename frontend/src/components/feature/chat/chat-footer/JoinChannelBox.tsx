import { ErrorBanner } from "@/components/layout/AlertBanner/ErrorBanner"
import { ChannelListItem } from "@/utils/channel/ChannelListProvider"
import { useFrappeCreateDoc, useSWRConfig } from "frappe-react-sdk"
import { Box, Flex, Text, Button } from "@radix-ui/themes"
import { Loader } from "@/components/common/Loader"
import { ChannelMembers } from "@/hooks/fetchers/useFetchChannelMembers"
import { useParams } from "react-router-dom"
interface JoinChannelBoxProps {
    channelData?: ChannelListItem,
    channelMembers: ChannelMembers,
    user: string,
}

export const JoinChannelBox = ({ channelData, user }: JoinChannelBoxProps) => {

    const { mutate } = useSWRConfig()
    const { threadID } = useParams()

    const { createDoc, error, loading } = useFrappeCreateDoc()

    const joinChannel = async () => {
        return createDoc('Raven Channel Member', {
            channel_id: channelData ? channelData?.name : threadID,
            user_id: user
        }).then(() => {
            mutate(["channel_members", channelData ? channelData.name : threadID])
        })
    }

    return (
        <Box>
            <Flex
                direction='column'
                align='center'
                gap={channelData ? '3' : '2'}
                className="border-2 rounded-md bg-surface border-accent-a6 animate-fadein"
                p={channelData ? '4' : '3'}>
                <ErrorBanner error={error} />
                <Text as='span' size={'2'}>You are not a member of this {channelData ? 'channel' : 'thread'}.</Text>
                <Button
                    onClick={joinChannel}
                    size={channelData ? '2' : '1'}
                    disabled={loading}>
                    {loading && <Loader />}
                    {loading ? 'Joining' : <span className="inline-flex gap-1">Join {channelData ? `${channelData?.channel_name}` : "Conversation"}
                    </span>}
                </Button>
            </Flex>
        </Box>
    )
}