import {Box, Center, Text} from "@chakra-ui/react";
import {useState} from "react";


const Song = () : JSX.Element => {  
    const [songName, setSongName] = useState("")
    return (
        <>
            <Box bg={'gray.200'} minH={'40vh'}>
                <Center>
                    <Text fontSize='6xl'>
                        Hello
                    </Text>
                </Center>
            </Box>
        </>
    )
}

export default Song
