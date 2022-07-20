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
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useDebouncedValue from '../hooks/useDebouncedValue'
import useIsAuthenticated from '../hooks/useIsAuthenticated'
import ISearchResult from '../types/SearchResults'
import Song from './Song'

function BackdropExample() {
  const [modalValue, setModalValue] = useState('')
  const [currentSelection, setCurrentSelection] = useState<ISearchResult>()
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([])

  const debouncedTerm = useDebouncedValue(modalValue)
  const isAuthenticated = useIsAuthenticated()
  const token = sessionStorage.getItem('token')

  useEffect(() => {
    const getSearchResults = async () => {
      if (token && modalValue && isAuthenticated) {
        axios
          .get('/api/spotify/search', {
            headers: {
              Token: token,
            },
            params: {
              query: modalValue,
            },
          })
          .then(({ data }) => {
            setSearchResults(data)
            console.log(data)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
    getSearchResults()
  }, [debouncedTerm])

  useEffect(() => {
    console.log('Current selection lol', currentSelection)
  }, [currentSelection])

  const BlurOverlay = () => (
    <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px)' />
  )

  // TODO: Add focus to form when clicked button

  const { isOpen, onOpen, onClose } = useDisclosure()
  // const initialRef = React.useRef()
  // const finalRef = React.useRef()
  const [overlay, setOverlay] = React.useState(<BlurOverlay />)

  return (
    <>
      <Button
        marginY={'10px'}
        onClick={() => {
          setOverlay(<BlurOverlay />)
          onOpen()
        }}
      >
        Use Overlay one
      </Button>

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
                            setCurrentSelection(song)
                            onClose()
                          }}
                        >
                          <Song
                            key={song.id}
                            id={song.id}
                            name={song.name}
                            artists={song.artists}
                            release_date={song.release_date}
                            image={song.image}
                            preview_url={song.preview_url}
                          />
                        </button>
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

export default BackdropExample
