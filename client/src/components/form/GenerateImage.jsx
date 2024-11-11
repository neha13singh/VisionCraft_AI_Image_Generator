import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AutoAwesome, CreateRounded } from "@mui/icons-material";
import TextInput from "../Input/TextInput";
import Button from "../buttons/button";
import { CreatePost, GenerateImageFromPrompt } from "../../api";

const Form = styled.div`
  width: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: ${({ theme }) => theme.card};
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  span {
    background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Desc = styled.div`
  font-size: 17px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

const Actions = styled.div`
  display: flex;
  flex: 1;
  gap: 8px;
`;

const GenerateImage = ({
  createPostLoading,
  setcreatePostLoading,
  generateImageLoading,
  setGenerateImageLoading,
  post,
  setPost,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const generateImage = async () => {
    try {
      setGenerateImageLoading(true);
      setError("");
      
      if (!post.prompt.trim()) {
        setError("Please enter a prompt");
        return;
      }

      console.log('🎨 Generating image with prompt:', post.prompt);
      const response = await GenerateImageFromPrompt({ prompt: post.prompt });
      
      if (!response?.data?.photo) {
        throw new Error("No image data received");
      }

      console.log('✅ Image generated successfully');
      setPost({
        ...post,
        photo: `data:image/jpeg;base64,${response.data.photo}`,
      });
    } catch (error) {
      console.error('❌ Image generation error:', error);
      setError(error?.response?.data?.message || "Failed to generate image");
    } finally {
      setGenerateImageLoading(false);
    }
  };
  const createPost = async () => {
    try {
      console.log('📝 Starting post creation...');
      setcreatePostLoading(true);
      setError("");

      if (!post.name || !post.prompt || !post.photo) {
        setError("All fields are required");
        return;
      }

      setError("Uploading image... This might take a moment.");

      const response = await CreatePost(post);
      console.log('✅ Post created successfully!');
      navigate("/");
    } catch (error) {
      console.error('❌ Create post error:', error);
      setError(
        error?.response?.data?.message || 
        "Failed to create post. Please try again."
      );
    } finally {
      setcreatePostLoading(false);
    }
  };

  return (
    <Form>
      <Top>
        <Title>
          Craft Your <span>Imagination</span>
        </Title>
        <Desc>
          Write your prompt according to the image you want to generate!
        </Desc>
      </Top>
      <Body>
        <TextInput
          label="Author"
          placeholder="Enter your name"
          name="name"
          value={post.name}
          handelChange={(e) => setPost({ ...post, name: e.target.value })}
        />
        <TextInput
          label="Image Prompt"
          placeholder="Write a detailed prompt about the image"
          name="prompt"
          textArea
          rows="8"
          value={post.prompt}
          handelChange={(e) => setPost({ ...post, prompt: e.target.value })}
        />
        {createPostLoading && (
          <div style={{ color: 'orange' }}>
            Uploading image... This may take a few moments...
          </div>
        )}
        {error && (
          <div style={{ color: 'red' }}>
            {error}
          </div>
        )}* You can post the
        AI Generated Image to showcase in the community!
      </Body>
      <Actions>
        <Button
          text="Generate Image"
          leftIcon={<AutoAwesome />}
          flex
          isLoading={generateImageLoading}
          isDisabled={post.prompt === ""}
          onClick={(e) => generateImage()}
        />
        <Button
          text="Post Image"
          leftIcon={<CreateRounded />}
          type="secondary"
          flex
          isDisabled={
            post.name === "" || post.photo === "" || post.prompt === ""
          }
          isLoading={createPostLoading}
          onClick={() => createPost()}
        />
      </Actions>
    </Form>
  );
};

export default GenerateImage;
