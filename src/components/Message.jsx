// eslint-disable-next-line no-unused-vars
import React from 'react'
import { HStack,Avatar , Text } from '@chakra-ui/react';
// eslint-disable-next-line react/prop-types
const Message = ({text,uri,user = "other"}) => {
  return (
    <HStack alignSelf = {user === "me" ? "flex-end" : "flex-start"} borderRadius={"base"} bg = {user === "me" ? "#005c4b" : "#202c33"} paddingX={"4"} paddingY={"2"} color={"white"} >
        {
            user === "other" && <Avatar src = {uri}>
        }
        
        <Text>
            {text}
        </Text>
        {
            user === "me" && <Avatar src = {uri}/>
        }
        
    </HStack>
  )
}

export default Message;
