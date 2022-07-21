import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
  Center,
  Image,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import useDebouncedValue from '../hooks/useDebouncedValue'
import useChoices from '../store/store'
import ISong from '../types/SearchResults'
import SearchResult from './SearchResult'
import SongProps from '../types/Song'

const Song: React.FC<SongProps> = ({
  song,
  choice = -1,
}:SongProps) => {
  const [modalValue, setModalValue] = useState('')
  const [searchResults, setSearchResults] = useState<ISong[]>([])
  const debouncedTerm = useDebouncedValue(modalValue)

  const BlurOverlay = () => (
    <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px)' />
  )
  // TODO: Add focus to form when clicked button

  const { isOpen, onOpen, onClose } = useDisclosure()
  // const initialRef = React.useRef()
  // const finalRef = React.useRef()
  const [overlay, setOverlay] = useState(<BlurOverlay />)

  const addSelectedSong = useChoices((state) => state.addSelectedSong)

  useEffect(() => {
    const getSearchResults = () => {
      if (modalValue) {
        axios
          .get('/api/spotify/search', {
            params: {
              query: modalValue,
            },
          })
          .then(({ data }) => {
            setSearchResults(data)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
    getSearchResults()
  }, [debouncedTerm])

  return (
    <>
      <Box
        bg={'gray.200'}
        minH={'40vh'}
        onClick={() => {
          setOverlay(<BlurOverlay />)
          onOpen()
        }}
      >
        {song ? (
          <Center>
            <Image src={song.image} alt={song.name} maxH={'100px'} />
          </Center>
        ) : (
          <>{choice}</>
        )}
      </Box>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        motionPreset='slideInBottom'
        scrollBehavior='inside'
        size={'xl'}
        // initialFocusRef={initialRef}
        // finalFocusRef={finalRef}
      >
        {overlay}
        <ModalContent marginX={'20px'}>
          <ModalHeader>Select Song</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Song Name</FormLabel>
              <Input
                placeholder='Song Name, Ex: High On Life'
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
              />
            </FormControl>
            <Box>
              <UnorderedList>
                {searchResults
                  ? searchResults.map((song) => (
                      <ListItem key={song.id} marginY={'10px'}>
                        <button
                          onClick={() => {
                            addSelectedSong(choice, song)
                            onClose()
                          }}
                        >
                          <SearchResult
                            key={song.id}
                            id={song.id}
                            name={song.name}
                            artists={song.artists}
                            release_date={song.release_date}
                            image={song.image}
                            preview_url={song.preview_url}
                          />
                        </button>
                        {song.name}
                      </ListItem>
                    ))
                  : 'No Search Results Found.'}
              </UnorderedList>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Song
