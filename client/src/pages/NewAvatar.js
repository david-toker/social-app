import React, { useContext, useState } from 'react';
import { Card, Icon, Image, Grid, Button } from 'semantic-ui-react';
import moment from 'moment';
import { gql, useMutation } from '@apollo/client';

import { AuthContext } from '../context/auth';

export default function NewAvatar(props) {
  const { user, userImage, saveNewImage } = useContext(AuthContext);
  const [previewUrl, setPreviewUrl] = useState(userImage);

  const [changePic, { error }] = useMutation(UPLOAD_IMAGE, {
    update(_, {data: {createNewAva: userData}}) {
      saveNewImage(userData.urlImage);
      props.history.push('/');
    },
    variables: {urlImage: previewUrl},
  });

  if(!user){
    props.history.push('/');
  }

  const chooseNewAvatar = () => {
    changePic();
  }

  return (
    <Grid centered>
      <Grid.Row>
        {user && (
          <Card>
            <Image src={previewUrl} />
            <Card.Content>
              <Card.Header>
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </Card.Header>
              <Card.Meta>
                <span className="date">
                  Joined in {moment(user.createdAt).format("MMM Do YY")}
                </span>
              </Card.Meta>
              <Card.Description>Add new image.</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name="mail" />
                {user.email}
              </a>
            </Card.Content>
            <Card.Content extra>
              <Button positive onClick={chooseNewAvatar}>Save</Button>
            </Card.Content>
          </Card>
        )}
      </Grid.Row>
      <Grid.Row>
        <Image.Group size="tiny">
          <Image src="images/alex.jpg" alt="alex" onClick={() => setPreviewUrl("images/alex.jpg")} />
          <Image src="images/jon.jpg" alt="jon" onClick={() => setPreviewUrl("images/jon.jpg")} />
          <Image src="images/tom.jpg" alt="tom" onClick={() => setPreviewUrl("images/tom.jpg")} />
          <Image src="images/matthew.png" alt="matthew" onClick={() => setPreviewUrl("images/matthew.png")} />
          <Image src="images/molly.png" alt="molly" onClick={() => setPreviewUrl("images/molly.png")} />
        </Image.Group>
      </Grid.Row>
    </Grid>
  );
}


const UPLOAD_IMAGE = gql`
  mutation createNewAva($urlImage: String!) {
    createNewAva(urlImage: $urlImage) {
      urlImage
    }
  }
`;