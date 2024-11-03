import React from "react";
import styled from "styled-components";
import Button from "./buttons/button";
import { useLocation, useNavigate } from "react-router";
import { 
  CreateRounded, 
  AddRounded, 
  WebRounded 
} from "@mui/icons-material";

const Container = styled.div`
  background: ${({ theme }) => theme.navbar};
  color: ${({ theme }) => theme.menu_primary_text};
  font-weight: 700;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 5%;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid ${({ theme }) => theme.divider};
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 600px) {
    padding: 14px 16px;
    font-size: 20px;
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  cursor: pointer;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 800;
  font-family: 'Poppins', sans-serif;
  
  span {
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.primary}, 
      ${({ theme }) => theme.secondary}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  svg {
    font-size: 32px;
    color: ${({ theme }) => theme.primary};
  }
`;

const SubText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  letter-spacing: 0.5px;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let path = location.pathname.split("/");

  const gotoCreatePost = () => {
    navigate("/post");
  };
  const gottoHome = () => {
    navigate("/");
  };
  console.log(path);
  return (
    <Container>
      <Logo onClick={gottoHome}>
        <LogoWrapper>
          <CreateRounded />
          <span>VisionCraft</span>
        </LogoWrapper>
        <SubText>Craft Your Imagination</SubText>
      </Logo>
      {path[1] === "post" ? (
        <Button
          text="Explore Gallery"
          leftIcon={<WebRounded />}
          onClick={gottoHome}
          type="secondary"
        />
      ) : (
        <Button
          text="Create Magic"
          leftIcon={<AddRounded />}
          onClick={gotoCreatePost}
        />
      )}
    </Container>
  );
};

export default Navbar;
