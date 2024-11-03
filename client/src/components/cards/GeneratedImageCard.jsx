import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  padding: 24px;
  border: 2px dashed ${({ theme }) => theme.primary_light};
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_secondary};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 400px;
  box-shadow: 0 4px 6px -1px ${({ theme }) => theme.bgLight};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -2px ${({ theme }) => theme.bgLight};
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

const GeneratedImageCard = ({ src, loading }) => {
  return (
    <Container>
      {loading ? (
        <>
          <CircularProgress
            sx={{ color: "inherit", width: "24px", height: "24px" }}
          />
          Generating Your Image . . .
        </>
      ) : src ? (
        <Image src={src} />
      ) : (
        <>Write a prompt to generate image</>
      )}
    </Container>
  );
};

export default GeneratedImageCard;
