import React, { useState, useEffect } from 'react'
import { Icon, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

export default function LikeButton({ user, post: { id, likes, likeCount } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if(user && likes.find(like => like.username === user.username)){
      setLiked(true)
    } else setLiked(false)
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

//   const likeButton = user ? (
//     liked ? (
//         <span onClick={() => likePost()}>you liked</span>
//     ) : (
//         <span onClick={() => likePost()}>wanna to like?</span>
//     )
// ) : (
//     <Link to="/login">login first</Link>
// );

// return (
//     <div>
//         <span>{likeCount} </span>
//         <span> {likeButton}</span>
//     </div>
// )

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
        {/* Like */}
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
        {/* Like */}
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
      {/* Like */}
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      {likeButton}
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}


const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;