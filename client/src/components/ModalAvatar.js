import React, { useState, useContext } from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

import { AuthContext } from '../context/auth';

function ModalAvatar(props) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(props.urlImage);

  const [changePic, { error }] = useMutation(UPLOAD_IMAGE, {
    update(_, {data: {createNewAva: userData}}) {
      // console.log(userData);
      user.urlImage = userData.urlImage;
      props.history.push('/');
    },
    // onError(err){
    //   setErrors(err.graphQLErrors[0].extensions.exception.errors);
    // },
    variables: {urlImage: previewUrl},
  });

  const chooseNewAvatar = () => {
    // console.log(previewUrl);
    changePic();
    setOpen(false)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Image as='a' floated="right" size="mini" src={previewUrl} />}
    >
      <Modal.Header>Select a Photo</Modal.Header>
      <Modal.Content image>
        <Image size="medium" src={previewUrl} wrapped />
        <Modal.Description>
          <Header>Default Profile Image</Header>
          <Image.Group size="tiny">
          <Image src="images/alex.jpg" alt="alex" onClick={() => setPreviewUrl("images/alex.jpg")} />
          <Image src="images/jon.jpg" alt="jon" onClick={() => setPreviewUrl("images/jon.jpg")} />
          <Image src="images/tom.jpg" alt="tom" onClick={() => setPreviewUrl("images/tom.jpg")} />
          <Image src="images/matthew.png" alt="matthew" onClick={() => setPreviewUrl("/images/matthew.png")} />
          <Image src="images/molly.png" alt="molly" onClick={() => setPreviewUrl("images/molly.png")} />
        </Image.Group>
          <p>Is it okay to use this photo?</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Nope
        </Button>
        <Button
          content="Yep, that's me"
          labelPosition="right"
          icon="checkmark"
          onClick={chooseNewAvatar}
          // onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

const UPLOAD_IMAGE = gql`
  mutation createNewAva($urlImage: String!) {
    createNewAva(urlImage: $urlImage) {
      urlImage
    }
  }
`;

export default ModalAvatar