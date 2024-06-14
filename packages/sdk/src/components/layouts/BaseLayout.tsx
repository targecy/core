import { PropsWithChildren } from 'react';
import { LayoutParams } from './Params';
import { Attribution, LayoutsType, defaultStyling } from '../../constants/ads';
import { QuestionOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const getSizesByLayout = (layout: LayoutsType) => {
  switch (layout) {
    case 'banner_large':
      return { width: '970px', height: '90px' };
    case 'banner_medium':
      return { width: '780px', height: '90px' };
    case 'banner_small':
      return { width: '300px', height: '50px' };
    case 'square':
      return { width: '400px', height: '400px' };
    case 'list_item':
      return { width: 'auto', height: 'auto' };
    default:
      throw new Error('Invalid layout');
  }
};

const Wrapper = styled.div<{ $width: string; $height: string; $cursor: string; $other: any }>`
  position: relative;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  minheight: ${(props) => props.$height};
  maxheight: ${(props) => props.$height};
  minwidth: ${(props) => props.$width};
  maxwidth: ${(props) => props.$width};
  overflow: auto;
  ${(props) => props.$other};
  &:hover {
    box-shadow: 3px 2px 2px rgb(36, 36, 36, 0.3) !important;
    transition: box-shadow 0.3s ease-in-out;
  }
`;

const LogoIcon = styled.div`
  padding: 5px;
  position: absolute;
  width: 27px;
  right: 2px;
  bottom: 2px;
  &:hover {
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease-in-out;
    border-radius: 50%;
  }
`;

const HelpIcon = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
  width: 26px;
  height: 26px;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  border-radius: 50%;
  text-align: center;
  transition: 0.5s;
  font-size: 12px;
  margin-top:;
  a {
    text-decoration: none;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease-in-out;
    border-radius: 50%;
  }
`;

export const BaseLayout = (props: PropsWithChildren<LayoutParams>) => {
  const { width, height } = getSizesByLayout(props.styling?.layout ?? defaultStyling.layout);

  return (
    <Wrapper
      $width={width}
      $height={height}
      $cursor={props.attribution == Attribution.click ? 'pointer' : 'default'}
      $other={{ ...props.styling, ...props.customStyling }}>
      <LogoIcon>
        <a href="http://targecy.xyz" about="targecy-url" target="_blank">
          <img src="https://framerusercontent.com/images/Mabf9byIdTDTxHw04ifwvi02k9M.png" alt="targecy"></img>
        </a>
      </LogoIcon>
      <a href="https://docs.targecy.xyz/enthusiasts/privacy-first-user-experience" about="targecy-url" target="_blank">
        <HelpIcon>
          <QuestionOutlined></QuestionOutlined>
        </HelpIcon>
      </a>
      {props.children}
    </Wrapper>
  );
};
