import { useContext, useState } from "react"
import { useDebounce } from "../../../hooks/useDebounce"
import { UserContext } from "../../../utils/auth/UserProvider"
import { ChannelListItem } from "@/utils/channel/ChannelListProvider"
import { AddMembersButton } from "./add-members/AddMembersButton"
import { Box, Flex, TextField, Text } from "@radix-ui/themes"
import { BiSearch, BiCircle, BiSolidCrown } from "react-icons/bi"
import { UserAvatar } from "@/components/common/UserAvatar"
import { UserActionsMenu } from "./UserActions/UserActionsMenu"
import { ChannelMembers } from "@/hooks/fetchers/useFetchChannelMembers"

interface MemberDetailsProps {
    channelData: ChannelListItem,
    channelMembers: ChannelMembers,
    activeUsers: string[],
    updateMembers: () => void
}

export const ChannelMemberDetails = ({ channelData, channelMembers, activeUsers, updateMembers }: MemberDetailsProps) => {

    const [searchText, setSearchText] = useState("")
    const debouncedText = useDebounce(searchText, 50)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
    }

    const { currentUser } = useContext(UserContext)

    const channelMembersArray = Object.values(channelMembers)

    const filteredMembers = channelMembersArray.filter((member) =>
        member?.full_name?.toLowerCase().includes(debouncedText.toLowerCase())
    )

    return (
        <Flex direction='column' gap='4' className={'h-[66vh] pb-2 sm:h-96'}>
            <Flex gap='2' justify='between'>
                <div className={'w-full sm:w-full'}>
                    <TextField.Root>
                        <TextField.Slot>
                            <BiSearch />
                        </TextField.Slot>
                        <TextField.Input autoFocus placeholder='Find members' onChange={handleChange} value={debouncedText} />
                    </TextField.Root>
                </div>
                {/* if current user is a channel member and the channel is not a open channel, user can add more members to the channel */}
                {channelMembers[currentUser] && channelData.type !== 'Open' && channelData.is_archived == 0 &&
                    <div>
                        <AddMembersButton
                            channelData={channelData}
                            variant='soft'
                            size='2'
                        />
                    </div>
                }
            </Flex>


            <Box className={'overflow-hidden overflow-y-scroll'}>

                <Flex direction='column' gap='2'>

                    {filteredMembers.length > 0 ? (
                        <Flex direction='column'>
                            {filteredMembers.map(member => (
                                <Box key={member.name} className={'hover:bg-slate-3 rounded-md'}>
                                    <Flex justify='between' className={'pr-3'}>
                                        <Flex className={'p-2'} gap='3'>
                                            <UserAvatar src={member.user_image ?? ''} alt={member.full_name} size='2' isActive={activeUsers.includes(member.name)} />
                                            <Flex gap='2' align={'center'}>
                                                <Text weight='medium'>{member.first_name}</Text>
                                                {activeUsers.includes(member.name) ? (
                                                    <BiCircle color='green' />
                                                ) : (
                                                    <BiCircle />
                                                )}
                                                <Flex gap='1'>
                                                    <Text weight='light' size='1'>{member.full_name}</Text>
                                                    {member.name === currentUser && <Text weight='light' size='1'>(You)</Text>}
                                                    {channelMembers[member.name].is_admin == 1 && <Flex align="center"><BiSolidCrown color='#FFC53D' /></Flex>}
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                        {/* if current user is a channel member and admin they can remove users other than themselves if the channel is not open */}
                                        {channelMembers[currentUser] &&
                                            channelMembers[currentUser].is_admin === 1 &&
                                            member.name !== currentUser &&
                                            channelData?.type !== 'Open' && channelData.is_archived == 0 &&
                                            <Flex align="center">
                                                <UserActionsMenu
                                                    channelData={channelData}
                                                    updateMembers={updateMembers}
                                                    selectedMember={member} />
                                            </Flex>
                                        }
                                    </Flex>
                                </Box>
                            ))}
                        </Flex>
                    ) : (
                        <Box className={'text-center h-10'}>
                            <Text size='1'>
                                No matches found for <strong>{searchText}</strong>
                            </Text>
                        </Box>
                    )}
                </Flex>
            </Box>
        </Flex>
    )
}