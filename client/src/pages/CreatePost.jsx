import React, { useState } from "react";
import styled from "styled-components";
import GenerateImage from "../components/form/GenerateImage";
import GeneratedImageCard from "../components/cards/GeneratedImageCard";

const Container = styled.div`
  padding: 40px 0;
  height: 100%;
  overflow-y: scroll;
  background: ${({ theme }) => theme.bg};
  width: 100%;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const CreatePost = () => {
  const [generateImageLoading, setGenerateImageLoading] = useState(false);
  const [createPostLoading, setcreatePostLoading] = useState(false);
  const [post, setPost] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  return (
    <Container>
      <Wrapper>
        <GenerateImage
          createPostLoading={createPostLoading}
          setcreatePostLoading={setcreatePostLoading}
          generateImageLoading={generateImageLoading}
          setGenerateImageLoading={setGenerateImageLoading}
          post={post}
          setPost={setPost}
        />
        <GeneratedImageCard loading={generateImageLoading} src={post.photo} />
      </Wrapper>
    </Container>
  );
};

export default CreatePost;
